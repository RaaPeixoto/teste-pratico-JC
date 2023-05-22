const express = require('express')
const session = require('express-session')
const api = express.Router()
const axios = require('axios').default
const fs = require('fs')
const Post = require('../../models/Post')
const { Op } = require("sequelize");

api.post(`/api/list/criar`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {
        if (user.type == 'master' || user.permissions.listas && user.permissions.listas.includes('criar')) {

            var list = req.body.list;

            Post.Lists.create({
                organization_id: user.organization_id,
                creator_id: user.id,
                title: list.title,
                users: `[${user.id}]`,
                color: `#8de0b5`,
                img: `/img/svg/fi-rr-list-check.svg`,
                metadata: list.meta,
                status: 'active',
            }).then((listaCriada) => {
                res.status(200).json(listaCriada.id);
            }).catch((error) => {
                res.status(203).json('Erro ao criar esta lista.');
            })

        } else {
            res.status(201).json('Você não tem permissão para editar Listas.');
        }

    } else {
        res.redirect('/login')
    }

})

api.post(`/api/item/criar`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.itens && user.permissions.itens.includes('criar')) {

            var list = req.body.list;

            Post.Itens.create({
                organization_id: user.organization_id,
                creator_id: user.id,
                list_id: list.list_id,
                metadata: list.lines,
                status: 'active',
            }).then((listaCriada) => {
                res.status(200).json(listaCriada);
            }).catch((error) => {
                res.status(203).json('Erro ao criar esta lista.');
            })

        } else {
            res.status(201).json('Você não tem permissão para editar Listas.');
        }

    } else {
        res.redirect('/login')
    }

})

api.get(`/api/list/listar`, (req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.itens && user.permissions.itens.includes('editar')) {

            Post.Lists.findAll({
                where: {
                    organization_id: user.organization_id,
                    status: 'active'
                }
            }).then((lists) => {
                res.status(200).json(lists)
            }).catch((error) => {
                res.status(500).json(error)
            })


        } else {
            res.status(201).json('Você não tem permissão para editar Listas.');
        }

    } else {
        res.redirect('/login')
    }

})

api.get(`/api/list/count/:list_id`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        Post.Itens.count({
            where: {
                list_id: req.params.list_id,
                status: 'active',
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

api.get(`/api/list/:list_id`, async(req, res) => {

    Post.Lists.findOne({
        where: { 
            id: req.params.list_id,
            status: "active"
        }
    }).then((resposta) => {
        res.status(200).json(resposta);
    }).catch((error) => {
        res.status(500).json(error);
    })

})

api.get(`/api/itens/:list_id/:pagina`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.itens && user.permissions.itens.includes('visualizar')) {

            const { Op } = require("sequelize");

            var page = (parseInt(req.params.pagina) - 1) * 30;

            Post.Itens.findAndCountAll({
                limit: 30,
                offset: page,
                where: {
                    list_id: req.params.list_id,
                    status: "active"
                }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {
            res.status(201).json('Você não tem permissão para visualizar Listas.');
        }

    } else {
        res.redirect('/login')
    }

})

api.get(`/api/lista/:list_id/:pagina`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.listas && user.permissions.listas.includes('visualizar')) {

            const { Op } = require("sequelize");

            var page = (parseInt(req.params.pagina) - 1) * 25;

            Post.Lists.findAndCountAll({
                limit: 25,
                offset: page,
                where: {
                    id: req.params.list_id,
                    status: "active"
                }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {
            res.status(201).json('Você não tem permissão para visualizar Listas.');
        }

    } else {
        res.redirect('/login')
    }

})


api.get(`/api/list/listar/:list_id/:inicio/:fim`, (req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        Post.Itens.findAll({
            where: {
                list_id: req.params.list_id,
                status: 'active',
                updatedAt: {
                    [Op.between]: [req.params.inicio, req.params.fim]
                }
            }
        }).then((cards) => {
            res.status(200).json(cards)
        }).catch((error) => {
            res.status(500).json(error)
        })

    } else {
        res.redirect('/login')
    }

})

api.post(`/api/itens/buscar/:page`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.itens && user.permissions.itens.includes('visualizar')) {

            var page = (parseInt(req.params.page) - 1) * 25;

            var termo = `${req.body.termo}`;

            try {

                Post.Itens.findAndCountAll({

                    limit: 25,
                    offset: page,
                    where: {
                        status: 'active',
                        organization_id: user.organization_id,
                        list_id: req.body.list_id,
                        metadata: {
                            [Op.substring]: termo
                        }
                    }

                }).then((resposta) => {
                    res.status(200).json(resposta);
                }).catch((error) => {
                    res.status(500).json(error);
                })

            } catch (error) {
                res.status(500).json(error);
            }

        } else {
            res.status(201).json('Você não tem permissão para visualizar Listas.');
        }

    } else {
        res.redirect('/login')
    }

})


api.put(`/api/list/excluir`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.listas && user.permissions.listas.includes('excluir')) {

            Post.Lists.update({
                status: "deleted"
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para editar Listas.');

        }

    } else {
        res.redirect('/login')
    }
})

api.put(`/api/list/title`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.listas && user.permissions.listas.includes('editar')) {

            Post.Lists.update({
                title: req.body.title
            }, {
                where: { id: req.body.list_id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para editar Listas.');

        }

    } else {
        res.redirect('/login')
    }
})

api.put(`/api/list/metadata`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.listas && user.permissions.listas.includes('editar')) {

            Post.Lists.update({
                metadata: req.body.metadata
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para editar Listas.');

        }

    } else {
        res.redirect('/login')
    }
})


api.put(`/api/itens/delete`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.itens && user.permissions.itens.includes('excluir')) {

            Post.Itens.update({
                status: 'deleted'
            }, {
                where: { id: req.body.iten_id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para excluir registros das Listas.');

        }

    } else {
        res.redirect('/login')
    }
})


api.get(`/api/item/:id`, async(req, res) => {

    Post.Itens.findOne({
        where: { id: req.params.id }
    }).then((resposta) => {
        res.status(200).json(resposta);
    }).catch((error) => {
        res.status(500).json(error);
    })

})

api.get(`/api/item/list/:list_id`, async(req, res) => {

    Post.Itens.findAll({
        where: {
            list_id: req.params.list_id,
            status: 'active'
        }
    }).then((resposta) => {
        res.status(200).json(resposta);
    }).catch((error) => {
        res.status(500).json(error);
    })


})

api.put(`/api/item`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.itens && user.permissions.itens.includes('editar')) {

            var item = await Post.Itens.findOne({
                where: { id: req.body.item_id }
            })

            var NovoCampo = item.metadata.filter(item => item.campo_id != req.body.campo_id);
            var campo = item.metadata.filter(item => item.campo_id == req.body.campo_id)[0];

            campo.value = req.body.value;

            NovoCampo.push(campo);

            Post.Itens.update({
                metadata: NovoCampo
            }, {
                where: { id: req.body.item_id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {
            res.status(201).json('Você não tem permissão para excluir registros das Listas.');
        }

    } else {
        res.redirect('/login')
    }
})

api.put(`/api/item/metadata`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.itens && user.permissions.itens.includes('editar')) {


            Post.Itens.update({
                metadata: req.body.metadata
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {
            res.status(201).json('Você não tem permissão para editar registros das Listas.');
        }

    } else {
        res.redirect('/login')
    }
})


module.exports = api;