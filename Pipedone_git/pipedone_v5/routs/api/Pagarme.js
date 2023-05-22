const express = require('express');
const session = require('express-session');
const api = express.Router();
const axios = require('axios').default;
const fs = require('fs');
const Post = require('../../models/Post');
const { Op } = require("sequelize");
const token_api = "ak_live_OAPuNgVTfSmGUQe4oiTxlbV0EJyDeY";
const postback_url = 'https://ce5c-2804-29b8-509c-518-8147-8a72-eeb3-ba72.ngrok.io/pagarme/postback';

const pagarme = require('pagarme');

api.post('/pagarme/planos', (req, res) => {

    pagarme.client.connect({ api_key: token_api })
        .then(client => client.plans.create({
            amount: req.body.valor,
            days: req.body.periodo,
            name: req.body.nome,
            payment_methods: ["boleto", "credit_card"]
        }))
        .then(plan => res.status(200).json(plan))

})

api.post('/pagarme/assinatura/credit_card', (req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        const dados = req.body.dados;
        const plan_id = req.body.plan_id;

        pagarme.client.connect({ api_key: token_api })
            .then(client => client.subscriptions.create({
                plan_id: plan_id,
                card_hash: dados.card_hash,
                postback_url: postback_url,
                payment_method: dados.payment_method,
                customer: dados.customer
            }).then((sucess) => {

                console.log('==============Sucesso==============')
                console.log(sucess)
                console.log('==============Sucesso==============')

                var hoje = new Date().toISOString().split('T')[0];

                Post.Subscriptions.create({
                    plan_id: plan_id,
                    subscription_id: sucess.id,
                    organization_id: user.organization_id,
                    payment_date: hoje,
                    nota_fiscal: "",
                    plan: sucess.plan.name,
                    payment_method: dados.payment_method,
                    period: sucess.plan.days,
                    url_boleto: "",
                    amount: sucess.plan.amount,
                    status: sucess.current_transaction.status,
                }).then((insertCard) => {
                    res.status(200).json(insertCard)
                }).catch((erro) => {
                    res.status(500).json(erro)
                })

            })).catch((error) => {
                console.log('============Error==================')
                console.log(error)
                console.log('============Error==================')
            })

    } else {
        res.redirect('login');
    }

})

api.post('/pagarme/assinatura/boleto', (req, res) => {


    var user = req.session.usuario;

    if (user != undefined) {

        const dados = req.body.dados;
        const plan_id = req.body.plan_id;


        console.log('==============Dados==============')
        console.log(dados)
        console.log('==============Dados==============')

        console.log('==============Plano_id==============')
        console.log(plan_id)
        console.log('==============Plano_id==============')

        pagarme.client.connect({ api_key: token_api })
            .then(client => client.subscriptions.create({
                plan_id: plan_id,
                postback_url: postback_url,
                payment_method: 'boleto',
                customer: {
                    email: dados.customer.email,
                    name: dados.customer.name,
                    document_number: dados.customer.document_number,
                    address: {
                        zipcode: dados.customer.address.zipcode,
                        neighborhood: dados.customer.address.neighborhood,
                        street: dados.customer.address.street,
                        street_number: dados.customer.address.street_number,
                    },
                    phone: {
                        number: dados.customer.phone.number,
                        ddd: dados.customer.phone.ddd,
                    }
                },
            }).then((sucess) => {

                console.log('==============Sucesso==============')
                console.log(sucess)
                console.log('==============Sucesso==============')

                var hoje = new Date().toISOString().split('T')[0];

                Post.Subscriptions.create({
                    plan_id: plan_id,
                    subscription_id: sucess.id,
                    organization_id: user.organization_id,
                    payment_date: hoje,
                    nota_fiscal: "",
                    plan: sucess.plan.name,
                    payment_method: dados.payment_method,
                    period: sucess.plan.days,
                    url_boleto: sucess.current_transaction.boleto_url,
                    amount: sucess.plan.amount,
                    status: sucess.current_transaction.status,
                }).then((insertCard) => {
                    res.status(200).json(insertCard)
                }).catch((erro) => {
                    res.status(500).json(erro)
                })

            })).catch((error) => {
                console.log('============Error==================')
                console.log(error)
                console.log('============Error==================')
            })

    } else {
        res.redirect('login');
    }

})

api.post('/pagarme/assinatura/gratis', (req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        var hoje = new Date().toISOString().split('T')[0];

        Post.Subscriptions.create({
            organization_id: user.organization_id,
            payment_date: hoje,
            plan: "Free",
            status: 'paid',
        }).then((insertCard) => {
            res.status(200).json(insertCard)
        }).catch((erro) => {
            res.status(500).json(erro)
        })

    } else {
        res.redirect('login');
    }

})


api.get('/pagarme/postback', (req, res) => {

    console.log("==================POST-BACK===========================")
    console.log(req.body)
    console.log("==================POST-BACK===========================")

})


module.exports = api;