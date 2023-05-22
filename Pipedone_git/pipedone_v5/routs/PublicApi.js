const express = require('express');
const session = require('express-session');
const api = express.Router();
const axios = require('axios').default;
const fs = require('fs');
const Password = require('node-php-password');
const Post = require('../models/Post');
const access_token_mercado_pago = 'APP_USR-5979433284982031-101119-d6abead7fbc96d4d490186e53a8829c6-653709932';
// const { Server } = require("socket.io");
// const io = new Server(httpServer);

function returnCodeError(code) {
    switch (code) {
        case 400:
            return "Alguns campos obrigatórios não foram preenchidos";
            break;
        case 401:
            return "Token inválido ou inexistente";
            break;
        case 402:
            return "Pipe_id vazio";
            break;
        case 403:
            return "Pipe_id inválido ou inexistente";
            break;
        case 404:
            return "Lista não encontratada";
            break;
        case 405:
            return "Etapa não encontratada";
            break;

        default:
            break;
    }
}

function newId() {
    return Math.floor(Date.now() * Math.random()).toString(36);
}


api.get('/public-api/token-generator', async(req, res) => {

    // var token = req.body.token;
    var token = Math.random().toString(16).substr(2) + Math.random().toString(16).substr(2);

    // var org = await Post.Organizations.findOne({
    //     where: {
    //         token: token,
    //         status: 'active'
    //     }
    // })

    res.status(200).json(token);

})

api.post('/public-api/card/create', async(req, res) => {

    // var token = req.params.token;
    var token = req.body.token;
    var pipe_id = req.body.pipe_id;
    var creator_id = req.body.creator_id;
    var list_id = req.body.list_id;
    var item_id = req.body.item_id;
    var title = req.body.title;
    var values = req.body.values; // Array com os valores e id's correspondentes

    // Verificando se os campos estão preenchidos
    if (token == "" || pipe_id == "" || title == "" || typeof values != 'object' || values.length == 0) {
        var error = returnCodeError(400);
        res.status(400).json(error);
        return;
    }

    // Verifica se existe a organização
    var org = await Post.Organizations.findOne({
        where: {
            token: token,
            status: 'active',
        }
    })

    if (org == null) {
        var error = returnCodeError(401);
        res.status(401).json(error);
        return;
    }

    var organization_id = org.dataValues.id;

    // Verifica se existe o Pipe
    var pipe = await Post.Pipes.findOne({
        where: {
            id: pipe_id,
            status: "active",
        }
    })

    if (pipe == null) {
        var error = returnCodeError(403);
        res.status(403).json(error);
        return;
    }

    var list_id = pipe.dataValues.list_id;

    // Pegar a primeira etapa dos Steps
    var step = await Post.Steps.findOne({
        where: {
            pipe_id: pipe_id,
            status: "active",
        }
    })

    if (step == null) {
        var error = returnCodeError(405);
        res.status(405).json(error);
        return;
    }

    var step_id = step.dataValues.id;

    console.log("=== step ===");
    console.log(step);
    console.log("=== step ===");

    var formulario = {
        fields: [],
        values: [],
    }

    var count = 1;

    for (valor of values) {

        var field = {
            description: valor.campName,
            id: newId(),
            meta: {},
            position: count,
            type: "text",
        };

        var value = {
            value: valor.value,
            id: field.id,
        };

        formulario.fields.push(field);
        formulario.values.push(value);

        count++;
    }

    var meta = {
        title: title,
        history: {
            drops: [],
            responsables: [],
            actions: []
        },
        tasks: [],
        form: formulario
    }

    Post.Cards.create({
        organization_id: organization_id,
        pipe_id: pipe_id,
        step_id: step_id,
        list_id: list_id,
        item_id: item_id,
        client_id: '',
        responsible_id: '',
        creator_id: creator_id,
        metadata: JSON.stringify(meta),
        status: 'active'
    }).then((insertCard) => {
        res.status(200).json(insertCard);
    }).catch((erro) => {
        res.status(500).json(erro);
    })


})

/* Criar função que percorre um objeto, verifica se o campo é obrigatório e retornar um valor ou aviso */
/* Criar função que returna os campos que são obrigatórios e posso listar ou adicionar mais */

module.exports = api;