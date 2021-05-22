const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
const conn = mongoose.Connection;
const passcatSchema = mongoose.Schema({
  password_category: {
    type: String,
    required: true,
    index: {
      unique: true,
    }
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

//user model
var passCatModel = mongoose.model('password_categories', passcatSchema);

//module export
module.exports = passCatModel;