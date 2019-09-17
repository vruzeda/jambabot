const googleImages = require('../../integrations/googleImages');
const jambalaya = require('../../integrations/jambalaya');
const mongodb = require('../../integrations/mongodb');

(() => {
  function getJambaPostForDate(date) {
    return checkValidDate(date)
      .then(() => getJambaForDate(date))
      .then(jamba => generatePostText(date, jamba));
  }

  function checkValidDate(date) {
    return new Promise((resolve, reject) => {
      // Check if the date is in the current month (and year, just for safety)
      const today = new Date();
      if (date.getMonth() !== today.getMonth() || date.getFullYear() !== today.getFullYear()) {
        reject(new Error(`O cardápio para ${date.getDate()}/${date.getMonth() + 1} não está disponível!`));
        return;
      }

      // Check if the date is a sunday
      if (date.getDay() === 0) {
        reject(new Error('O Jambalaya não abre de domingos!'));
        return;
      }

      resolve(true);
    });
  }

  function getJambaForDate(date) {
    return jambalaya.getJambaForDate(date)
      .catch(() => {
        throw new Error('O site do Jamba está fora do ar :cry:\n' +
          'Dá uma checada no <https://www.ifood.com.br/delivery/campinas-sp/jambalaya-refeicoes-jardim-flamboyant|iFood>...\n' +
          'Ou liga lá: <tel:1932513928|(19) 3251-3928> | <tel:1932537573|(19) 3253-7573>\n\n(Ou <#C0HNHSCP9>, ' +
          'fazer o quê :stuck_out_tongue_winking_eye:)');
      })
      .then((jamba) => {
        if (!jamba) {
          throw new Error(`O cardápio para ${date.getDate()}/${date.getMonth() + 1} não está disponível!`);
        }

        return jamba;
      });
  }

  function generatePostText(date, jamba) {
    return Promise.all([
      getImageForMainDishes(jamba.mainDishes),
      getRatingsForMainDishes(jamba.mainDishes),
    ])
      .then(([mainDishesImages, mainDishesRatings]) => {
        const post = {
          header: generatePostHeader(date),
          body: generatePostBody(jamba, mainDishesImages, mainDishesRatings),
          footer: generatePostFooter(date),
        };

        return post.header + post.body.join('\n') + post.footer;
      });
  }

  function generatePostHeader(date) {
    const today = new Date();
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0);

    if (date.getTime() < today.getTime()) {
      return '*TOO LATE!* :silviao-ri:\n\n';
    } else if (date.getTime() >= tomorrow.getTime()) {
      return '*SPOILER* :silviao-ri:\n\n';
    } else if (today.getHours() >= 10 && today.getHours() < 11) {
      return '*AINDA NÃO PEDIU?*\n\n';
    } else if (today.getHours() >= 11) {
      return '*TOO LATE!* :silviao-ri:\n\n';
    }

    return '';
  }

  function generatePostFooter(date) {
    const today = new Date();
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if ((date.getTime() >= today.getTime()) && (date.getTime() < tomorrow.getTime())) {
      return '\n\n<https://www.ifood.com.br/delivery/campinas-sp/jambalaya-refeicoes-jardim-flamboyant|Pedir>';
    }

    return '';
  }

  function generatePostBody(jamba, mainDishesImages, mainDishesRatings) {
    const body = [];

    if (jamba.mainDishes.length > 0) {
      body.push('Pratos principais: ');

      jamba.mainDishes.forEach((mainDishName, i) => {
        const image = mainDishesImages[i];
        const rating = mainDishesRatings[i];
        let mainDishText = `- :arrow_up_small: ${rating.upvotes} :arrow_down_small: ${rating.downvotes} `;
        mainDishText += image ? `<${image}|${mainDishName}>` : mainDishName;

        body.push(mainDishText);
      });
    }

    if (jamba.garnishes.length > 0) {
      body.push(`Guarnições: ${jamba.garnishes.join(' - ')}`);
    }

    if (jamba.salads.length > 0) {
      body.push(`Saladas: ${jamba.salads.join(' - ')}`);
    }

    return body;
  }

  function getImageForMainDishes(mainDishes) {
    return Promise.all(mainDishes.map(getImageForMainDish));
  }

  function getImageForMainDish(mainDish) {
    return mongodb.getImageForDish(mainDish)
      .then((preDefinedImage) => {
        if (!preDefinedImage) {
          throw new Error('No predefined image');
        }

        return preDefinedImage;
      })
      .catch(() => googleImages.getRandomImage(mainDish));
  }

  function getRatingsForMainDishes(mainDishes) {
    return Promise.all(mainDishes.map(getRatingsForMainDish));
  }

  function getRatingsForMainDish(mainDish) {
    return mongodb.getDishRating(mainDish)
      .then((rating) => {
        if (!rating) {
          throw new Error(`No rating for dish ${mainDish}`);
        }

        return rating;
      })
      .catch(() => ({ upvotes: 0, downvotes: 0 }));
  }

  module.exports = getJambaPostForDate;
})();
