'use strict';
module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define('Friend', {
    sender_user: { 
    	type : DataTypes.INTEGER,
      	references: {
        	model: 'User',
        	key: 'id'
      	}
    },
    receiver_user: { 
    	type : DataTypes.INTEGER,
      	references: {
        	model: 'User',
        	key: 'id'
      	},
      	references: {
        	model: 'Message',
        	key: 'userId'
      	}
    },
    done: DataTypes.BOOLEAN
  }, {});
  Friend.associate = function(models) {
    // associations can be defined here


    models.Friend.belongsTo(
    	models.User, {
      		foreignKey: 'receiver_user'
      	}
    );
    models.Friend.belongsTo(
    	models.User, {
      		foreignKey: 'sender_user'    	
      	}
    );



  };
  return Friend;
};
