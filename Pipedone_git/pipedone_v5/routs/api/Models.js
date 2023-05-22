const express = require('express')
const session = require('express-session')
const api = express.Router()
const axios = require('axios').default
const fs = require('fs')
const Post = require('../../models/Post')
const { Op } = require("sequelize")

api.post(`/api/models/create`, async(req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.models && user.permissions.models.includes('criar')) {

            var metadata = req.body.metadata

            if (metadata.photos) {

                for (let i = 0; i < metadata.photos.length; i++) {
                    const element = metadata.photos[i];

                    let name = element.id;
                    let rawdata = element.photo;

                    if (rawdata != "") {

                        let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                        let buffer = new Buffer.from(matches[2], 'base64');
                        let filename = name + '.jpeg';

                        fs.writeFile(`public/img/models/` + filename, buffer, function(err) {
                            if (err) return next(err);
                        })

                        element.photo = filename;

                    };

                }
            }

            if (req.body.list_id) {
                var list = req.body.list_id;
            } else {
                var list = "";
            }

            Post.Models.create({
                organization_id: user.organization_id,
                creator_id: user.id,
                list_id: list,
                title: req.body.title,
                metadata: metadata,
                text: req.body.text,
                type: req.body.type,
                status: 'active',
            }).then((step) => {
                res.status(200).json(step)
            }).catch((error) => {
                res.status(500).json(error)
            })

        } else {
            res.status(201).json('Você não tem permissão para visualizar Listas.');
        }

    } else {
        res.redirect('login')
    }

})

api.get(`/api/models/listar/:type`, async(req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        Post.Models.findAll({
            where: {
                organization_id: user.organization_id,
                status: {
                    [Op.notLike]: 'deleted'
                },
                type: req.params.type,
            }
        }).then((models) => {
            res.status(200).json(models);
        }).catch((error) => {
            res.status(500).json(error)
        })

    } else {
        res.redirect('/login')
    }

})

api.get(`/api/models/listar`, async(req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        Post.Models.findAll({
            where: {
                organization_id: user.organization_id,
                status: {
                    [Op.notLike]: 'deleted'
                },
                [Op.or]: [{ type: 'document' }, { type: 'mail' }],
            }
        }).then((models) => {
            res.status(200).json(models);
        }).catch((error) => {
            res.status(500).json(error)
        })

    } else {
        res.redirect('/login')
    }

})

api.get(`/api/models/listar/:type/:status`, async(req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        Post.Models.findAll({
            where: {
                organization_id: user.organization_id,
                status: {
                    [Op.like]: req.params.status
                },
                type: req.params.type,
            }
        }).then((models) => {
            res.status(200).json(models);
        }).catch((error) => {
            res.status(500).json(error)
        })

    } else {
        res.redirect('/login')
    }

})

api.get(`/api/models/:doc_id`, async(req, res) => {

    Post.Models.findOne({
        where: {
            id: req.params.doc_id,
        }
    }).then((models) => {
        res.status(200).json(models);
    }).catch((error) => {
        res.status(500).json(error)
    })


})

api.put(`/api/models/update/status`, async(req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        Post.Models.update({
            status: req.body.status
        }, {
            where: {
                id: req.body.id
            }
        }).then((models) => {
            res.status(200).json(models);
        }).catch((error) => {
            res.status(500).json(error)
        })

    } else {
        res.redirect('/login')
    }

})

api.put(`/api/models/update`, async(req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        Post.Models.update({
            title: req.body.title,
            metadata: req.body.metadata,
            text: req.body.text,
            list_id: req.body.list_id,
        }, {
            where: {
                id: req.body.id
            }
        }).then((models) => {
            res.status(200).json(models);
        }).catch((error) => {
            res.status(500).json(error)
        })

    } else {
        res.redirect('/login')
    }

})

module.exports = api;