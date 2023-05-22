const express = require('express')
const session = require('express-session')
const api = express.Router()
const axios = require('axios').default
const fs = require('fs')
const Password = require('node-php-password')
const Post = require('../models/Post')
const access_token_mercado_pago = 'APP_USR-5979433284982031-101119-d6abead7fbc96d4d490186e53a8829c6-653709932'


api.post('/api/photo/upload', async function(req, res, next) {

    let name = req.body.name;
    let rawdata = req.body.base64;
    let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer = new Buffer.from(matches[2], 'base64');
    let filename = name + '.jpeg';

    fs.writeFile(`public/img/faceid/` + filename, buffer, function(err) {
        if (err) return next(err);
        res.status(200).send(filename);
    })

})

api.post('/api/photo/logo', async function(req, res, next) {

    let name = req.body.name;
    let rawdata = req.body.base64;
    let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer = new Buffer.from(matches[2], 'base64');
    let filename = name;

    fs.writeFile(`public/img/fotos/` + filename, buffer, function(err) {
        if (err) return next(err);
        res.status(200).send(filename);
    })

})


api.post('/api/photo/upload-foto', async function(req, res, next) {

    let name = req.body.name;
    let rawdata = req.body.base64;
    let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer = new Buffer.from(matches[2], 'base64');
    let filename = name + '.jpeg';

    fs.writeFile(`public/img/fotos/` + filename, buffer, function(err) {
        if (err) return next(err);
        res.status(200).send(filename);
    })

})

api.post('/api/upload/form', async function(req, res, next) {

    let name = req.body.name;
    let rawdata = req.body.base64;
    let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer = new Buffer.from(matches[2], 'base64');
    let filename = name;

    fs.writeFile(`public/anexos/` + filename, buffer, function(err) {
        if (err) return next(err);
        res.status(200).send(filename);
    })

})

// Rotas de pagamento


api.post(`/api/gerar-link-pagamento`, (req, res) => {

    var pedido = req.body.pedido

    // Cria um objeto de preferência
    let preference = {
        items: [],
        back_urls: {
            success: "https://pipedone.com/api/webhook/success",
            failure: "https://pipedone.com/api/webhook/failure",
            pending: "https://pipedone.com/api/webhook/pending"
        },
        auto_return: "approved",
        // external_reference: pedido.id,
        payment_methods: {
            excluded_payment_methods: [
                { id: "bolbradesco" },
                { id: "pec", }
            ],
            installments: 12
        },
        statement_descriptor: "Pipedone"
    };


    // // Montando pedido

    var item = {
        id: pedido.id,
        category_id: pedido.category,
        title: pedido.id.toString(),
        unit_price: parseFloat(pedido.valorTotal),
        quantity: 1,
    }

    preference.items.push(item)

    // SDK do Mercado Pago
    const mercadopago = require('mercadopago');


    // // Adicione as credenciais
    mercadopago.configure({
        access_token: access_token_mercado_pago
    });

    mercadopago.preferences.create(preference)
        .then(async(response) => {

            // Este valor substituirá a string "<%= global.id %>" no seu HTML
            global.id = response.body.id;

            var GetRegPayment = await Post.pipePay.count({
                where: {
                    proposal_id: pedido.id
                }
            });

            if (GetRegPayment == 0) {
                var registrarProposta = await Post.pipePay.create({
                    proposal_id: pedido.id,
                    organization_id: pedido.organization_id,
                    value: parseInt(pedido.valorTotal),
                    type: 'payment',
                    link: response.body.init_point,
                    transation_id: global.id,
                    status: 'created'
                })
            }

            res.status(200).json(response.body)

        }).catch(function(error) {

            console.log(error);
            res.status(500).json(error)

        });


})


api.get(`/api/webhook/success`, (req, res) => {
    console.log(req.body)
    res.status(200).json(req.body)
})

api.get(`/api/webhook/failure`, (req, res) => {
    console.log(req.body)
})

api.get(`/api/webhook/pending`, (req, res) => {
    console.log(req.body)
})


api.get(`/user/logado/session`, (req, res) => {

    if (req.session.usuario) {
        var user = req.session.usuario;
    } else {
        var user = [];
    }
    res.status(200).json(user);
})



module.exports = api;