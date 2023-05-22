const express = require('express')
const session = require('express-session')
const api = express.Router()
const axios = require('axios').default
const fs = require('fs')
const Post = require('../../models/Post')

// Criptografia

var Password = require('node-php-password')

api.post(`/api/user/authenticate`, (req, res) => {

    var chave = '&235689Ra#311291Jl@' + req.body.senha;

    Post.Users.findOne({
        where: {
            email: req.body.email
        }
    }).then((resposta) => {

        if (resposta.email != "" && resposta.email != null && resposta.email != undefined) {

            var hash = resposta.pass

            if (Password.verify(chave, hash)) {
                req.session.usuario = resposta
                res.status(200).json(resposta)
            } else {
                res.status(201).json('Senha não corresponde')
            }

        } else {
            res.status(202).json('Email não encontrado')
        }

    }).catch((resposta) => {
        res.status(500).json(resposta);
    })

})

api.post(`/api/user/register`, async(req, res) => {

    var pass = "&235689Ra#311291Jl@" + req.body.pass;
    var passHash = Password.hash(pass, "PASSWORD_BCRYPT");

    var verifyCadastro = await Post.Users.findAll({
        where: {
            email: req.body.email
        }
    })

    if (verifyCadastro == "") {

        var meta = {
            preferences: {
                theme: "light"
            }
        }

        var permissions = {
            pipes: ['visualizar', 'criar', 'editar'],
            steps: ['visualizar', 'criar', 'editar'],
            fotos: ['visualizar', 'criar', 'editar'],
            times: ['visualizar', 'criar', 'editar'],
            formulario: ['visualizar', 'criar', 'editar'],
            pagamentos: ['visualizar', 'criar', 'editar'],
            cards: ['visualizar', 'criar', 'editar'],
            propostas: ['visualizar', 'criar', 'editar'],
            assinatura: ['visualizar', 'criar', 'editar'],
            anexos: ['visualizar', 'criar', 'editar'],
            tarefas: ['visualizar', 'criar', 'editar'],
        };

        var registerUser = await Post.Users.create({
            name: req.body.name,
            email: req.body.email,
            pass: passHash,
            type: req.body.type,
            organization_id: "",
            metadata: JSON.stringify(meta),
            permissions: permissions,
            status: "active"
        })

        var registerOrganization = await Post.Organizations.create({
            name: req.body.organization,
            token: "",
            plan_id: "",
            property_of: registerUser.id,
            metadata: {},
            status: "active",
        })

        var user = await Post.Users.update({
            organization_id: registerOrganization.id
        }, {
            where: { id: registerUser.id }
        })

        registerUser.organization_id = registerOrganization.id;

        if (registerUser.id != "" && registerOrganization.id != "") {
            req.session.usuario = registerUser
            res.status(200).json(registerUser);
        } else {
            res.status(500).json("Erro interno do servidor.");
        }

    } else {
        res.status(203).json('Email já cadastrado!');
    }

})


api.put(`/api/user/update/metadata/theme`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        var buscaMeta = await Post.Users.findOne({
            where: { id: user.id }
        })

        var respost = buscaMeta.dataValues;

        if (respost.metadata == null) {
            var meta = {}
            meta['preferences'] = {}

            meta.preferences = {
                theme: req.body.theme
            }
        } else {
            var meta = JSON.parse(respost.metadata)
            meta.preferences.theme = req.body.theme;
        }

        var newMetadata = JSON.stringify(meta);

        Post.Users.update({
            metadata: newMetadata
        }, {
            where: { id: user.id }
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