const express = require('express');
const session = require('express-session');
const api = express.Router();
const axios = require('axios').default;
const fs = require('fs');
const Post = require('../../models/Post');
const { Op } = require("sequelize");

api.get('/api/analisys/:pipe_id/:inicio/:fim', async(req, res) => {

    function difDays(inicio, fim) {
        return (new Date(fim) - new Date(inicio)) / (1000 * 60 * 60 * 24);
    }

    var user = req.session.usuario;

    if (user != undefined) {

        var pipe_id = req.params.pipe_id;
        var inicio = req.params.inicio;
        var fim = req.params.fim;
        var numDias = difDays(inicio, fim);
        var result = [];

        var cards_created = [];
        for (let i = 0; i <= numDias; i++) {

            let data = new Date(inicio);
            let dataSomada = data.setDate(data.getDate() + i);
            let dataCosulta = new Date(dataSomada).toISOString().split('T')[0];

            let consult = await Post.Analisys.count({
                where: {
                    organization_id: user.organization_id,
                    action: 'card_created',
                    reg_date: dataCosulta,
                    pipe_id: pipe_id,
                }
            })

            var card_created = {
                date: dataCosulta,
                number: consult,
            }

            cards_created.push(card_created);

        }

        var card_created_element = {
            type: 'card_created',
            regs: cards_created
        }

        result.push(card_created_element);

        // ================================ //
        var card_moved = [];
        for (let i = 0; i <= numDias; i++) {

            let data = new Date(inicio);
            let dataSomada = data.setDate(data.getDate() + i);
            let dataCosulta = new Date(dataSomada).toISOString().split('T')[0];

            let consult = await Post.Analisys.count({
                where: {
                    organization_id: user.organization_id,
                    action: 'card_moved',
                    reg_date: dataCosulta,
                    pipe_id: pipe_id,
                }
            })

            let dado = {
                date: dataCosulta,
                number: consult,
            }

            card_moved.push(dado);

        }

        var card_moved_element = {
            type: 'card_moved',
            regs: card_moved
        }

        result.push(card_moved_element);

        // ================================ //
        var task_done = [];
        for (let i = 0; i <= numDias; i++) {

            let data = new Date(inicio);
            let dataSomada = data.setDate(data.getDate() + i);
            let dataCosulta = new Date(dataSomada).toISOString().split('T')[0];

            let consult = await Post.Analisys.count({
                where: {
                    organization_id: user.organization_id,
                    action: 'task_done',
                    reg_date: dataCosulta,
                    pipe_id: pipe_id,
                }
            })

            let dado = {
                date: dataCosulta,
                number: consult,
            }

            task_done.push(dado);

        }

        var task_done_element = {
            type: 'task_done',
            regs: task_done
        }

        result.push(task_done_element);

        // ================================ //

        var proposals_acepted = [];
        for (let i = 0; i <= numDias; i++) {

            let data = new Date(inicio);
            let dataSomada = data.setDate(data.getDate() + i);
            let dataCosulta = new Date(dataSomada).toISOString().split('T')[0];

            let consult = await Post.Analisys.count({
                where: {
                    organization_id: user.organization_id,
                    action: 'proposals_acepted',
                    reg_date: dataCosulta,
                    pipe_id: pipe_id,
                }
            })

            let dado = {
                date: dataCosulta,
                number: consult,
            }

            proposals_acepted.push(dado);

        }

        var proposals_acepted_element = {
            type: 'proposals_acepted',
            regs: proposals_acepted
        }

        result.push(proposals_acepted_element);


        // ================================ //

        var doc_signed = [];
        for (let i = 0; i <= numDias; i++) {

            let data = new Date(inicio);
            let dataSomada = data.setDate(data.getDate() + i);
            let dataCosulta = new Date(dataSomada).toISOString().split('T')[0];

            let consult = await Post.Analisys.count({
                where: {
                    organization_id: user.organization_id,
                    action: 'doc_signed',
                    reg_date: dataCosulta,
                    pipe_id: pipe_id,
                }
            })

            let dado = {
                date: dataCosulta,
                number: consult,
            }

            doc_signed.push(dado);

        }

        var doc_signed_element = {
            type: 'doc_signed',
            regs: doc_signed
        }

        result.push(doc_signed_element);

        // ================================ //
        var photo_registry = [];
        for (let i = 0; i <= numDias; i++) {

            let data = new Date(inicio);
            let dataSomada = data.setDate(data.getDate() + i);
            let dataCosulta = new Date(dataSomada).toISOString().split('T')[0];

            let consult = await Post.Analisys.count({
                where: {
                    organization_id: user.organization_id,
                    action: 'photo_registry',
                    reg_date: dataCosulta,
                    pipe_id: pipe_id,
                }
            })

            let dado = {
                date: dataCosulta,
                number: consult,
            }

            photo_registry.push(dado);

        }

        var photo_registry_element = {
            type: 'photo_registry',
            regs: photo_registry
        }

        result.push(photo_registry_element);

        // ================================ //


        res.status(200).json(result);

    } else {
        res.redirect('/login')
    }

});

api.get('/api/analisys/:pipe_id/:inicio/:fim/:user_id', async(req, res) => {


    function difDays(inicio, fim) {
        return (new Date(fim) - new Date(inicio)) / (1000 * 60 * 60 * 24);
    }

    var user = req.session.usuario;

    if (user != undefined) {

        var pipe_id = req.params.pipe_id;
        var user_id = req.params.user_id;
        var inicio = req.params.inicio;
        var fim = req.params.fim;
        var numDias = difDays(inicio, fim);
        var result = [];

        var cards_created = [];
        for (let i = 0; i <= numDias; i++) {

            let data = new Date(inicio);
            let dataSomada = data.setDate(data.getDate() + i);
            let dataCosulta = new Date(dataSomada).toISOString().split('T')[0];

            let consult = await Post.Analisys.count({
                where: {
                    organization_id: user.organization_id,
                    user_id: user_id,
                    action: 'card_created',
                    reg_date: dataCosulta,
                    pipe_id: pipe_id,
                }
            })

            var card_created = {
                date: dataCosulta,
                number: consult,
            }

            cards_created.push(card_created);

        }

        var card_created_element = {
            type: 'card_created',
            regs: cards_created
        }

        result.push(card_created_element);

        // ================================ //
        var card_moved = [];
        for (let i = 0; i <= numDias; i++) {

            let data = new Date(inicio);
            let dataSomada = data.setDate(data.getDate() + i);
            let dataCosulta = new Date(dataSomada).toISOString().split('T')[0];

            let consult = await Post.Analisys.count({
                where: {
                    organization_id: user.organization_id,
                    user_id: user_id,
                    action: 'card_moved',
                    reg_date: dataCosulta,
                    pipe_id: pipe_id,
                }
            })

            let dado = {
                date: dataCosulta,
                number: consult,
            }

            card_moved.push(dado);

        }

        var card_moved_element = {
            type: 'card_moved',
            regs: card_moved
        }

        result.push(card_moved_element);

        // ================================ //
        var task_done = [];
        for (let i = 0; i <= numDias; i++) {

            let data = new Date(inicio);
            let dataSomada = data.setDate(data.getDate() + i);
            let dataCosulta = new Date(dataSomada).toISOString().split('T')[0];

            let consult = await Post.Analisys.count({
                where: {
                    organization_id: user.organization_id,
                    user_id: user_id,
                    action: 'task_done',
                    reg_date: dataCosulta,
                    pipe_id: pipe_id,
                }
            })

            let dado = {
                date: dataCosulta,
                number: consult,
            }

            task_done.push(dado);

        }

        var task_done_element = {
            type: 'task_done',
            regs: task_done
        }

        result.push(task_done_element);

        // ================================ //

        var proposals_acepted = [];
        for (let i = 0; i <= numDias; i++) {

            let data = new Date(inicio);
            let dataSomada = data.setDate(data.getDate() + i);
            let dataCosulta = new Date(dataSomada).toISOString().split('T')[0];

            let consult = await Post.Analisys.count({
                where: {
                    organization_id: user.organization_id,
                    user_id: user_id,
                    action: 'proposals_acepted',
                    reg_date: dataCosulta,
                    pipe_id: pipe_id,
                }
            })

            let dado = {
                date: dataCosulta,
                number: consult,
            }

            proposals_acepted.push(dado);

        }

        var proposals_acepted_element = {
            type: 'proposals_acepted',
            regs: proposals_acepted
        }

        result.push(proposals_acepted_element);


        // ================================ //

        var doc_signed = [];
        for (let i = 0; i <= numDias; i++) {

            let data = new Date(inicio);
            let dataSomada = data.setDate(data.getDate() + i);
            let dataCosulta = new Date(dataSomada).toISOString().split('T')[0];

            let consult = await Post.Analisys.count({
                where: {
                    organization_id: user.organization_id,
                    user_id: user_id,
                    action: 'doc_signed',
                    reg_date: dataCosulta,
                    pipe_id: pipe_id,
                }
            })

            let dado = {
                date: dataCosulta,
                number: consult,
            }

            doc_signed.push(dado);

        }

        var doc_signed_element = {
            type: 'doc_signed',
            regs: doc_signed
        }

        result.push(doc_signed_element);

        // ================================ //
        var photo_registry = [];
        for (let i = 0; i <= numDias; i++) {

            let data = new Date(inicio);
            let dataSomada = data.setDate(data.getDate() + i);
            let dataCosulta = new Date(dataSomada).toISOString().split('T')[0];

            let consult = await Post.Analisys.count({
                where: {
                    organization_id: user.organization_id,
                    user_id: user_id,
                    action: 'photo_registry',
                    reg_date: dataCosulta,
                    pipe_id: pipe_id,
                }
            })

            let dado = {
                date: dataCosulta,
                number: consult,
            }

            photo_registry.push(dado);

        }

        var photo_registry_element = {
            type: 'photo_registry',
            regs: photo_registry
        }

        result.push(photo_registry_element);

        // ================================ //


        res.status(200).json(result);

    } else {
        res.redirect('/login')
    }

});



api.post(`/api/analisys`, async(req, res) => {

    var user = req.session.usuario;

    var hoje = new Date().toISOString().split('T')[0];

    if (user != undefined) {

        Post.Analisys.create({
            organization_id: user.organization_id,
            user_id: user.id,
            pipe_id: req.body.pipe_id,
            card_id: req.body.card_id,
            action: req.body.action,
            reg_date: hoje,
            metadata: req.body.metadata,
        }).then((insertCard) => {
            res.status(200).json('Ação registrada!')
        }).catch((erro) => {
            res.status(500).json(erro)
        })

    } else {
        Post.Analisys.create({
            organization_id: req.body.metadata.organization_id,
            user_id: req.body.metadata.id,
            pipe_id: req.body.pipe_id,
            card_id: req.body.card_id,
            action: req.body.action,
            reg_date: hoje,
            metadata: req.body.metadata,
        }).then((insertCard) => {
            res.status(200).json('Ação registrada!')
        }).catch((erro) => {
            res.status(500).json(erro)
        })
    }
})


api.get(`/api/analisys/card/:card_id`, (req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.type == 'gestor') {

            Post.Analisys.findAll({
                where: {
                    card_id: req.params.card_id
                }
            }).then((steps) => {
                res.status(200).json(steps)
            }).catch((error) => {
                res.status(500).json(error)
            })


        } else {

            res.status(201).json('Você não tem permissão para visualizar Análises.');

        }

    } else {
        res.redirect('/login')
    }

})

api.get(`/api/analisys-by-action-and-card/:card_id/:action`, (req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.type == 'gestor') {

            Post.Analisys.findAll({
                where: {
                    card_id: req.params.card_id,
                    action: req.params.action,
                }
            }).then((steps) => {
                res.status(200).json(steps)
            }).catch((error) => {
                res.status(500).json(error)
            })


        } else {

            res.status(201).json('Você não tem permissão para visualizar Análises.');

        }

    } else {
        res.redirect('/login')
    }

})

// api.get(`/api/analisys/pipe/:pipe_id/:inicio/:fim`, (req, res) => {

//     const user = req.session.usuario;

//     if (user != undefined) {

//         if (user.type == 'master' || user.type == 'gestor') {

//             Post.Analisys.findAll({
//                 where: {
//                     pipe_id: req.params.pipe_id,
//                     createdAt: {
//                         [Op.between]: [req.params.inicio, req.params.fim]
//                     }
//                 }
//             }).then((steps) => {
//                 res.status(200).json(steps)
//             }).catch((error) => {
//                 res.status(500).json(error)
//             })


//         } else {

//             res.status(201).json('Você não tem permissão para visualizar Análises.');

//         }

//     } else {
//         res.redirect('/login')
//     }

// })

api.get(`/api/analisys/atualizar`, async(req, res) => {

    // var dados = await Post.Analisys.findAll({
    //     where: { card_id: null }
    // })

    // var teste = []

    // for (dado of dados) {

    //     if (dado.metadata.to.card && dado.metadata.to.card != undefined && dado.metadata.to.card != null) {
    //         var c = dado.metadata.to.card;

    //         var card_id = parseFloat(c);

    //         var update = await Post.Analisys.update({
    //             card_id: card_id
    //         }, {
    //             where: { id: dado.id }
    //         });

    //         teste.push(update)
    //     }

    //     // if (dado.metadata.card_id && dado.metadata.card_id != undefined && dado.metadata.card_id != null) {

    //     //     var c = dado.metadata.card_id;

    //     //     var card_id = parseFloat(c);

    //     //     var update = await Post.Analisys.update({
    //     //         card_id: card_id
    //     //     }, {
    //     //         where: { id: dado.id }
    //     //     });

    //     //     teste.push(update)
    //     // }
    // }

    // res.status(200).json(teste);
    res.status(200).json('Rota desativada!');

})



module.exports = api;