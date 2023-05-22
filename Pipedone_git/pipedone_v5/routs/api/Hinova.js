const express = require('express')
const session = require('express-session')
const api = express.Router()
const axios = require('axios').default
const fs = require('fs')
const Post = require('../../models/Post')
const { Op } = require("sequelize")

const cors = require('cors');
api.use(cors());

api.post(`/api/hinova/auth-member`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        var users = await Post.Users.findOne({
            where: {
                id: user.id
            }
        })

        var org = await Post.Organizations.findOne({
            where: {
                id: user.organization_id
            }
        })

        var metaOrg = org.metadata;
        var metaUser = JSON.parse(users.metadata);

        if (!metaUser.auth) {
            metaUser['auth'] = {
                hinova: {}
            };
        }

        var authHinova = await axios.post(`https://api.hinova.com.br/api/sga/v2/usuario/autenticar`, {
            usuario: req.body.login,
            senha: req.body.senha
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${metaOrg.config.hinova.token}`,
            }
        })

        metaUser.auth.hinova['token'] = authHinova.data.token_usuario;

        Post.Users.update({
            metadata: JSON.stringify(metaUser)
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


api.post(`/api/hinova/associado/cadastrar`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        var obj = req.body.obj;

        var date = new Date();
        var mes = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '12'];
        var mes_de_referente = mes[date.getMonth()] + '/' + date.getFullYear();
        var data_de_contrato = date.getDate() + '/' + mes[date.getMonth()] + '/' + date.getFullYear();

        var data = {
            nome: obj.nome,
            cpf: obj.cpf.replaceAll('.', '').replaceAll('-', ''),
            rg: obj.rg,
            data_nascimento: obj.data_nascimento,
            telefone: obj.telefone,
            celular: obj.celular,
            email: obj.email,
            logradouro: obj.logradouro,
            numero: obj.numero,
            complemento: obj.complemento,
            bairro: obj.bairro,
            cidade: obj.cidade,
            estado: obj.estado,
            cep: obj.cep,
            codigo_profissao: "",
            codigo_regional: "",
            codigo_cooperativa: obj.codigo_cooperativa,
            codigo_conta: "",
            dia_vencimento: obj.dia_vencimento,
            codigo_externo: "",
            sexo: obj.sexo,
            data_vencimento_habilitacao: data_de_contrato,
            data_primeira_habilitacao: data_de_contrato,
            categoria_cnh: "",
            numero_cnh: "",
            data_contrato: data_de_contrato,
            valor_fixo: "",
            mes_referente: mes_de_referente,
            qtde_parcela_carne: "",
            codigo_como_conheceu: "01",
            beneficios: [],
        }

        var users = await Post.Users.findOne({
            where: {
                id: "20010"
            }
        })

        var metaUser = JSON.parse(users.metadata);

        if (!metaUser.auth.hinova.token || metaUser.auth.hinova.token.length == 0) {
            res.status(201).json("Usuário não autenticado");
            return;
        }

        // var data = req.body.data;


        axios.post(`https://api.hinova.com.br/api/sga/v2/associado/cadastrar`, {
            nome: data.nome,
            cpf: data.cpf,
            rg: data.rg,
            data_nascimento: data.data_nascimento,
            telefone: data.telefone,
            celular: data.celular,
            email: data.email,
            logradouro: data.logradouro,
            numero: data.numero,
            complemento: data.complemento,
            bairro: data.bairro,
            cidade: data.cidade,
            estado: data.estado,
            cep: data.cep,
            codigo_profissao: data.codigo_profissao,
            codigo_regional: data.codigo_regional,
            codigo_cooperativa: data.codigo_cooperativa,
            codigo_conta: data.codigo_conta,
            dia_vencimento: data.dia_vencimento,
            codigo_externo: data.codigo_externo,
            sexo: data.sexo,
            data_vencimento_habilitacao: data.data_vencimento_habilitacao,
            data_primeira_habilitacao: data.data_primeira_habilitacao,
            categoria_cnh: data.categoria_cnh,
            numero_cnh: data.numero_cnh,
            data_contrato: data.data_contrato,
            valor_fixo: data.valor_fixo,
            mes_referente: data.mes_referente,
            qtde_parcela_carne: data.qtde_parcela_carne,
            codigo_como_conheceu: data.codigo_como_conheceu,
            beneficios: data.beneficios,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${metaUser.auth.hinova.token}`,
            }
        }).then((sucesso) => {
            console.log("==== sucessoCadastro ====")
            console.log(sucesso.data.mensagem);
            console.log("==== sucessoCadastro ====")
            res.status(200).json(sucesso.data);
        }).catch((error) => {

            console.log("==== errorCadastro ====")
            console.log(error)
            console.log("==== errorCadastro ====")

            res.status(500).json(error.data);
        })

        // res.status(200).json(newUser);

    } else {
        res.redirect('/login')
    }
})

api.get('/api/hinova/buscar-associado/:cpf', async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        var meta = JSON.parse(user.metadata)
        var tokenHinova = meta.auth.hinova.token;

        let config = {
            method: 'get',
            url: `https://api.hinova.com.br/api/sga/v2/associado/buscar/${req.params.cpf}`,
            headers: {
                'Content-Type': `application/json`,
                'Authorization': `Bearer ${tokenHinova}`,
            }
        };

        axios(config).then((sucess) => {
            res.status(sucess.status).json(sucess.data);
            console.log("=== sucess ===");
            console.log(sucess);
            console.log("=== sucess ===");
        }).catch((error) => {
            console.log("=== error ===");
            console.log(error);
            console.log("=== error ===");

            res.status(400).json(error);
        });

        // if (response.status == 200) {
        // } else {
        //     res.status(response.status).json(response.data);
        // }



    } else {
        res.redirect('/login')
    }

})

api.get('/hinova-api/TiposDeVeiculosHinova', async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        var meta = JSON.parse(user.metadata)
        var tokenHinova = meta.auth.hinova.token;

        try {
            let config = {
                method: 'get',
                url: 'https://api.hinova.com.br/api/sga/v2/listar/tipo-veiculo/ativo',
                headers: {
                    'Content-Type': `application/json`,
                    'Authorization': `Bearer ${tokenHinova}`,
                }
            };

            var response = await axios(config);

            res.status(response.status).json(response.data);

        } catch (error) {

            var msg = {
                reason: 'Não conseguimos carregar a lista de tipos da hinova.',
                error: error
            }
            res.status(500).json(msg);
        }

    } else {
        res.redirect('/login')
    }

})

api.get('/hinova-api/CategoriasDeVeiculosHinova/:codigo_tipo', async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        var meta = JSON.parse(user.metadata)
        var tokenHinova = meta.auth.hinova.token;

        try {

            let config = {
                method: 'get',
                url: `https://api.hinova.com.br/api/sga/v2/listar/categoria-veiculo/${req.params.codigo_tipo}/ativo`,
                headers: {
                    'Content-Type': `application/json`,
                    'Authorization': `Bearer ${tokenHinova}`,
                }
            };

            var response = await axios(config);

            res.status(response.status).json(response.data);

        } catch (error) {
            res.status(500).json(error.response.data);
        }


    } else {
        res.redirect('/login')
    }

})

api.get('/hinova-api/listaProdutosAtivosHinova/:codigo_tipo', async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        var meta = JSON.parse(user.metadata)
        var tokenHinova = meta.auth.hinova.token;

        try {

            let config = {
                method: 'get',
                url: `https://api.hinova.com.br/api/sga/v2/listar/produto-por-situacao/ativo`,
                headers: {
                    'Content-Type': `application/json`,
                    'Authorization': `Bearer ${tokenHinova}`,
                }
            };

            var response = await axios(config);

            // var grupo = response.data.filter(item => item.tipo_veiculo == req.params.codigo_tipo);

            res.status(response.status).json(response.data);

        } catch (error) {
            res.status(500).json(error.response.data);
        }


    } else {
        res.redirect('/login')
    }

})

api.get('/hinova-api/listaPacotesAtivosHinova', async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        var meta = JSON.parse(user.metadata)
        var tokenHinova = meta.auth.hinova.token;

        try {

            let config = {
                method: 'get',
                url: `https://api.hinova.com.br/api/sga/v2/listar/grupo-produto/ativo`,
                headers: {
                    'Content-Type': `application/json`,
                    'Authorization': `Bearer ${tokenHinova}`,
                }
            };

            var response = await axios(config);

            // var grupo = response.data.filter(item => item.tipo_veiculo == req.params.codigo_tipo);

            res.status(response.status).json(response.data);

        } catch (error) {
            res.status(500).json(error.response.data);
        }


    } else {
        res.redirect('/login')
    }

})

api.get('/hinova-api/busca-voluntario', async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        var meta = JSON.parse(user.metadata)
        var tokenHinova = meta.auth.hinova.token;

        try {

            let config = {
                method: 'get',
                url: `https://api.hinova.com.br/api/sga/v2/buscar/voluntario/${user.cpf}`,
                headers: {
                    'Content-Type': `application/json`,
                    'Authorization': `Bearer ${tokenHinova}`,
                }
            };

            var response = await axios(config);

            // var grupo = response.data.filter(item => item.tipo_veiculo == req.params.codigo_tipo);

            res.status(response.status).json(response.data);

        } catch (error) {
            res.status(500).json(error.response.data);
        }


    } else {
        res.redirect('/login')
    }

})

api.get('/hinova-api/listaGruposProdutos', async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        var meta = JSON.parse(user.metadata)
        var tokenHinova = meta.auth.hinova.token;

        try {

            let config = {
                method: 'get',
                url: `https://api.hinova.com.br/api/sga/v2/grupoproduto/listar/todos`,
                headers: {
                    'Content-Type': `application/json`,
                    'Authorization': `Bearer ${tokenHinova}`,
                }
            };

            var response = await axios(config);

            // var grupo = response.data.filter(item => item.tipo_veiculo == req.params.codigo_tipo);

            res.status(response.status).json(response.data);

        } catch (error) {
            res.status(500).json(error.response.data);
        }


    } else {
        res.redirect('/login')
    }

})

api.get('/hinova-api/produto/buscar/:produto_id', async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        var meta = JSON.parse(user.metadata)
        var tokenHinova = meta.auth.hinova.token;

        try {

            let config = {
                method: 'get',
                url: `https://api.hinova.com.br/api/sga/v2/produto/buscar/${req.params.produto_id}`,
                headers: {
                    'Content-Type': `application/json`,
                    'Authorization': `Bearer ${tokenHinova}`,
                }
            };

            var response = await axios(config);

            // var grupo = response.data.filter(item => item.tipo_veiculo == req.params.codigo_tipo);

            res.status(response.status).json(response.data);

        } catch (error) {
            res.status(500).json(error.response.data);
        }


    } else {
        res.redirect('/login')
    }

})

module.exports = api;