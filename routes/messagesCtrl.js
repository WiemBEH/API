// Imports
var models   = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwt.utils');

// Constants
const TITLE_LIMIT   = 2;
const CONTENT_LIMIT = 4;
const ITEMS_LIMIT   = 50;

// Routes
module.exports = {
  createMessage: function(req, res) {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    // recuperation des Params
    var title   = req.body.title;
    var content = req.body.content;
    var attachment  = req.body.attachment;
    //titre et contenu non vide 
    if (title == null || content == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    //longueur du titre
    if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    if (attachment != null && attachment.length > 0) {
      attachment = userId+"-"+attachment+"-"+(new Date()).getTime()+".png ";
    }



    asyncLib.waterfall([
      //recuperer notre utilisateur qui possede le token x
      function(done) {
        models.User.findOne({
          where: { id: userId }
        })
        //continuer avec d'autre fonction
        .then(function(userFound) {
          done(null, userFound);
        })
        //users non trouvé
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      //verifier userfound est valide
      function(userFound, done) {

        if(userFound) {
          //creer le messgage
          models.Message.create({
            title  : title,
            content: content,
            likes  : 0,
            attachment : attachment,
            //assigner a celui qui la poster
            UserId : userFound.id
          })
          //message cree
          .then(function(newMessage) {
            done(newMessage);
          });
        //si users non valide
        } else {
          res.status(404).json({ 'error': 'user not found' });
        }
      },
      //affiche à l'utilisateur si le msg a bien ete poster ou non 
    ], function(newMessage) {
      if (newMessage) {
        //succes!
        return res.status(201).json(newMessage);
      } else {
        //erreur
        return res.status(500).json({ 'error': 'cannot post message' });
      }
    });
  },

  //lister les msg
  listMessages: function(req, res) {
    //selectionne les colonnes qu'on souhaite afficher
    var fields  = req.query.fields;
    //recuperer les msg par segmentaion
    var limit   = parseInt(req.query.limit);
    var offset  = parseInt(req.query.offset);
    //sortir la liste des msg via ordre 
    var order   = req.query.order;

    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }

    //
    models.Message.findAll({
      //verifier les parametres
      order: [(order != null) ? order.split(':') : ['title', 'ASC']],
      attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
      limit: (!isNaN(limit)) ? limit : null,
      offset: (!isNaN(offset)) ? offset : null,
      //relation avec la table user
      include: [{
        model: models.User,
        attributes: [ 'username' ] //attribut qu'on veur afficher 
      }]
    //retouner msg recupérer via le serveur
    }).then(function(messages) {
      if (messages) {
        res.status(200).json(messages);
      } else {
        //si valeur null
        res.status(404).json({ "error": "no messages found" });
      }
    }).catch(function(err) {
      console.log(err);
      res.status(500).json({ "error": "invalid fields" });
    });
  }
}