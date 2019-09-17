const request = require('request');
const iconvlite = require('iconv-lite');

const mongodb = require('./mongodb');

(() => {
  function getJambaForDate(date) {
    return mongodb.findJambaForDate(date)
      .then((storedJambaForDate) => {
        if (storedJambaForDate) {
          return storedJambaForDate;
        }

        const today = new Date();
        if (date.getMonth() !== today.getMonth() || date.getFullYear() !== today.getFullYear()) {
          throw new Error(`The jamba for ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} is unavailable!`);
        }

        return updateJambasFromSite()
          .then(() => mongodb.findJambaForDate(date))
          .then((jamba) => {
            if (!jamba) {
              throw new Error(`The jamba for ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} is unavailable!`);
            }

            return jamba;
          });
      });
  }

  function updateJambasFromSite() {
    return getJambasFromSite()
      .then((jambas) => {
        const mainDishes = jambas.reduce((dishes, jamba) => dishes.concat(jamba.mainDishes), []);
        return mongodb.saveDishes(mainDishes)
          .catch(() => {
            throw new Error('Couldn\'t save all dishes from site.');
          })
          .then(() => mongodb.saveJambas(jambas)
            .catch(() => {
              throw new Error('Couldn\'t save all jambas from site.');
            }));
      });
  }

  function getJambasFromSite() {
    return new Promise((resolve) => {
      request({ url: 'http://www.refeicoesjambalaya.com.br/cardapio.asp', encoding: null }, (_error, response) => {
        const jambaSite = iconvlite.decode(response.body, 'iso-8859-1');
        const paragraphs = jambaSite.split('<p>');
        const today = new Date();

        const jambas = [];

        for (let day = 1; day <= 31; day += 1) {
          for (let i = 0; i < paragraphs.length; i += 1) {
            const paragraph = paragraphs[i];
            if (paragraph.includes(`Dia: ${day} `)) {
              const date = new Date(today.getFullYear(), today.getMonth(), day);
              const jamba = parseJambaForDateFromParagraph(date, paragraph);
              jambas.push(jamba);
            }
          }
        }

        resolve(jambas);
      });
    });
  }

  function parseJambaForDateFromParagraph(date, originalParagraph) {
    let paragraph = originalParagraph.replace(/<b>/g, '');
    paragraph = paragraph.replace(/<\/b>/g, '');
    paragraph = paragraph.replace(/<font[^>]*>/g, '');
    paragraph = paragraph.replace(/<\/font>/g, '');
    paragraph = paragraph.replace(/<br>/g, '\n');

    const jamba = {};
    jamba.date = date;
    jamba.mainDishes = [];
    jamba.garnishes = [];
    jamba.salads = [];

    paragraph.split('\n').forEach((line) => {
      if (line.includes('Pratos principais: ')) {
        jamba.mainDishes = parseJambaLine(line, 'Pratos principais: ');
      } else if (line.includes('Guarnições: ')) {
        jamba.garnishes = parseJambaLine(line, 'Guarnições: ');
      } else if (line.includes('Saladas: ')) {
        jamba.salads = parseJambaLine(line, 'Saladas: ');
      }
    });

    return jamba;
  }

  function parseJambaLine(jambaLine, header) {
    const lines = jambaLine.substring(jambaLine.indexOf(header) + header.length).split(' - ');
    return lines.filter(line => line.trim().length > 0);
  }

  module.exports = {
    getJambaForDate,
    updateJambasFromSite
  };
})();
