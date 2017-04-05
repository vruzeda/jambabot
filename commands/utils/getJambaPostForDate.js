const googleImages = require('../../integrations/googleImages');
const jambalaya = require('../../integrations/jambalaya');
const mongodb = require('../../integrations/mongodb');

(() => {
  function checkDate(date, callback) {
    // Check if the date is in the current month (and year, just for safety)
    const today = new Date();
    if (date.getMonth() !== today.getMonth() || date.getFullYear() !== today.getFullYear()) {
      callback(`O cardápio para ${date.getDate()}/${date.getMonth() + 1} não está disponível!`);
      return false;
    }

    // Check if the date is a sunday
    if (date.getDay() === 0) {
      callback('O Jambalaya não abre de domingos!');
      return false;
    }

    return true;
  }
  function getJambaPostForDate(callback, date) {
    if (!checkDate(date, callback)) {
      return;
    }

    jambalaya.getJambaForDate(date, (error, jamba) => {
      if (error) {
        callback('O site do Jamba está fora do ar :cry:\n' +
          'Dá uma checada no <https://www.ifood.com.br/delivery/campinas-sp/jambalaya-refeicoes-jardim-flamboyant|iFood>...\n' +
          'Ou liga lá: <tel:1932513928|(19) 3251-3928> | <tel:1932537573|(19) 3253-7573>\n\n(Ou <#C0HNHSCP9>, ' +
          'fazer o quê :stuck_out_tongue_winking_eye:)');
        return;
      }

      if (!jamba) {
        callback(`O cardápio para ${date.getDate()}/${date.getMonth() + 1} não está disponível!`);
        return;
      }

      let header = '';
      let body = '';
      let footer = '';

      const today = new Date();
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (date.getTime() < today.getTime()) {
        header = '*TOO LATE!* :marco:\n\n';
      } else if (date.getTime() >= tomorrow.getTime()) {
        header = '*SPOILER* :junim:\n\n';
      } else {
        if (today.getHours() >= 10 && today.getHours() < 11) {
          header = '*AINDA NÃO PEDIU?*\n\n';
        } else if (today.getHours() >= 11) {
          header = '*TOO LATE!* :marco:\n\n';
        }

        footer = '\n\n<https://www.ifood.com.br/delivery/campinas-sp/jambalaya-refeicoes-jardim-flamboyant|Pedir>';
      }

      getImageForMainDishes(jamba.mainDishes, (images) => {
        getRatingsForMainDishes(jamba.mainDishes, (ratings) => {
          if (jamba.mainDishes.length > 0) {
            body += 'Pratos principais: ';

            jamba.mainDishes.forEach((mainDish, i) => {
              const image = images[i];
              const rating = ratings[i];

              body += `\n- :arrow_up_small: ${rating.upvotes} :arrow_down_small: ${rating.downvotes} `;

              if (image) {
                body += `<${image}|${mainDish}>`;
              } else {
                body += mainDish;
              }
            });
          }

          if (jamba.garnishes.length > 0) {
            if (body.length > 0) {
              body += '\n';
            }

            body += `Guarnições: ${jamba.garnishes.join(' - ')}`;
          }

          if (jamba.salads.length > 0) {
            if (body.length > 0) {
              body += '\n';
            }

            body += `Saladas: ${jamba.salads.join(' - ')}`;
          }

          callback(header + body + footer);
        });
      });
    });
  }

  function getImageForMainDishes(mainDishes, callback) {
    recursivelyGetImageForMainDishes(mainDishes, 0, [], callback);
  }

  function recursivelyGetImageForMainDishes(mainDishes, index, images, callback) {
    if (index < mainDishes.length) {
      console.log(`Getting image for ${mainDishes[index]} (${index + 1} of ${mainDishes.length})`);

      getImage(mainDishes[index], (error, image) => {
        images.push(image);
        recursivelyGetImageForMainDishes(mainDishes, index + 1, images, callback);
      });
    } else {
      callback(images);
    }
  }

  function getImage(query, callback) {
    mongodb.getImageForDish(query, (error, preDefinedImage) => {
      if (preDefinedImage) {
        callback(null, preDefinedImage);
        return;
      }

      googleImages.getRandomImage(query, callback);
    });
  }

  function getRatingsForMainDishes(mainDishes, callback) {
    recursivelyGetRatingsForMainDishes(mainDishes, 0, [], callback);
  }

  function recursivelyGetRatingsForMainDishes(mainDishes, index, ratings, callback) {
    if (index < mainDishes.length) {
      console.log(`Getting ratings for ${mainDishes[index]} (${index + 1} of ${mainDishes.length})`);

      mongodb.getDishRating(mainDishes[index], (error, rating) => {
        ratings.push(rating || { upvotes: 0, downvotes: 0 });
        recursivelyGetRatingsForMainDishes(mainDishes, index + 1, ratings, callback);
      });
    } else {
      callback(ratings);
    }
  }

  module.exports = getJambaPostForDate;
})();
