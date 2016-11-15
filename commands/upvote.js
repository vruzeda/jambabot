(function() {

  var jambalaya = require('../integrations/jambalaya');
  var mongodb = require('../integrations/mongodb');

  function upvote(message, callback, dish) {
    jambalaya.getJambaForDate(new Date(), function(error, jamba) {
      if (error) {
        callback('Não entendi nada....');
        return;
      }

      if (jamba.mainDishes.indexOf(dish) >= 0) {
        mongodb.upvoteDish(message.userName, dish, function(error) {
          if (error) {
            callback('Não entendi nada....');
            return;
          }

          callback('Show');
        });
      } else {
        callback('C fude. Kkkkkkkk');
      }
    });
  }

  module.exports = {
    pattern: /^upvote (.+)$/,
    handler: upvote,
    description: '*silviao upvote [dish name]* : Adds an upvote for the specified dish'
  };

})();
