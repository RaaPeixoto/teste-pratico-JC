const express = require('express');
const session = require('express-session');
const api = express.Router();
const axios = require('axios').default;
const fs = require('fs');
const Post = require('../../models/Post');
const { Op } = require("sequelize");
const access_token_mercado_pago = 'APP_USR-5979433284982031-101119-d6abead7fbc96d4d490186e53a8829c6-653709932'

const cors = require("cors");

// SDK do Mercado Pago
const mercadopago = require('mercadopago');

// Adicione as credenciais
mercadopago.configure({
    access_token: access_token_mercado_pago
});

api.post('/api/webhook/feedback', async(req, res) => {

    const transation_id = parseInt(req.body.data.id);
    const action = req.body.action;
    const type = req.body.type;

    if (transation_id != null && transation_id != '' && transation_id != undefined && transation_id != NaN) {
        try {
            const GetPayment = await axios.get(`https://api.mercadopago.com/v1/payments/${transation_id}`, {
                headers: {
                    'Authorization': `Bearer ${access_token_mercado_pago}`
                }
            })

            if (GetPayment.status == 200) {

                const payment = GetPayment.data;
                const proposal_id = parseInt(payment.description);
                const payment_method = payment.payment_method_id;
                const fee_details = JSON.stringify(payment.fee_details);
                const status = payment.status;
                const transaction_amount = payment.transaction_amount;

                var GetRegPayment = await Post.pipePay.count({
                    where: {
                        proposal_id: proposal_id
                    }
                });

                if (GetRegPayment == 0) {

                    Post.pipePay.create({
                        proposal_id: proposal_id,
                        value: transaction_amount,
                        payment_method: payment_method,
                        transation_id: transation_id,
                        status: status
                    }).then((users) => {
                        res.status(200).json(users)
                    }).catch((error) => {
                        res.status(201).json(error)
                    })

                } else {

                    Post.pipePay.update({
                        status: status,
                        payment_method: payment_method,
                        transation_id: transation_id,
                    }, {
                        where: { proposal_id: proposal_id }
                    }).then((resposta) => {
                        res.status(200);
                    }).catch((error) => {
                        res.status(201).json(error);
                    })

                }

            } else {
                console.log('Não consguimos identificar o pagamento.');
                res.status(200)
            }

        } catch {
            res.status(201)
            console.log('Não encontramos  a trasação ou transação ainda não foi criada.')
        }

    } else {
        console.log(req.body)
        res.status(200)
    }

    res.status(200)

});

module.exports = api;

// data: {
//     acquirer_reconciliation: [],
//     additional_info: {
//       authentication_code: null,
//       available_balance: null,
//       ip_address: '187.19.212.114',
//       items: [Array],
//       nsu_processadora: null
//     },
//     authorization_code: null,
//     binary_mode: false,
//     brand_id: null,
//     build_version: '2.114.2',
//     call_for_authorize_id: null,
//     callback_url: null,
//     captured: true,
//     card: {},
//     charges_details: [],
//     collector_id: 653709932,
//     corporation_id: null,
//     counter_currency: null,
//     coupon_amount: 0,
//     currency_id: 'BRL',
//     date_approved: null,
//     date_created: '2022-10-11T22:23:28.000-04:00',
//     date_last_updated: '2022-10-11T22:23:28.000-04:00',
//     date_of_expiration: '2022-10-12T22:23:28.000-04:00',
//     deduction_schema: null,
//     description: 'John',
//     differential_pricing_id: null,
//     external_reference: null,
//     fee_details: [],
//     id: 50422643823,
//     installments: 1,
//     integrator_id: null,
//     issuer_id: null,
//     live_mode: true,
//     marketplace_owner: null,
//     merchant_account_id: null,
//     merchant_number: null,
//     metadata: {},
//     money_release_date: null,
//     money_release_schema: null,
//     money_release_status: null,
//     notification_url: null,
//     operation_type: 'regular_payment',
//     order: { id: '6123010020', type: 'mercadopago' },
//     payer: {
//       email: null,
//       entity_type: null,
//       first_name: null,
//       id: '11632348',
//       identification: [Object],
//       last_name: null,
//       operator_id: null,
//       phone: [Object],
//       type: null
//     },
//     payment_method_id: 'pix',
//     payment_type_id: 'bank_transfer',
//     platform_id: null,
//     point_of_interaction: {
//       application_data: [Object],
//       business_info: [Object],
//       transaction_data: [Object],
//       type: 'CHECKOUT'
//     },
//     pos_id: null,
//     processing_mode: 'aggregator',
//     refunds: [],
//     shipping_amount: 0,
//     sponsor_id: null,
//     statement_descriptor: null,
//     status: 'pending',
//     status_detail: 'pending_waiting_transfer',
//     store_id: null,
//     taxes_amount: 0,
//     transaction_amount: 1,
//     transaction_amount_refunded: 0,
//     transaction_details: {
//       acquirer_reference: null,
//       bank_transfer_id: null,
//       external_resource_url: null,
//       financial_institution: '',
//       installment_amount: 0,
//       net_received_amount: 0,
//       overpaid_amount: 0,
//       payable_deferral_period: null,
//       payment_method_reference_id: null,
//       total_paid_amount: 1,
//       transaction_id: null
//     }
//   }
// }