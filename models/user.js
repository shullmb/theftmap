'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1,12],
          msg: "Your username must be between 1 & 12 characters long."
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "This email is invalid."
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8,14],
          msg: "Your password must be between 8 and 14 characters long."
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (pendingUser,options) => {
        if (pendingUser && pendingUser.password) {
          let hash = bcrypt.hashSync(pendingUser.password,10)
          pendingUser.password = hash;
        }
      }
    }
  });
  user.associate = function(models) {
    // associations can be defined here
  };

  user.prototype.validPassword = function(passwordTyped) {
    return bcrypt.compareSync(passwordTyped, this.password);
  }

  user.prototype.toJSON = function() {
    let userData = this.get();
    delete userData.password;
    return userData
  }

  return user;
};