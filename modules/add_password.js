const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
const conn = mongoose.Connection;
const passSchema = mongoose.Schema({
  password_category: {
    type: String,
    required: true,
  },
  project_name: {
    type: String,
    required: true,
  },
  password_detail: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

//user model
var passModel = mongoose.model('password_details', passSchema);

//module export
module.exports = passModel;