const express = require('express')
const session = require('express-session')
const api = express.Router()
const axios = require('axios').default
const fs = require('fs')
const Post = require('../../models/Post')
const { Op } = require("sequelize")

api.post(`/api/proposals/create`, async(req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.propostas && user.permissions.propostas.includes('criar')) {

            var proposals = JSON.parse(req.body.proposals);

            Post.Proposals.create({
                organization_id: user.organization_id,
                creator_id: user.id,
                card_id: proposals.card_id,
                value: proposals.budget.finalValue,
                metadata: proposals,
                type: proposals.type,
                status: 'pending',
            }).then((step) => {
                res.status(200).json(step)
            }).catch((error) => {
                res.status(500).json(error)
            })


        } else {

            res.status(201).json('Você não tem permissão para criar Propostas.');

        }


    } else {
        res.redirect('login')
    }

})

api.get(`/api/proposals/listar/:card_id`, async(req, res) => {

    Post.Proposals.findAll({
        where: {
            card_id: req.params.card_id,
            status: {
                [Op.notLike]: `deleted`
            }
        }
    }).then((proposals) => {
        res.status(200).json(proposals);
    }).catch((error) => {
        res.status(500).json(error)
    })

})

api.get(`/api/proposals/:sign_id`, async(req, res) => {

    Post.Proposals.findOne({
        where: {
            id: req.params.sign_id
        }
    }).then((proposals) => {
        res.status(200).json(proposals);
    }).catch((error) => {
        res.status(500).json(error)
    })

})

api.put(`/api/proposals/update/status`, async(req, res) => {

    Post.Proposals.update({
        status: req.body.status
    }, {
        where: { id: req.body.id }
    }).then((resposta) => {
        res.status(200).json(resposta);
    }).catch((error) => {
        res.status(500).json(error);
    })

})

api.put(`/api/proposals/update/status/metadata`, async(req, res) => {

    Post.Proposals.update({
        status: req.body.status,
        metadata: req.body.metadata
    }, {
        where: { id: req.body.id }
    }).then((resposta) => {
        res.status(200).json(resposta);
    }).catch((error) => {
        res.status(500).json(error);
    })

})

api.put(`/api/proposals/update/metadata`, async(req, res) => {

    Post.Proposals.update({
        metadata: req.body.metadata
    }, {
        where: { id: req.body.id }
    }).then((resposta) => {
        res.status(200).json(resposta);
    }).catch((error) => {
        res.status(500).json(error);
    })

})

api.put(`/api/proposals/delete`, async(req, res) => {

    const id = req.body.id;

    Post.Proposals.update({
        status: 'deleted'
    }, {
        where: { id: id }
    }).then((resposta) => {
        res.status(200).json(resposta);
    }).catch((error) => {
        res.status(500).json(error);
    })


})

api.get(`/api/pipepay/list/:page`, async(req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.pagamentos && user.permissions.pagamentos.includes('visualizar')) {

            var page = (parseInt(req.params.page) - 1) * 15

            Post.pipePay.findAndCountAll({
                limit: 15,
                offset: page,
                where: {
                    organization_id: user.organization_id
                }
            }).then((proposals) => {
                res.status(200).json(proposals);
            }).catch((error) => {
                res.status(500).json(error)
            })

        } else {

            res.status(201).json('Você não tem permissão para visualizar Pagamentos.');

        }


    } else {
        res.redirect('/login')
    }

})


module.exports = api;