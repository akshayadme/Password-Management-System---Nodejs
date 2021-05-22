const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
const conn = mongoose.Connection;
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true,
    }
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
    }
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

//user model
var userModel = mongoose.model('users', userSchema);

//module export
module.exports = userModel;