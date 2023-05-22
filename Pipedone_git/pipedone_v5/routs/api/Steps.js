const express = require('express')
const session = require('express-session')
const api = express.Router()
const axios = require('axios').default
const fs = require('fs')
const Post = require('../../models/Post')

api.post(`/api/step/create`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.steps && user.permissions.steps.includes('criar')) {

            var step = req.body.step

            console.log(step);

            Post.Steps.create({
                title: step.title,
                position: step.position,
                organization_id: user.organization_id,
                pipe_id: step.pipe_id,
                color: step.color,
                metadata: step.metadata,
                status: "active",
            }).then((step) => {
                res.status(200).json(step)
            }).catch((error) => {
                res.status(500).json(error)
            })

        } else {

            res.status(201).json('Você não tem permissão para criar Steps.');

        }

    } else {
        res.redirect('login')
    }

})

api.get(`/api/step/get/:step_id`, (req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.steps && user.permissions.steps.includes('visualizar')) {

            Post.Steps.findOne({
                where: {
                    id: req.params.step_id,
                    status: 'active'
                }
            }).then((steps) => {
                res.status(200).json(steps)
            }).catch((error) => {
                res.status(500).json(error)
            })


        } else {

            res.status(201).json('Você não tem permissão para visualizar Steps.');

        }

    } else {
        res.redirect('/login')
    }

})

api.get(`/api/step/listar/:pipe_id`, (req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.steps && user.permissions.steps.includes('visualizar')) {

            Post.Steps.findAll({
                where: {
                    pipe_id: req.params.pipe_id,
                    status: 'active'
                }
            }).then((steps) => {
                res.status(200).json(steps)
            }).catch((error) => {
                res.status(500).json(error)
            })


        } else {

            res.status(201).json('Você não tem permissão para visualizar Steps.');

        }



    } else {
        res.redirect('/login')
    }

})

api.get(`/api/step/public/listar/:pipe_id`, (req, res) => {

    Post.Steps.findAll({
        where: {
            pipe_id: req.params.pipe_id,
            status: 'active'
        }
    }).then((steps) => {
        res.status(200).json(steps)
    }).catch((error) => {
        res.status(500).json(error)
    })

})


api.put(`/api/step/update/title`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.steps && user.permissions.steps.includes('editar')) {

            Post.Steps.update({
                title: req.body.title
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para visualizar Steps.');

        }



    } else {
        res.redirect('/login')
    }
})

api.put(`/api/step/update/status`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.steps && user.permissions.steps.includes('editar')) {


            Post.Steps.update({
                status: req.body.status
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para visualizar Steps.');

        }



    } else {
        res.redirect('/login')
    }
})

api.get(`/api/steps/count/:pipe_id`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        Post.Steps.count({
            where: {
                pipe_id: req.params.pipe_id,
                status: 'active'
            }
        }).then((dados) => {
            res.status(200).json(dados);
        }).catch((error) => {
            res.status(500).json(error)
        })

    } else {
        res.redirect('/login')
    }
})



module.exports = api;