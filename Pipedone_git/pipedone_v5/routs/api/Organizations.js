const express = require('express')
const session = require('express-session')
const api = express.Router()
const axios = require('axios').default
const fs = require('fs')
const Post = require('../../models/Post')
const { Op } = require("sequelize")

api.put(`/api/organization/metadata`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        Post.Organizations.update({
            metadata: req.body.metadata
        }, {
            where: { id: user.organization_id }
        }).then((resposta) => {
            res.status(200).json(resposta);
        }).catch((error) => {
            res.status(500).json(error);
        })

    } else {
        res.redirect('/login')
    }
})

api.put(`/api/organization`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        Post.Organizations.update({
            name: req.body.nome,
            metadata: req.body.metadata,
        }, {
            where: { id: user.organization_id }
        }).then((resposta) => {
            res.status(200).json(resposta);
        }).catch((error) => {
            res.status(500).json(error);
        })

    } else {
        res.redirect('/login')
    }
})

api.get(`/api/organization/:organization_id`, async(req, res) => {

    Post.Organizations.findOne({
        where: { id: req.params.organization_id }
    }).then((resposta) => {
        res.status(200).json(resposta);
    }).catch((error) => {
        res.status(500).json(error);
    })

})

module.exports = api;