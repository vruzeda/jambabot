const mongoose = require('mongoose');

(() => {
  const SilvioCommentSchema = mongoose.Schema({
    comment: { type: String }
  });
  const SilvioComment = mongoose.model('SilvioComment', SilvioCommentSchema);

  function getRandomSilvioComment(callback) {
    SilvioComment.aggregate({ $sample: { size: 1 } }, (error, silvioComments) => {
      if (error) {
        callback(error, undefined);
        return;
      }

      if (silvioComments.length === 0) {
        callback(new Error('No comments available.'), undefined);
        return;
      }

      callback(null, silvioComments[0].comment);
    });
  }

  function addSilvioComment(comment, callback) {
    const silvioComment = new SilvioComment({ comment });
    silvioComment.save((error) => {
      callback(error);
    });
  }

  module.exports = {
    getRandomSilvioComment,
    addSilvioComment
  };
})();
