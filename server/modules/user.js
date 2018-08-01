const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
    unique: true,
    validate: validator.isEmail,
    message: `{value} is not a valid email`
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});
UserSchema.methods.toJSON = function() {
  const user = this;
  const userObj = user.toObject();
  return _.pick(userObj, ["_id", "password"]);
};

UserSchema.methods.generateAuthToken = function() {
  let user = this;
  let access = "auth";
  let token = jwt
    .sign(
      {
        _id: user._id.toHexString(),
        access
      },
      "abc123"
    )
    .toString();

  user.tokens = user.tokens.concat([{ access, token }]);

  return user.save().then(() => token);
};

const User = mongoose.model("User", UserSchema);

module.exports = { User };
