// Imports
var express      = require('express');
var usersCtrl    = require('./routes/usersCtrl');
var messagesCtrl = require('./routes/messagesCtrl');
var likesCtrl    = require('./routes/likesCtrl');
var friendsCtrl    = require('./routes/friendsCtrl');

// Router
exports.router = (function() {
  var apiRouter = express.Router();

  // Users routes
  //s'enregistrer
  apiRouter.route('/users/register/').post(usersCtrl.register);
  //se connecter 
  apiRouter.route('/users/login/').post(usersCtrl.login); 
  //Recuperer les information du profil
  apiRouter.route('/users/me/').get(usersCtrl.getUserProfile); //
  //modifier information
  apiRouter.route('/users/me/').put(usersCtrl.updateUserProfile);

  apiRouter.route('/friends/:friendId/new/').post(friendsCtrl.addFriend);
  apiRouter.route('/friends/requests/').get(friendsCtrl.listRequestToBeFriend);
  apiRouter.route('/friends/').get(friendsCtrl.listFriends);
  apiRouter.route('/friends/:friendId/accept/').post(friendsCtrl.acceptFriend);

  // Messages routes
  //creer new msg
  apiRouter.route('/messages/new/').post(messagesCtrl.createMessage);
  //lister les msg
  apiRouter.route('/messages/').get(messagesCtrl.listMessages);

  // Likes
  apiRouter.route('/messages/:messageId/vote/like').post(likesCtrl.likePost);
  apiRouter.route('/messages/:messageId/vote/dislike').post(likesCtrl.dislikePost);



  return apiRouter;
})();