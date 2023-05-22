const express = require('express')
const session = require('express-session')
const api = express.Router()
const axios = require('axios').default
const fs = require('fs')
const Post = require('../../models/Post')
const { Op } = require("sequelize")

const nodeSchedule = require('node-schedule');


api.get(`/api/agendas/list`, (req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {
        Post.Agendas.findAll({
            where: {
                user_id: user.id,
                status: 'pending'
            }
        }).then((Agendas) => {
            res.status(200).json(Agendas)
        }).catch((error) => {
            res.status(500).json(error)
        })
    } else {
        res.redirect('/login')
    }

})

module.exports = api;