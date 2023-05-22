const express = require('express');
const session = require('express-session');
const api = express.Router();
const axios = require('axios').default;
const fs = require('fs');
const Post = require('../../models/Post');
const { Op } = require("sequelize");
const cors = require("cors");

// Credenciais Sendgrid - Email
const SENDGRID_API_KEY = "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"
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

// Credenciais Stripe
//const stripe = require('stripe')('sk_test_51Mfw9JE72hLbKiHVWLUPLmBX0Uq6y2vvTVkD9BgOs49fq51iH8FUzGipWiDkHSKdmfnzmNKx8jri5kJ9nZ4GXR5b00DYMZjt6k');
const stripe = require('stripe')('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');

//const YOUR_DOMAIN = 'http://localhost:3000';
const YOUR_DOMAIN = 'https://www.pipedone.com';

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = 'whsec_42be4d803df331d206f082daf6f53a5acc750644d6595d9d25a0e47d3b2efe2b';

// Funções
async function sendEmail(texto, to, subject) {

    var corpo = `<div style="font-family: sans-serif;position: relative;padding:20px;height:auto;">${texto}</div>`;

    const msg = {
        to: to,
        from: 'contato@pipedone.com',
        subject: subject,
        html: corpo,
    }

    try {
        const result = await sgMail.send(msg);
        console.log('Email sent', result);
        res.status(200).json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
}
// Fim de Funções


// Rotas de chamadas

api.post(`/api/stripe/criar-assento`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        const dados = req.body.dados;
        const frequency = req.body.frequency;
        const amount = req.body.amount * 100;

        var data = new Date();
        var mesReferencia = meses[data.getMonth()] + ' de ' + data.getFullYear();
        var outraData = new Date();
        if (frequency == 'mouth') {
            var outra = outraData.setHours(data.getHours() + 30);
            var frequency_repeat = 30;
            var frequency_type = 'month';
            var reason = 'Pipedone mensal';
        } else {
            var outra = outraData.setHours(data.getHours() + 365);
            var frequency_repeat = 365;
            var frequency_type = 'year';
            var reason = 'Pipedone anual';
        }

        var vencimento = new Date(outra);
        dados['frequency'] = frequency_type;
        dados['vencimento'] = vencimento;
        dados['frequency_repeat'] = frequency_repeat;

        try {

            const product = await stripe.products.create({ name: reason });

            console.log("==== product ok ======");

            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: amount,
                currency: 'brl',
                recurring: { interval: frequency_type },
            });

            console.log("==== price ok ======");

            const SearchCustomer = await stripe.customers.search({
                query: `email:\'${user.email}\'`,
            });

            console.log("==== SearchCustomer ok ======");

            if (SearchCustomer.data.length == 0) {

                const customer = await stripe.customers.create({
                    description: reason,
                    email: user.email,
                    name: user.name,
                });

                console.log("==== customer ======");
                console.log(customer)
                console.log("==== customer ======");

                var clienteIdStripe = customer.id;

            } else {
                var clienteIdStripe = SearchCustomer.data[0].id;
            }

            const plan = await Post.Plans.create({
                plan_id: product.id,
                organization_id: user.organization_id,
                metadata: dados,
                value: amount,
                status: 'pending',
            });

            const payment = await stripe.checkout.sessions.create({
                billing_address_collection: 'auto',
                line_items: [{
                    price: price.id,
                    // For metered billing, do not pass quantity
                    quantity: 1,

                }, ],
                mode: 'subscription',
                customer: clienteIdStripe,
                payment_method_types: [
                    "boleto",
                    "card",
                ],
                success_url: `${YOUR_DOMAIN}/obrigado-pelo-pagamento`,
                cancel_url: `${YOUR_DOMAIN}/planos`,
                client_reference_id: plan.dataValues.id,
            });

            res.status(200).json(payment);
            console.log("==== subscriptions ok ======");


        } catch (error) {
            console.log("==== error ======");
            console.log(error)
            console.log("==== error ======");
            res.status(500).send(error);
        }

    } else {
        res.redirect('/login')
    }
})

api.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async(req, res) => {

    const type = req.body.type;
    const dados = req.body.data.object;


    // console.log(`=== webhook:${type} ===`)
    // console.log(req.body)
    // console.log(`=== end:webhook:${type} ===`)


    switch (type) {

        case 'checkout.session.completed':

            try {

                var plan = await Post.Plans.findOne({
                    where: {
                        id: dados.client_reference_id
                    }
                })

                Post.Subscriptions.create({
                    plan_id: plan.dataValues.id,
                    subscription_id: dados.subscription,
                    organization_id: plan.dataValues.organization_id,
                    nota_fiscal: "",
                    plan: 'Personalizado',
                    payment_method: "",
                    period: plan.dataValues.metadata.frequency_repeat,
                    url_boleto: "",
                    invoiceJson: plan.dataValues.metadata,
                    paymentJson: "",
                    amount: dados.amount_total,
                    status: dados.status,
                }).then((retorno) => {
                    res.status(200).send();
                }).catch((error) => {
                    res.status(500).send();
                    console.log("=== error ===")
                    console.log(error)
                })

            } catch (error) {
                console.log("=== error ===")
                console.log(error)
            }

            break;

        case 'payment_intent.created':

            // try {

            //     var plan = await Post.Plans.findOne({
            //         where: {
            //             id: dados.client_reference_id
            //         }
            //     })

            //     Post.Subscriptions.create({
            //         plan_id: plan.dataValues.id,
            //         subscription_id: dados.subscription,
            //         organization_id: plan.dataValues.organization_id,
            //         nota_fiscal: "",
            //         plan: 'Personalizado',
            //         payment_method: "",
            //         period: "",
            //         url_boleto: "",
            //         invoiceJson: plan.dataValues.metadata,
            //         paymentJson: "",
            //         amount: dados.amount_total,
            //         status: dados.status,
            //     }).then((retorno) => {
            //         res.status(200).send();
            //     }).catch((error) => {
            //         res.status(500).send();
            //         console.log("=== error ===")
            //         console.log(error)
            //     })

            // } catch (error) {
            //     console.log("=== error ===")
            //     console.log(error)
            // }

            break;

        case 'invoice.paid':

            // console.log("=== webhook:invoice.paid ===")
            // console.log(req.body)
            // console.log("=== end:webhook:invoice.paid ===")

            try {

                Post.Plans.update({
                    status: "active",
                }, {
                    where: {
                        id: dados.client_reference_id,
                    }
                }).then((retorno) => {

                }).catch((error) => {
                    // res.status(500).send();
                    console.log("=== error.Plans.update ===")
                    console.log(error)
                });

                Post.Subscriptions.update({
                    status: dados.status,
                    paymentJson: dados,
                    url_boleto: dados.hosted_invoice_url,
                }, {
                    where: {
                        subscription_id: dados.subscription,
                    }
                }).then((retorno) => {
                    res.status(200).send();
                }).catch((error) => {
                    res.status(500).send();
                    console.log("=== error ===")
                    console.log(error)
                })

            } catch (error) {
                console.log("=== error ===")
                console.log(error)
            }

            break;

        case 'invoice.updated':

            // console.log("=== webhook:invoice.paid ===")
            // console.log(req.body)
            // console.log("=== end:webhook:invoice.paid ===")

            try {

                Post.Subscriptions.update({
                    status: dados.status,
                }, {
                    where: {
                        subscription_id: dados.subscription,
                    }
                }).then((retorno) => {
                    res.status(200).send();
                }).catch((error) => {
                    res.status(500).send();
                    console.log("=== error ===")
                    console.log(error)
                })

            } catch (error) {
                console.log("=== error ===")
                console.log(error)
            }

            break;

        default:
            res.status(200).send();
            break;
    }

    // Return a 200 response to acknowledge receipt of the event

});


api.get(`/api/stripe/clock`, async(req, res) => {
    const testClock = await stripe.testHelpers.testClocks.create({
        frozen_time: 1680224400,
    });

    res.status(200).json(testClock);
})

api.get(`/api/stripe/clock/:clock_id`, async(req, res) => {
    const testClock = await stripe.testHelpers.testClocks.retrieve(
        req.params.clock_id
    );

    res.status(200).json(testClock);
})

module.exports = api;