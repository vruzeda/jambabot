(function() {

  var mongoose = require('mongoose');

  var SilvioCommentSchema = mongoose.Schema({
    comment: { type: String }
  });
  var SilvioComment = mongoose.model('SilvioComment', SilvioCommentSchema);

  function getRandomSilvioComment(callback) {
    SilvioComment.aggregate({ $sample: { size: 1 }}, function(error, silvioComments) {
      if (error) {
        callback(error, undefined);
        return;
      }

      if (silvioComments.length == 0) {
        callback(new Error('No comments available.'), undefined);
        return;
      }

      callback(null, silvioComments[0].comment);
    });
  }

  function addSilvioComment(comment, callback) {
    var silvioComment = new SilvioComment({comment: comment});
    silvioComment.save(function(error) {
      callback(error);
    });
  }

  module.exports = {
    getRandomSilvioComment: getRandomSilvioComment,
    addSilvioComment: addSilvioComment
  };

})();
