const express = require('express')
const session = require('express-session')
const api = express.Router()
const axios = require('axios').default
const fs = require('fs')
const Post = require('../../models/Post')
const { Op } = require("sequelize");

/* Criar, Ler, Atualizar, e Excluir */

// Criar

api.post(`/api/pdfs/criar`, async(req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        Post.Pdfs.create({
            organization_id: user.organization_id,
            client_id: '',
            creator_id: user.id,
            card_id: req.body.card_id,
            document: req.body.document,
            metadata: req.body.metadata,
            status: 'active'
        }).then((listaCriada) => {
            res.status(200).json(listaCriada.id);
        }).catch((error) => {
            res.status(203).json('Erro ao criar esta lista.');
        })

    } else {
        res.redirect('/login')
    }

})

api.post('/api/pdfs/upload', async function(req, res, next) {

    var user = req.session.usuario;

    if (user != undefined) {

        let name = req.body.name;
        let rawdata = req.body.base64;
        let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let buffer = new Buffer.from(matches[2], 'base64');
        let filename = name + '.pdf';

        fs.writeFile(`public/pdfs/` + filename, buffer, function(err) {
            if (err) return next(err);
            res.status(200).send(filename);
        })


    } else {
        res.redirect('login')
    }

})

module.exports = api;