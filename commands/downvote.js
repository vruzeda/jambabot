(function() {

  var jambalaya = require('../integrations/jambalaya');
  var mongodb = require('../integrations/mongodb');

  function downvote(message, callback, dish) {
    jambalaya.getJambaForDate(new Date(), function(error, jamba) {
      if (error) {
        callback('Não entendi nada....');
        return;
      }

      if (jamba.mainDishes.indexOf(dish) >= 0) {
        mongodb.downvoteDish(message.userName, dish, function(error) {
          if (error) {
            callback('Não entendi nada....');
            return;
          }

          callback('Vixxxxxxi c lascou kkkkk');
        });
      } else {
        callback('C fude. Kkkkkkkk');
      }
    });
  }

  module.exports = {
    pattern: /^downvote (.+)$/,
    handler: downvote,
    description: '*silviao downvote [dish name]* : Adds an downvote for the specified dish'
  };

})();
