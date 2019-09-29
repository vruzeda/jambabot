const mongoose = require('mongoose');

(() => {
  const SilvioCommentSchema = mongoose.Schema({
    comment: { type: String },
  });
  const SilvioComment = mongoose.model('SilvioComment', SilvioCommentSchema);

  function getRandomSilvioComment() {
    return SilvioComment.aggregate([{ $sample: { size: 1 } }])
      .then((silvioComments) => {
        if (silvioComments.length === 0) {
          throw new Error('No comments available.');
        }

        return silvioComments[0].comment;
      });
  }

  function addSilvioComment(comment) {
    const silvioComment = new SilvioComment({ comment });
    return silvioComment.save();
  }

  module.exports = {
    getRandomSilvioComment,
    addSilvioComment,
  };
})();
