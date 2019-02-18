'use strict';
module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define('Friend', {
    sender_user: DataTypes.INTEGER,
    receiver_user: DataTypes.INTEGER,
    done: DataTypes.BOOLEAN
  }, {});
  Friend.associate = function(models) {
    // associations can be defined here
  };
  return Friend;
};