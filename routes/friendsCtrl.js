// Imports
var models   = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwt.utils');

// Routes
module.exports = {
  addFriend: function(req, res) {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

     // Params
    var friendId = parseInt(req.params.friendId);

    if (friendId <= 0 || friendId == userId) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }


    asyncLib.waterfall([
      function(done) {
        models.User.findOne({
          where: { id: friendId }
        })
        .then(function(userFound) {
          done(null, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      }, function(userFound, done) {
		if(userFound) {
        	var newRequest = models.Friend.create({
          		sender_user: userId,
          		receiver_user: friendId
       	 	})
        	.then(function(newRequest) {
          		done(newRequest); 
        	})
        	.catch(function(err) {
          		return res.status(500).json({ 'error': 'cannot send request' });
        	});
    	} else {
            return res.status(409).json({ 'error': 'user don\'t exit' });
        }
      }
	], function(newRequest) {		
     if (newRequest) {
       return res.status(201).json({newRequest});
     } else {
       return res.status(500).json({ 'error': 'cannot send request' });
     }
   });
  },


  listRequestToBeFriend: function(req, res) {
    var headerAuth  = req.headers['authorization'];
	var userId      = jwtUtils.getUserId(headerAuth);
    models.Friend.findAll({
        where: { receiver_user: userId,
        	done : 0 }
    }).then(function(friend) {
      if (friend) {
        res.status(200).json(friend);
      } else {
        //si valeur null
        res.status(404).json({ "error": "no messages found" });
      }
    }).catch(function(err) {
      console.log(err);
      res.status(500).json({ "error": "invalid fields" });
    });
  },
  listFriends: function(req, res) {
    var headerAuth  = req.headers['authorization'];
	var userId      = jwtUtils.getUserId(headerAuth);
    models.Friend.findAll({
        where: { receiver_user: userId,
        	done : 1 }
    }).then(function(friend) {
      if (friend) {
        res.status(200).json(friend);
      } else {
        //si valeur null
        res.status(404).json({ "error": "no messages found" });
      }
    }).catch(function(err) {
      console.log(err);
      res.status(500).json({ "error": "invalid fields" });
    });
  },
  acceptFriend:  function(req, res) {
   var headerAuth  = req.headers['authorization'];
   var userId      = jwtUtils.getUserId(headerAuth);
   var friendId = parseInt(req.params.friendId);

   asyncLib.waterfall([
      function(done) {
        models.Friend.findOne({
          where: { id: friendId,
          	receiver_user: userId }
        })
        .then(function(requestFound) {
          done(null, requestFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify request' });
        });
      }, function(requestFound, done) {
		if(requestFound) {
        	requestFound.update({
          		done: 1
       	 	})
        	.then(function(newRequest) {
          		done(newRequest); 
        	})
        	.catch(function(err) {
          		return res.status(500).json({ 'error': 'cannot accept request' });
        	});
    	} else {
            return res.status(409).json({ 'error': 'request don\'t exit' });
        }
      }
	], function(newRequest) {		
     if (newRequest) {
       return res.status(201).json({newRequest});
     } else {
       return res.status(500).json({ 'error': 'cannot accepte request' });
     }
   });

  }, 
}