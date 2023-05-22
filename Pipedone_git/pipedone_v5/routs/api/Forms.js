const express = require('express')
const session = require('express-session')
const api = express.Router()
const axios = require('axios').default
const fs = require('fs')
const Post = require('../../models/Post')

api.post(`/api/form/create`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        Post.Forms.create({
            organization_id: '',
            title: '',
            color: '',
            image: '',
            fields: '',
            creator_id: '',
            status: '',
        }).then((form) => {
            res.status(200).json(form)
        }).catch((erro) => {
            res.status(500).json(erro)
        })

    } else {
        res.redirect('login')
    }

})

api.get(`/api/form/listar`, (req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        Post.Forms.findAll({
            where: {
                organization_id: user.organization_id,
                status: 'active'
            }
        }).then((Forms) => {
            res.status(200).json(Forms)
        }).catch((error) => {
            res.status(500).json(error)
        })

    } else {
        res.redirect('/login')
    }

})

api.get(`/api/form/:card_id`, (req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        Post.Forms.findOne({
            where: {
                id: req.params.card_id
            }
        }).then((Forms) => {
            res.status(200).json(Forms)
        }).catch((error) => {
            res.status(500).json(error)
        })

    } else {
        res.redirect('/login')
    }

})

api.put(`/api/form/update/step`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        var meta = await Post.Forms.findOne({
            where: { id: req.body.id }
        })

        var metadata = JSON.parse(meta.metadata)

        metadata.history.drops.push(req.body.step_id)

        Post.Forms.update({
            step_id: req.body.step_id,
            metadata: JSON.stringify(metadata)
        }, {
            where: { id: req.body.id }
        }).then((resposta) => {
            res.status(200).send(resposta);
        }).catch((error) => {
            res.status(500).json(error);
        })

    } else {
        res.redirect('/login')
    }

})

api.put(`/api/form/update/metadata`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        Post.Forms.update({
            metadata: JSON.stringify(req.body.metadata)
        }, {
            where: { id: req.body.id }
        }).then((resposta) => {
            res.status(200).json(resposta);
        }).catch((error) => {
            res.status(500).json(error);
        })

    } else {
        res.redirect('/login')
    }

})

module.exports = api;