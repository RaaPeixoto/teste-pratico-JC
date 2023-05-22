const express = require('express')
const session = require('express-session')
const api = express.Router()
const axios = require('axios').default
const fs = require('fs')
const Post = require('../../models/Post')
const { Op } = require("sequelize")
const sinesp = require('sinesp-nodejs')

async function getReferFipe() {
    let config = {
        method: 'post',
        url: 'https://fipe.contrateumdev.com.br/api/ConsultarTabelaDeReferencia',
        headers: {
            'chave': '$2y$10$8IAZn7HKq7QJWbh37N3GOOeRVv'
        }
    };

    var response = await axios(config);

    var date = new Date();
    var numMes = date.getMonth();
    var ano = date.getFullYear();
    var meses = [
        'janeiro',
        'fevereiro',
        'março',
        'abril',
        'maio',
        'junho',
        'julho',
        'agosto',
        'setembro',
        'outubro',
        'novembro',
        'dezembro',
    ]

    var ref = meses[numMes] + '/' + ano + " ";

    var referencia = response.data.filter(item => item.Mes == ref);

    const refer = referencia[0].Codigo;

    console.log("===============refer==================");
    console.log(refer);
    console.log("===============refer==================");

    return refer;
}

api.post('/apps/instal-app/pipe', async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.pipes && user.permissions.pipes.includes('editar')) {

            var app_id = req.body.app_id;

            var Org = await Post.Organizations.findOne({
                where: { id: user.organization_id }
            })

            var meta = Org.metadata;

            if (Array.isArray(meta)) {
                meta = {};
            }

            if (!meta.apps) {
                meta['apps'] = [];
            }

            if (meta.apps.includes(app_id)) {
                res.status(202).json('App já instalado!');
                return;
            }

            meta.apps.push(app_id);

            Post.Organizations.update({
                metadata: meta
            }, {
                where: { id: user.organization_id }
            }).then((resposta) => {

                res.status(200).json(resposta);

            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para editar cards.');

        }


    } else {
        res.redirect('/login')
    }

})

api.get('/api/organization', async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        Post.Organizations.findOne({
            where: {
                id: user.organization_id
            }
        }).then((resposta) => {

            res.status(200).json(resposta);

        }).catch((error) => {
            res.status(500).json(error);
        })

    } else {
        res.redirect('/login')
    }

})

api.get('/busca-placa/:placa', async(req, res) => {

    axios.post("https://sinesp.contrateumdev.com.br/api", {
        placa: req.params.placa
    }, {
        headers: {
            chave: 'chavedemo'
        }
    }).then((veiculo) => {

        res.status(200).json(veiculo.data);

    }).catch((error) => {
        console.log(error);

    })

})

api.get('/busca-veiculo/tabela-referencia', async(req, res) => {
    var result = await getReferFipe();
    res.json(result)
    console.log(result)

})

api.get('/busca-veiculo/marcas/:codigoTipoVeiculo', async(req, res) => {

    const codigoTabelaReferencia = await getReferFipe();

    try {

        axios.post("https://fipe.contrateumdev.com.br/api/ConsultarMarcas", {
            codigoTabelaReferencia: codigoTabelaReferencia,
            codigoTipoVeiculo: req.params.codigoTipoVeiculo
        }, {
            headers: {
                chave: '$2y$10$8IAZn7HKq7QJWbh37N3GOOeRVv'
            }
        }).then((veiculo) => {

            res.status(200).json(veiculo.data);

        }).catch((error) => {
            console.log(error);

        })

    } catch (error) {
        res.status(500).json(error);
    }

})

api.get('/busca-veiculo/modeloPorAno/:codigoTipoVeiculo/:codigoTipoCombustivel/:codigoMarca/:ano', async(req, res) => {

    const codigoTabelaReferencia = await getReferFipe();

    var ano = req.params.ano + '-1';

    try {

        axios.post("https://fipe.contrateumdev.com.br/api/ConsultarModelosAtravesDoAno", {
            codigoTabelaReferencia: codigoTabelaReferencia,
            codigoTipoVeiculo: req.params.codigoTipoVeiculo,
            codigoMarca: req.params.codigoMarca,
            ano: ano,
            codigoTipoCombustivel: req.params.codigoTipoCombustivel,
            anoModelo: req.params.ano,
        }, {
            headers: {
                chave: '$2y$10$8IAZn7HKq7QJWbh37N3GOOeRVv'
            }
        }).then((veiculo) => {

            res.status(200).json(veiculo.data);

        }).catch((error) => {
            console.log(error);
            res.status(500).json(error);
        })

    } catch (error) {
        res.status(500).json(error);
    }


})

api.get('/busca-veiculo/veiculo-completo/:codigoTipoVeiculo/:codigoTipoCombustivel/:codigoMarca/:ano/:codigoModelo', async(req, res) => {

    const codigoTabelaReferencia = await getReferFipe();

    var ano = req.params.ano + '-1';

    try {

        axios.post("https://fipe.contrateumdev.com.br/api/ConsultarValorComTodosParametros", {
            codigoTabelaReferencia: codigoTabelaReferencia,
            codigoTipoVeiculo: req.params.codigoTipoVeiculo,
            codigoMarca: req.params.codigoMarca,
            ano: ano,
            codigoTipoCombustivel: req.params.codigoTipoCombustivel,
            anoModelo: req.params.ano,
            codigoModelo: req.params.codigoModelo
        }, {
            headers: {
                chave: '$2y$10$8IAZn7HKq7QJWbh37N3GOOeRVv'
            }
        }).then((veiculo) => {

            res.status(200).json(veiculo.data);

        }).catch((error) => {
            console.log(error);
            res.status(500).json(error);
        })

    } catch (error) {
        res.status(500).json(error);
    }

})

api.get('/busca-veiculo/:placa', async(req, res) => {

    try {

        axios.post("https://sinesp.contrateumdev.com.br/api", {
            placa: req.params.placa
        }, {
            headers: {
                chave: 'chavedemo'
            }
        }).then((veiculo) => {

            res.status(200).json(veiculo.data);

        }).catch((error) => {
            console.log(error);

        })

    } catch (error) {
        res.status(500).json(error);
    }

})


module.exports = api;