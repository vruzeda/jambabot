const request = require('request');
const iconvlite = require('iconv-lite');

const mongodb = require('./mongodb');

(() => {
  function getJambaForDate(date, callback) {
    mongodb.findJambaForDate(date, (error, jambaForDate) => {
      if (error) {
        callback(error, undefined);
        return;
      }

      if (jambaForDate) {
        callback(null, jambaForDate);
      } else {
        const today = new Date();
        if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
          updateJambasFromSite((errorUpdateFromSite) => {
            if (errorUpdateFromSite) {
              callback(errorUpdateFromSite, undefined);
              return;
            }

            mongodb.findJambaForDate(date, (errorFindJambaForDate, jamba) => {
              if (errorFindJambaForDate) {
                callback(errorFindJambaForDate, undefined);
                return;
              }

              if (!jamba) {
                callback(new Error(`The jamba for ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} is unavailable!`), undefined);
              }

              callback(null, jamba);
            });
          });
        } else {
          callback(new Error(`The jamba for ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} is unavailable!`), undefined);
        }
      }
    });
  }

  function updateJambasFromSite(callback) {
    request({ url: 'http://www.refeicoesjambalaya.com.br/cardapio.asp', encoding: null }, (error, response) => {
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

      const validJambas = jambas.reduce((dishes, jamba) => dishes.concat(jamba.mainDishes), []);
      mongodb.saveDishes(validJambas, (errorsSaveDishes) => {
        if (errorsSaveDishes.filter(errorSaveDishes => errorSaveDishes).length > 0) {
          callback(new Error('Couldn\'t save all dishes from site.'));
          return;
        }

        mongodb.saveJambas(jambas, (errorsSaveJambas) => {
          if (errorsSaveJambas.filter(errorSaveJambas => errorSaveJambas).length > 0) {
            callback(new Error('Couldn\'t save all jambas from site.'));
            return;
          }

          callback(null);
        });
      });
    });
  }

  function parseJambaForDateFromParagraph(date, OriginalParagraph) {
    let paragraph = OriginalParagraph.replace(/<b>/g, '');
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
    return jambaLine.substring(jambaLine.indexOf(header) + header.length).split(' - ')
      .reduce((foods, lineComponent) => {
        if (lineComponent.length > 0) {
          foods.push(lineComponent.trim());
        }

        return foods;
      }, []);
  }

  module.exports = {
    getJambaForDate,
    updateJambasFromSite
  };
})();
