const mongoose = require('mongoose');

(() => {
  const SilvioCommentSchema = mongoose.Schema({
    comment: { type: String }
  });
  const SilvioComment = mongoose.model('SilvioComment', SilvioCommentSchema);

  function getRandomSilvioComment(callback) {
    SilvioComment.aggregate([{ $sample: { size: 1 } }])
      .then((silvioComments) => {
        if (silvioComments.length === 0) {
          callback(new Error('No comments available.'), undefined);
          return;
        }

        callback(null, silvioComments[0].comment);
      }, (error) => {
        callback(error, undefined);
      });
  }

  function addSilvioComment(comment, callback) {
    const silvioComment = new SilvioComment({ comment });
    silvioComment.save()
      .then(() => {
        callback(null);
      }, (error) => {
        callback(error);
      });
  }

  module.exports = {
    getRandomSilvioComment,
    addSilvioComment
  };
})();
