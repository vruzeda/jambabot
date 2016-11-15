(function() {

  var mongodb = require('../integrations/mongodb.js');

  function downvote(message, callback, dish) {
    mongodb.downvoteDish(dish, function(error) {
      if (error) {
        callback('Não entendi nada....');
        return;
      }

      callback('Vixxxxxxi c lascou kkkkk');
    });
  }

  module.exports = {
    pattern: /^downvote (.+)$/,
    handler: downvote,
    description: '*silviao downvote [dish name]* : Adds an downvote for the specified dish'
  };

})();
