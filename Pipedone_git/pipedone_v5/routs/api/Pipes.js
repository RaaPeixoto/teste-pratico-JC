process.env.TZ = "America/Fortaleza";
const express = require('express')
const session = require('express-session')
const api = express.Router()
const axios = require('axios').default
const fs = require('fs')
const Post = require('../../models/Post')
const { Op } = require("sequelize");

api.post(`/api/pipe/clonar`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.pipes && user.permissions.pipes.includes('criar')) {

            const pipe = req.body.pipe;
            const steps = pipe.steps;

            var insertPipe = await Post.Pipes.create({
                organization_id: user.organization_id,
                creator_id: user.id,
                list_id: "",
                type: "task",
                conections: pipe.conections,
                title: pipe.title,
                users: `[${user.id}]`,
                metadata: {
                    form: pipe.metadata.form,
                    powerups: [],
                    tags: pipe.metadata.tags
                },
                image: pipe.icon,
                color: pipe.color,
                status: "active"
            })

            var erros = 0;

            for (let i = 0; i < steps.length; i++) {

                const step = steps[i];

                Post.Steps.create({
                    title: step.title,
                    position: step.position,
                    organization_id: user.organization_id,
                    pipe_id: insertPipe.id,
                    color: step.color,
                    metadata: step.metadata,
                    status: "active",
                }).then((res) => {

                }).catch((error) => {
                    console.log(error);
                    erros++;
                })

            }

            if (erros == 0) {
                res.status(200).json(insertPipe.id);
            } else {
                res.status(203).json('Erro ao clonar este pipe.');
            }


        } else {

            res.status(201).json('Você não tem permissão para criar pipes.');

        }


    } else {
        res.redirect('/login')
    }

})

api.post(`/api/pipe/clone`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.pipes && user.permissions.pipes.includes('criar')) {

            const pipe = req.body.pipe;
            const steps = pipe.steps;

            var insertPipe = await Post.Pipes.create({
                organization_id: user.organization_id,
                creator_id: user.id,
                list_id: "",
                type: "task",
                conections: [],
                title: pipe.title,
                users: `[${user.id}]`,
                metadata: {
                    form: [],
                    powerups: [],
                    tags: []
                },
                image: pipe.icon,
                color: pipe.color,
                status: "active"
            })

            var erros = 0;

            for (let i = 0; i < steps.length; i++) {

                const step = steps[i];

                Post.Steps.create({
                    title: step.title,
                    position: i,
                    organization_id: user.organization_id,
                    pipe_id: insertPipe.id,
                    color: step.color,
                    metadata: step.metadata,
                    status: "active",
                }).then().catch((error) => {
                    console.log(error);
                    erros++;
                })

            }

            if (erros == 0) {
                res.status(200).json(insertPipe.id);
            } else {
                res.status(203).json('Erro ao clonar este pipe.');
            }


        } else {

            res.status(201).json('Você não tem permissão para criar pipes.');

        }


    } else {
        res.redirect('/login')
    }

})

api.put(`/api/pipe/update/metadata`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.pipes && user.permissions.pipes.includes('editar')) {

            Post.Pipes.update({
                metadata: req.body.metadata
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para editar Pipes.');

        }

    } else {
        res.redirect('/login')
    }

})

api.get(`/api/pipe/listar`, async(req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.pipes && user.permissions.pipes.includes('visualizar')) {

            Post.Pipes.findAll({
                where: {
                    organization_id: user.organization_id,
                    status: 'active'
                }
            }).then(async(pipes) => {

                var filterPipes = pipes.filter(item => item.users.includes(user.id));
                res.status(200).json(filterPipes);
            }).catch((error) => {
                console.log("ERROOOO",error)
                res.status(500).json(error)
            })

        } else {

            res.status(201).json('Você não tem permissão para visualizar Pipes.');

        }

    } else {
        res.redirect('/login')
    }

})

api.get(`/api/pipe/count-cards/:step_id`, async(req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {
        const amount = await Post.Cards.count({
            where: {
                step_id: req.params.step_id,
                status: 'active'
            }
        });

        res.status(200).json(amount);

    } else {
        res.redirect('/login')
    }

})

api.get(`/api/pipes/count`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        Post.Pipes.count({
            where: {
                organization_id: user.organization_id,
                status: 'active'
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

api.put(`/api/pipe/excluir`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.pipes && user.permissions.pipes.includes('excluir')) {

            Post.Pipes.update({
                status: "deleted"
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para editar Pipes.');

        }

    } else {
        res.redirect('/login')
    }
})

api.put(`/api/pipe/update`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.pipes && user.permissions.pipes.includes('editar')) {

            Post.Pipes.update({
                list_id: "",
                title: pipe.title,
                users: `[${user.id}]`,
                image: pipe.icon,
                color: pipe.color,
                status: "active"
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para editar Pipes.');

        }

    } else {
        res.redirect('/login')
    }
})

api.put(`/api/pipe/update/title`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.pipes && user.permissions.pipes.includes('editar')) {

            Post.Pipes.update({
                title: req.body.title,
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para editar Pipes.');

        }

    } else {
        res.redirect('/login')
    }
})

api.put(`/api/pipe/update/conections`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.pipes && user.permissions.pipes.includes('editar')) {

            Post.Pipes.update({
                conections: req.body.conections,
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para editar Pipes.');

        }


    } else {
        res.redirect('/login')
    }
})

api.put(`/api/pipe/update/users`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.pipes && user.permissions.pipes.includes('editar')) {

            Post.Pipes.update({
                users: req.body.users,
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para editar Pipes.');

        }

    } else {
        res.redirect('/login')
    }
})

api.put(`/api/pipe/update/list`, async(req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.pipes && user.permissions.pipes.includes('editar')) {

            Post.Pipes.update({
                list_id: req.body.list_id,
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {

            res.status(201).json('Você não tem permissão para editar Pipes.');

        }

    } else {
        res.redirect('/login')
    }
})


api.get('/pipe/view/:pipe_id', async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.pipes && user.permissions.pipes.includes('visualizar')) {

            Post.Pipes.findOne({
                where: {
                    id: req.params.pipe_id,
                    status: `active`
                }
            }).then((pipes) => {
                res.status(200).json(pipes);
            }).catch((error) => {
                res.status(500).json(error)
            })

        } else {

            res.status(201).json('Você não tem permissão para visualizar Pipes.');

        }

    } else {
        res.redirect('/login')
    }

})

api.get('/api/pipe/:pipe_id', async(req, res) => {

    Post.Pipes.findOne({
        where: {
            id: req.params.pipe_id,
            status:"active"
        }
    }).then((pipes) => {
        res.status(200).json(pipes);
    }).catch((error) => {
        res.status(500).json(error)
    })

})


api.get('/api/pipe/count/:pipe_id', async(req, res) => {

    Post.Pipes.count({
        where: {
            id: req.params.pipe_id,
            status:"active"
        }
    }).then((pipes) => {
        res.status(200).json(pipes);
    }).catch((error) => {
        res.status(500).json(error)
    })

})

module.exports = api;