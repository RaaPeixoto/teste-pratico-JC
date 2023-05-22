const express = require('express')
const session = require('express-session')
const api = express.Router()
const axios = require('axios').default
const fs = require('fs')
const Post = require('../../models/Post')
const { Op } = require("sequelize")

api.post(`/api/signatures/create`, async(req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.assinatura && user.permissions.assinatura.includes('criar')) {

            Post.Signatures.create({
                organization_id: user.organization_id,
                creator_id: user.id,
                card_id: req.body.card_id,
                document: req.body.document,
                metadata: req.body.metadata,
                signers: req.body.signers,
                status: 'pending'
            }).then((step) => {
                res.status(200).json(step)
            }).catch((error) => {
                res.status(500).json(error)
            })

        } else {

            res.status(201).json('Você não tem permissão para criar assinaturas.');

        }


    } else {
        res.redirect('login')
    }

})

api.get(`/api/signatures/listar/:card_id`, async(req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.assinatura && user.permissions.assinatura.includes('visualizar')) {

            Post.Signatures.findAll({
                where: {
                    card_id: req.params.card_id,
                    status: {
                        [Op.notLike]: `deleted`
                    }
                }
            }).then((signatures) => {
                res.status(200).json(signatures);
            }).catch((error) => {
                res.status(500).json(error)
            })

        } else {

            res.status(201).json('Você não tem permissão para visualizar assinaturas.');

        }


    } else {
        res.redirect('/login')
    }

})

api.get(`/api/signature/:sign_id`, async(req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.assinatura && user.permissions.assinatura.includes('visualizar')) {

            Post.Signatures.findOne({
                where: {
                    id: req.params.sign_id
                }
            }).then((signature) => {
                res.status(200).json(signature);
            }).catch((error) => {
                res.status(500).json(error)
            })

        } else {

            res.status(201).json('Você não tem permissão para visualizar assinaturas.');

        }


    } else {
        res.redirect('/login')
    }

})

api.get(`/api/public/signature/:sign_id`, async(req, res) => {


    Post.Signatures.findOne({
        where: {
            id: req.params.sign_id
        }
    }).then((signature) => {
        res.status(200).json(signature);
    }).catch((error) => {
        res.status(500).json(error)
    })



})


api.put(`/api/signature/update/signers`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.assinatura && user.permissions.assinatura.includes('editar')) {

            Post.Signatures.update({
                signers: req.body.signers
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para editar assinaturas.');

        }


    } else {
        res.redirect('/login')
    }

})

api.put(`/api/signature/update-assinatura/signers`, async(req, res) => {

    Post.Signatures.update({
        signers: req.body.signers,
        signatureDate: req.body.date,
    }, {
        where: { id: req.body.id }
    }).then((resposta) => {
        res.status(200).json(resposta);
    }).catch((error) => {
        res.status(500).json(error);
    })


})

api.put(`/api/signature/revoke`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.assinatura && user.permissions.assinatura.includes('editar')) {


            const email = req.body.email;
            const id = req.body.id;

            var assinatura = await Post.Signatures.findOne({
                where: {
                    id: id
                }
            })

            var arayAtual = assinatura.signers.filter((item) => item.email !== email);
            var newArray = assinatura.signers.filter((item) => item.email === email);
            var sign = newArray[0];

            sign.cpf = "";
            sign.date = "";
            sign.hash = "";
            sign.ipAdress = ""
            sign.nome = "";

            try {
                await fs.unlinkSync(`./public/img/faceid/${sign.foto}`);
            } catch (error) {
                console.log('Erro na linha 143: ' + error.message);
            }

            sign.foto = "";
            arayAtual.push(sign);

            Post.Signatures.update({
                signers: arayAtual
            }, {
                where: { id: id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })


        } else {

            res.status(201).json('Você não tem permissão para editar assinaturas.');

        }


    } else {
        res.redirect('/login')
    }



})

api.put(`/api/signature/delete`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.assinatura && user.permissions.assinatura.includes('excluir')) {

            const id = req.body.id;

            Post.Signatures.update({
                status: 'deleted'
            }, {
                where: { id: id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para excluir assinaturas.');

        }


    } else {
        res.redirect('/login')
    }

})

api.get(`/api/signature/count/:payment_date`, async(req, res) => {
    const user = req.session.usuario;

    if (user != undefined) {

        var payment_date = req.params.payment_date;
        var compra = new Date(payment_date);
        var dataCompra = new Date(payment_date);
        var dataSomada = dataCompra.setDate(dataCompra.getDate() + 30);
        var vencimento = new Date(dataSomada);

        Post.Signatures.count({
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

module.exports = api;