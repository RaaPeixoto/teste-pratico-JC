const express = require("express");
const session = require("express-session");
const api = express.Router();
const axios = require("axios").default;
const fs = require("fs");
const Post = require("../../models/Post");
const { Op } = require("sequelize");

api.get(`/api/notifications`, async (req, res) => {
  const user = req.session.usuario;
  if (user != undefined) {
    Post.Notifications.findAll({
      where: {
        user_id: user.id,
      },
      order: [['createdAt', 'DESC']]
    })
      .then((notifications) => {
        res.status(200).json(notifications);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } else {
    res.redirect("/login");
  }
});

api.post(`/api/notifications`, async (req, res) => {
  const user = req.session.usuario;
  console.log(req.body)
  if (user != undefined) {
    Post.Notifications.create(req.body)
      .then((notifications) => {
        res.status(201).json(notifications);
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json(error);
      });
  } else {
    res.redirect("/login");
  }
});

api.put(`/api/notifications/workchat/:senderId`, async (req, res) => {

  const user = req.session.usuario;
  if (user != undefined) {
    Post.Notifications.update({
      status: "viewed"
  }, {
      where: {
        user_id:user.id,
          metadata: {senderId: req.params.senderId}
      }
  })
      .then((notifications) => {
        res.status(200).json(notifications);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } else {
    res.redirect("/login");
  }
});

api.put(`/api/notifications/delete/:notificationId`, async (req, res) => {
 
  const user = req.session.usuario;
  if (user != undefined) {
    Post.Notifications.update({
      status: "disable"
  }, {
      where: {
        id:req.params.notificationId,
       
      }
  })
      .then((notifications) => {
        res.status(200).json(notifications);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } else {
    res.redirect("/login");
  }
});
api.put(`/api/notifications/viewed/:notificationId`, async (req, res) => {
 
  const user = req.session.usuario;
  if (user != undefined) {
    Post.Notifications.update({
      status: "viewed"
  }, {
      where: {
        id:req.params.notificationId,
       
      }
  })
      .then((notifications) => {
        res.status(200).json(notifications);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } else {
    res.redirect("/login");
  }
});
module.exports = api;