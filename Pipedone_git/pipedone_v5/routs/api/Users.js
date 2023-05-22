const express = require('express')
const session = require('express-session')
const api = express.Router()
const axios = require('axios').default
const fs = require('fs')
const Post = require('../../models/Post')
const { Op } = require("sequelize")

// Criptografia

var Password = require('node-php-password')

api.post(`/api/users/create`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.times && user.permissions.times.includes('criar')) {

            var getUser = await Post.Users.count({
                where: {
                    email: {
                        [Op.like]: `${req.body.email}`
                    },
                    status: {
                        [Op.like]: `active`
                    },
                    organization_id: user.organization_id
                }
            })

            var numberEmail = getUser;

            // res.status(201).json(numberEmail)

            var meta = {
                preferences: {
                    theme: "light"
                }
            }

            var permissions = {
                pipes: ['visualizar', 'criar', 'editar'],
                steps: ['visualizar', 'criar', 'editar'],
                fotos: ['visualizar', 'criar', 'editar'],
                times: ['visualizar', 'criar', 'editar'],
                formulario: ['visualizar', 'criar', 'editar'],
                pagamentos: ['visualizar', 'criar', 'editar'],
                cards: ['visualizar', 'criar', 'editar', 'mover'],
                propostas: ['visualizar', 'criar', 'editar'],
                assinatura: ['visualizar', 'criar', 'editar'],
                anexos: ['visualizar', 'criar', 'editar'],
                tarefas: ['visualizar', 'criar', 'editar'],
            };

            var pass = "&235689Ra#311291Jl@1234";
            var passHash = Password.hash(pass, "PASSWORD_BCRYPT");

            if (numberEmail == 0) {

                Post.Users.create({
                    name: req.body.name,
                    email: req.body.email,
                    pass: passHash,
                    type: req.body.type,
                    organization_id: user.organization_id,
                    metadata: JSON.stringify(meta),
                    permissions: permissions,
                    status: "active"
                }).then((users) => {
                    res.status(200).json(users)
                }).catch((error) => {
                    res.status(500).json(error)
                })

            } else {
                res.status(201).json('Usuário já cadastrado!')
            }


        } else {

            res.status(201).json('Você não tem permissão para criar um usuário.');

        }

    } else {
        res.redirect('login')
    }

})

api.get(`/api/user/get/:user_id`, (req, res) => {

    Post.Users.findOne({
        where: {
            id: req.params.user_id
        }
    }).then((Users) => {
        res.status(200).json(Users)
    }).catch((error) => {
        res.status(500).json(error)
    })


})

api.get(`/api/users/get/:users_id`, (req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.times && user.permissions.times.includes('visualizar')) {

            Post.Users.findOne({
                where: {
                    id: req.params.users_id
                }
            }).then((Users) => {
                res.status(200).json(Users)
            }).catch((error) => {
                res.status(500).json(error)
            })

        } else {

            res.status(201).json('Você não tem permissão para visualizar um usuário.');

        }


    } else {
        res.redirect('/login')
    }

})

api.get(`/api/users/listar`, (req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.times && user.permissions.times.includes('visualizar')) {

            Post.Users.findAll({
                attributes: ['email', 'id', 'metadata', 'name', 'organization_id', 'permissions', 'status', 'type', 'updatedAt', 'createdAt'],
                where: {
                    organization_id: user.organization_id,
                    status: 'active'
                }
            }).then((Users) => {
                res.status(200).json(Users)
            }).catch((error) => {
                res.status(500).json(error)
            })

        } else {

            res.status(201).json('Você não tem permissão para visualizar os usuários.');

        }



    } else {
        res.redirect('/login')
    }

})

api.get(`/api/users/listar/:status/:page`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.times && user.permissions.times.includes('visualizar')) {

            const { Op } = require("sequelize");

            var page = (parseInt(req.params.page) - 1) * 15

            Post.Users.findAndCountAll({
                attributes: ['id', 'name', 'email', 'type', 'status'],
                limit: 15,
                offset: page,
                where: {
                    status: req.params.status,
                    organization_id: user.organization_id,
                }
            }).then((resposta) => {
                res.status(200).json(resposta)
            }).catch((error) => {
                res.status(500).json("error: " + error)
            });

        } else {

            res.status(201).json('Você não tem permissão para visualizar os usuários.');

        }


    } else {
        res.redirect('/login')
    }

})

api.get(`/api/users/listar-existentes/:page`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.times && user.permissions.times.includes('visualizar')) {

            const { Op } = require("sequelize");

            var page = (parseInt(req.params.page) - 1) * 15

            Post.Users.findAndCountAll({
                limit: 15,
                offset: page,
                where: {
                    status: {
                        [Op.notLike]: 'deleted'
                    },
                    organization_id: user.organization_id,
                }
            }).then((resposta) => {
                res.status(200).json(resposta)
            }).catch((error) => {
                res.status(500).json("error: " + error)
            });

        } else {

            res.status(201).json('Você não tem permissão para visualizar os usuários.');

        }


    } else {
        res.redirect('/login')
    }

})

api.put(`/api/users/update/title`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.times && user.permissions.times.includes('editar')) {

            Post.Users.update({
                title: req.body.title
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para editar um usuário.');

        }


    } else {
        res.redirect('/login')
    }
})

api.put(`/api/users/update/status`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {


        if (user.type == 'master' || user.permissions.times && user.permissions.times.includes('editar')) {


            Post.Users.update({
                status: req.body.status
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para editar um usuário.');

        }



    } else {
        res.redirect('/login')
    }
})

api.put(`/api/users/update/metadata`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.times && user.permissions.times.includes('editar')) {

            Post.Users.update({
                metadata: req.body.metadata
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para editar um usuário.');

        }


    } else {
        res.redirect('/login')
    }
})

api.put(`/api/users/update/dados`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.times && user.permissions.times.includes('editar')) {

            Post.Users.update({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                cpf: req.body.cpf,
                type: req.body.type,
                status: req.body.status,
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })


        } else {

            res.status(201).json('Você não tem permissão para editar um usuário.');

        }


    } else {
        res.redirect('/login')
    }
})

api.put(`/api/users/update/permissions`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.times && user.permissions.times.includes('editar')) {

            Post.Users.update({
                permissions: req.body.permissions,
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })


        } else {

            res.status(201).json('Você não tem permissão para editar um usuário.');

        }


    } else {
        res.redirect('/login')
    }
})


api.get(`/api/users/count`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        Post.Users.count({
            where: {
                organization_id: user.organization_id
            }
        }).then((dados) => {
            res.status(200).json(dados);
        }).catch((error) => {
            res.status(500).json(error)
        })

    } else {
        res.redirect('/login')
    }
})



api.post(`/api/users/recovery-count`, async(req, res) => {

    Post.Users.findOne({
        where: {
            email: {
                [Op.like]: `${req.body.email}`
            },
            status: {
                [Op.like]: `active`
            }
        }
    }).then((sucess) => {

        if (parseFloat(sucess.id) > 0) {
            var code = sucess.id;
            res.status(200).json(code);
        } else {
            res.status(204).json('Conta inexistente!');
        }

    }).catch((error) => {
        res.status(500).json(error);
    })

})

api.put(`/api/users/update/pass`, async(req, res) => {

    var novaSenha = '&235689Ra#311291Jl@' + req.body.senha;
    var passHash = Password.hash(novaSenha, "PASSWORD_BCRYPT");

    Post.Users.update({
        pass: passHash,
    }, {
        where: { id: req.body.id }
    }).then((resposta) => {
        res.status(200).json(resposta);
    }).catch((error) => {
        res.status(500).json(error);
    })

})


module.exports = api;