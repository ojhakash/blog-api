"use strict";

const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const HttpError = require("http-error-constructor");

var UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: "Firstname is a required field",
    maxlength: 20,
    match: [/^[A-Za-z]+$/]
  },
  lastName: {
    type: String,
    required: "Last name is a required field",
    maxlength: 20,
    match: [/^[A-Za-z]+$/]
  },
  email: {
    type: String,
    required: "email is a required field",
    trim: true,
    minlength: 10,
    unique: "email is already registered",
    match: [
      /^([^<>()[\]\\.,;:\s@"]+@[\w.\-]+)(\.[^<>()[\]\\.,;:\s@"]+@[\w.\-]+)*\.([A-Za-z]{2,6})$/,
      "{VALUE} is not a valid email"
    ]
  },
  phoneNumber: {
    type: String,
    required: "phone number is a required field",
    trim: true,
    minlength: 10,
    unique: "phone number already in use",
    match: [/^[\d]+$/, "{VALUE} is not a valid phone number"]
  },
  password: {
    type: String,
    required: "password is a required field",
    minlength: 8
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
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, [
    "email",
    "phoneNumber",
    "firstName",
    "lastName",
    "_id"
  ]);
};

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = "auth";
  var token = jwt
    .sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)
    .toString();

  user.tokens.push({ access, token });

  return user
    .save()
    .then(() => {
      return token;
    })
    .catch(e => {
      return e;
    });
};

UserSchema.methods.removeToken = function(token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: { token }
    }
  });
};

// UserSchema.methods.addMentor = function(mentorId) {
//   var user = this;
//   try {
//     await user
//       .update(
//         {
//           $push: {
//             mentors: mentorId
//           }
//         },
//         { runValidators: true }
//       )
//       .exec((err, user) => {
//         if (err) {
//           throw new HttpError(400, err.message);
//         } else {
//           return user;
//         }
//       });
//   } catch (e) {
//     Promise.reject(e);
//   }
//
//   return user;
// };

UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

UserSchema.statics.findByCredentials = (email, password) => {
  var User = mongoose.model("User", UserSchema);

  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findOne({ email });
      if (!user) {
        throw new HttpError(404, "user not found");
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject(new HttpError(403, "password does not match"));
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

UserSchema.pre("save", function(next) {
  var user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model("User", UserSchema);

module.exports = { User };
