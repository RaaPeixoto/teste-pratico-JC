const express = require('express')
const session = require('express-session')
const api = express.Router()
const axios = require('axios').default
const fs = require('fs')
const Post = require('../../models/Post')
const { Op } = require("sequelize")

api.post(`/api/photos/create`, async(req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.fotos && user.permissions.fotos.includes('criar')) {

            var getPhotos = await Post.Models.findOne({
                where: {
                    id: req.body.model_id
                }
            })

            var stepsForPhotos = {
                id: getPhotos.id,
                title: getPhotos.title,
                meta: getPhotos.metadata
            }

            Post.Photos.create({

                organization_id: user.organization_id,
                client_id: '',
                creator_id: user.id,
                card_id: req.body.card_id,
                stepsForPhotos: stepsForPhotos,
                photos: '',
                metadata: '',
                status: 'active',

            }).then((step) => {
                res.status(200).json(step)
            }).catch((error) => {
                res.status(500).json(error)
            })


        } else {

            res.status(201).json('Você não tem permissão para criar links de fotos.');

        }


    } else {
        res.redirect('login')
    }

})

api.get(`/api/photo-in-base46/list/:photo_id`, async(req, res) => {


    Post.Photos.findOne({
        where: {
            id: req.params.photo_id
        }
    }).then((photos) => {

        var fotosInBase = [];

        for (let i = 0; i < photos.photos.length; i++) {
            const element = photos.photos[i];
            var imageAsBase64 = fs.readFileSync(`./public/img/fotos/${element.foto}`, 'base64');

            var datas = photos.stepsForPhotos.meta.photos.filter(item => item.id == element.id);

            var fotos = {
                img: imageAsBase64,
                datas: datas[0]
            }
            fotosInBase.push(fotos);
        }
        res.status(200).json(fotosInBase);
    }).catch((error) => {
        res.status(500).json(error)
    })

})

api.get(`/api/photo/list/:photo_id`, async(req, res) => {

    Post.Photos.findOne({
        where: {
            id: req.params.photo_id
        }
    }).then((photos) => {
        res.status(200).json(photos);
    }).catch((error) => {
        res.status(500).json(error)
    })

})

api.get(`/api/photo/count/:payment_date`, async(req, res) => {
    const user = req.session.usuario;

    if (user != undefined) {

        var payment_date = req.params.payment_date;
        var compra = new Date(payment_date);
        var dataCompra = new Date(payment_date);
        var dataSomada = dataCompra.setDate(dataCompra.getDate() + 30);
        var vencimento = new Date(dataSomada);

        Post.Photos.count({
            where: {
                organization_id: user.organization_id,
                createdAt: {
                    [Op.between]: [new Date(compra), new Date(vencimento)]
                }
            }
        }).then((photos) => {
            res.status(200).json(photos);
        }).catch((error) => {
            res.status(500).json(error)
        })
    } else {
        res.redirect('/login')
    }

})

api.get(`/api/photos/list`, async(req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.fotos && user.permissions.fotos.includes('visualizar')) {

            Post.Photos.findAll({
                where: {
                    organization_id: user.organization_id,
                    status: "active"
                }
            }).then((photos) => {
                res.status(200).json(photos);
            }).catch((error) => {
                res.status(500).json(error)
            })


        } else {

            res.status(201).json('Você não tem permissão para visualizar fotos.');

        }


    } else {
        res.redirect('login')
    }

})

api.get(`/api/photos/list/:card_id`, async(req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.fotos && user.permissions.fotos.includes('visualizar')) {


            Post.Photos.findAll({
                where: {
                    organization_id: user.organization_id,
                    card_id: req.params.card_id,
                    status: "active"
                }
            }).then((photos) => {
                res.status(200).json(photos);
            }).catch((error) => {
                res.status(500).json(error)
            })



        } else {

            res.status(201).json('Você não tem permissão para visualizar fotos.');

        }

    } else {
        res.redirect('login')
    }

})

api.put(`/api/photo/delete`, async(req, res) => {

    const id = req.body.id;

    Post.Photos.update({
        status: 'deleted'
    }, {
        where: { id: id }
    }).then((resposta) => {
        res.status(200).json(resposta);
    }).catch((error) => {
        res.status(500).json(error);
    })


})

api.put(`/api/photo/update`, async(req, res) => {

    const id = req.body.id;
    const photos = req.body.photos;
    const metadata = req.body.metadata;

    Post.Photos.update({
        photos: photos,
        metadata: metadata,
    }, {
        where: { id: id }
    }).then((resposta) => {
        res.status(200).json(resposta);
    }).catch((error) => {
        res.status(500).json(error);
    })


})

api.put(`/api/photo/update-metadata`, async(req, res) => {

    const id = req.body.id;
    const metadata = req.body.metadata;

    Post.Photos.update({
        metadata: metadata,
    }, {
        where: { id: id }
    }).then((resposta) => {
        res.status(200).json(resposta);
    }).catch((error) => {
        res.status(500).json(error);
    })


})

api.put(`/api/photo/update-photos`, async(req, res) => {

    const id = req.body.id;
    const photos = req.body.photos;
    const foto = req.body.foto;

    try {
        await fs.unlinkSync(`./public/img/fotos/${foto}`);
    } catch (error) {
        console.log('Erro na linha 143: ' + error.message);
    }


    Post.Photos.update({
        photos: photos,
    }, {
        where: { id: id }
    }).then((resposta) => {
        res.status(200).json(resposta);
    }).catch((error) => {
        res.status(500).json(error);
    })


})


module.exports = api;