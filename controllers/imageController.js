const mongoose = require('mongoose');
const Image = mongoose.model('images');

exports.insertResult = (req) => {
  // a document instance
  const image = new Image(req.body);

  // save model to database
  image.save((err, data) => {
    if (err) return console.error(err);
  });
};

exports.getLast20Results = async (req) =>{
  return await Image.find()
    .limit(20)
    .sort({date: -1})
    .exec()
  ;
};
