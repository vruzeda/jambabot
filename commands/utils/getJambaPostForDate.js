const googleImages = require('../../integrations/googleImages');
const jambalaya = require('../../integrations/jambalaya');
const mongodb = require('../../integrations/mongodb');

(() => {
  function getJambaPostForDate(date, callback) {
    checkValidDate(date)
      .then(() => getJambaForDate(date))
      .then(jamba => generatePostText(date, jamba))
      .then(callback)
      .catch(callback);
  }


  function checkValidDate(date) {
    return new Promise((resolve, reject) => {
      // Check if the date is in the current month (and year, just for safety)
      const today = new Date();
      if (date.getMonth() !== today.getMonth() || date.getFullYear() !== today.getFullYear()) {
        reject(`O cardápio para ${date.getDate()}/${date.getMonth() + 1} não está disponível!`);
        return;
      }

      // Check if the date is a sunday
      if (date.getDay() === 0) {
        reject('O Jambalaya não abre de domingos!');
        return;
      }

      resolve(true);
    });
  }


  function getJambaForDate(date) {
    return new Promise((resolve, reject) => {
      jambalaya.getJambaForDate(date, (error, jamba) => {
        if (error) {
          reject('O site do Jamba está fora do ar :cry:\n' +
            'Dá uma checada no <https://www.ifood.com.br/delivery/campinas-sp/jambalaya-refeicoes-jardim-flamboyant|iFood>...\n' +
            'Ou liga lá: <tel:1932513928|(19) 3251-3928> | <tel:1932537573|(19) 3253-7573>\n\n(Ou <#C0HNHSCP9>, ' +
            'fazer o quê :stuck_out_tongue_winking_eye:)');
          return;
        }

        if (!jamba) {
          reject(`O cardápio para ${date.getDate()}/${date.getMonth() + 1} não está disponível!`);
          return;
        }

        resolve(jamba);
      });
    });
  }


  function generatePostText(date, jamba) {
    return new Promise((resolve) => {
      const post = {
        header: '',
        body: [],
        footer: ''
      };

      generatePostHeaderAndFooter(date, post);

      getImageForMainDishes(jamba.mainDishes, (mainDishesImages) => {
        getRatingsForMainDishes(jamba.mainDishes, (mainDishesRatings) => {
          generatePostBody(post, jamba, mainDishesImages, mainDishesRatings);

          resolve(post.header + post.body.join('\n') + post.footer);
        });
      });
    });
  }


  function generatePostHeaderAndFooter(date, post) {
    const today = new Date();
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.getTime() < today.getTime()) {
      post.header = '*TOO LATE!* :silviao-ri:\n\n';
    } else if (date.getTime() >= tomorrow.getTime()) {
      post.header = '*SPOILER* :silviao-ri:\n\n';
    } else {
      if (today.getHours() >= 10 && today.getHours() < 11) {
        post.header = '*AINDA NÃO PEDIU?*\n\n';
      } else if (today.getHours() >= 11) {
        post.header = '*TOO LATE!* :silviao-ri:\n\n';
      }

      post.footer = '\n\n<https://www.ifood.com.br/delivery/campinas-sp/jambalaya-refeicoes-jardim-flamboyant|Pedir>';
    }
  }


  function generatePostBody(post, jamba, mainDishesImages, mainDishesRatings) {
    if (jamba.mainDishes.length > 0) {
      post.body.push('Pratos principais: ');

      jamba.mainDishes.forEach((mainDishName, i) => {
        const image = mainDishesImages[i];
        const rating = mainDishesRatings[i];
        let mainDishText = `- :arrow_up_small: ${rating.upvotes} :arrow_down_small: ${rating.downvotes} `;
        mainDishText += image ? `<${image}|${mainDishName}>` : mainDishName;

        post.body.push(mainDishText);
      });
    }

    if (jamba.garnishes.length > 0) {
      post.body.push(`Guarnições: ${jamba.garnishes.join(' - ')}`);
    }

    if (jamba.salads.length > 0) {
      post.body.push(`Saladas: ${jamba.salads.join(' - ')}`);
    }
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
