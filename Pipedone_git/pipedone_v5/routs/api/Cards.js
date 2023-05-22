process.env.TZ = "America/Fortaleza";
const express = require('express')
const session = require('express-session')
const api = express.Router()
const axios = require('axios').default
const fs = require('fs')
const Post = require('../../models/Post')
const { Op } = require("sequelize")

api.post(`/api/card/create`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.cards && user.permissions.cards.includes('criar')) {
            Post.Cards.create({
                organization_id: user.organization_id,
                pipe_id: req.body.pipe_id,
                step_id: req.body.step_id,
                list_id: req.body.list_id,
                item_id: req.body.item_id,
                client_id: '',
                responsible_id: '',
                creator_id: user.id,
                metadata: JSON.stringify(req.body.meta),
                status: 'active'
            }).then((insertCard) => {
                res.status(200).json(insertCard)
            }).catch((erro) => {
                res.status(500).json(erro)
            })
        } else {
            res.status(201).json('Você não tem permissão para criar cards.')
        }

    } else {
        res.redirect('login')
    }

})


api.post(`/api/card/public/create`, async(req, res) => {

    Post.Cards.create({
        organization_id: req.body.organization_id,
        pipe_id: req.body.pipe_id,
        step_id: req.body.step_id,
        client_id: '',
        responsible_id: '',
        creator_id: "",
        metadata: JSON.stringify(req.body.meta),
        status: 'active'
    }).then((insertCard) => {
        res.status(200).json(insertCard)
    }).catch((erro) => {
        res.status(500).json(erro)
    })


})

api.get(`/api/card/buscar/:title`, (req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        var title = req.params.title;

        Post.Cards.findAll({
            where: {
                status: 'active',
                organization_id: user.organization_id,
                metadata: {
                    [Op.like]: `%${title}%`
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


api.get(`/api/card/listar/:pipe_id`, (req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        Post.Cards.findAll({
            where: {
                pipe_id: req.params.pipe_id,
                status: 'active'
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

api.get(`/api/card/listar/:pipe_id/:inicio/:fim`, (req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        Post.Cards.findAll({
            where: {
                pipe_id: req.params.pipe_id,
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

api.get(`/api/card/listar-of-step/:step_id`, (req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        Post.Cards.findAll({
            where: {
                step_id: req.params.step_id,
                status: 'active'
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

api.get(`/api/card/listar-of-list/:list_id`, (req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        Post.Cards.findAll({
            where: {
                list_id: req.params.list_id,
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

api.get('/api/card/:card_id', async (req, res) => {
    try {
        const { card_id } = req.params;
        const { usuario: user } = req.session;
        
        if (!user) {
            return res.redirect('/login');
        }

        const hasPermission = user.type === 'master' || 
                              user.permissions.cards?.includes('visualizar');

        if (!hasPermission) {
            return res.sendStatus(403);
        }

        const card = await Post.Cards.findOne({
            where: { id: card_id }
        });

        if (!card) {
            return res.sendStatus(404);
        }

        const pipe = await Post.Pipes.findOne({
            where: {
                id: card.pipe_id,
                users: { [Op.like]: `%${user.id}%` }
            }
        });

        if (!pipe) {
            return res.sendStatus(403);
        }

        res.status(200).json(card);
    } catch (error) {
        res.status(500).json(error);
    }
});

api.get(`/api/card/public/:card_id`, (req, res) => {

    Post.Cards.findOne({
        where: {
            id: req.params.card_id
        }
    }).then((cards) => {
        res.status(200).json(cards)
    }).catch((error) => {
        res.status(500).json(error)
    })


})

api.put(`/api/card/update/step`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.cards && user.permissions.cards.includes('editar')) {

            var meta = await Post.Cards.findOne({
                where: { id: req.body.id }
            })

            var metadata = JSON.parse(meta.metadata)

            if (!metadata.history.drops) {
                metadata.history['drops'] = [];
            }

            metadata.history.drops.push(req.body.step_id)

            Post.Cards.update({
                step_id: req.body.step_id,
                metadata: JSON.stringify(metadata)
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).send(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })
        } else {
            res.status(201).json('Você não tem permissão para editar cards.')
        }

    } else {
        res.redirect('/login')
    }

})

api.put(`/api/card/update/step/pipe`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.cards && user.permissions.cards.includes('mover')) {

            var meta = await Post.Cards.findOne({
                where: { id: req.body.id }
            })

            var metadata = JSON.parse(meta.metadata)

            metadata.history.drops.push(req.body.step_id)

            Post.Cards.update({
                step_id: req.body.step_id,
                pipe_id: req.body.pipe_id,
                metadata: JSON.stringify(metadata)
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).send(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            })

        } else {
            res.status(201).json('Você não tem permissão para editar cards.')
        }

    } else {
        res.redirect('/login')
    }

})

api.put(`/api/public/card/update/step/pipe`, async(req, res) => {


    var meta = await Post.Cards.findOne({
        where: { id: req.body.id }
    })

    var metadata = JSON.parse(meta.metadata)

    metadata.history.drops.push(req.body.step_id)

    Post.Cards.update({
        step_id: req.body.step_id,
        pipe_id: req.body.pipe_id,
        metadata: JSON.stringify(metadata)
    }, {
        where: { id: req.body.id }
    }).then((resposta) => {
        res.status(200).send(resposta);
    }).catch((error) => {
        res.status(500).json(error);
    })


})

api.put(`/api/card/update/item_id`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.cards && user.permissions.cards.includes('editar')) {

            Post.Cards.update({
                item_id: req.body.item_id
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            });

        } else {

            res.status(201).json('Você não tem permissão para editar cards.');

        }

    } else {
        res.redirect('/login')
    }

})

api.put(`/api/card/update/metadata`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.cards && user.permissions.cards.includes('editar')) {

            Post.Cards.update({
                metadata: JSON.stringify(req.body.metadata)
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            });

        } else {

            res.status(201).json('Você não tem permissão para editar cards.');

        }

    } else {
        res.redirect('/login')
    }

})


api.put(`/api/public/card/update/metadata`, async(req, res) => {

    Post.Cards.update({
        metadata: JSON.stringify(req.body.metadata)
    }, {
        where: { id: req.body.id }
    }).then((resposta) => {
        res.status(200).json(resposta);
    }).catch((error) => {
        res.status(500).json(error);
    });

})

api.put(`/api/card/update/deadline`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.cards && user.permissions.cards.includes('editar')) {

            Post.Cards.update({
                deadline: req.body.deadline,
                metadata: JSON.stringify(req.body.metadata),
            }, {
                where: { id: req.body.id }
            }).then((resposta) => {
                res.status(200).json(resposta);
            }).catch((error) => {
                res.status(500).json(error);
            });

        } else {

            res.status(201).json('Você não tem permissão para editar cards.');

        }


    } else {
        res.redirect('/login')
    }

})

api.put(`/api/card/update/metadata/anexo`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.cards && user.permissions.cards.includes('editar')) {

            var anexo = req.body.anexo;
            var base64 = req.body.base64;
            var card_id = req.body.card_id;
            var meta = req.body.meta;

            let rawdata = base64;
            let matches = rawdata.match(/^data:([A-Za-z-+\/.]+);base64,(.+)$/);
            let buffer = new Buffer.from(matches[2], 'base64');
            let filename = anexo.id + '.' + anexo.format;
            anexo.filename = filename;

            fs.writeFile(`public/anexos/` + filename, buffer, function(err) {
                if (err) return next(err);

                meta.anexos.push(anexo);

                Post.Cards.update({
                    metadata: JSON.stringify(meta)
                }, {
                    where: { id: card_id }
                }).then((resposta) => {
                    res.status(200).json(resposta);
                }).catch((error) => {
                    res.status(500).json(error);
                })
            })


        } else {

            res.status(201).json('Você não tem permissão para editar cards.');

        }

    } else {
        res.redirect('/login')
    }

})

api.put(`/api/card/delete/metadata/anexo`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.cards && user.permissions.cards.includes('excluir')) {

            var filename = req.body.filename;
            var card_id = req.body.card_id;
            var meta = req.body.meta;

            try {

                await fs.unlinkSync(`./public/anexos/${filename}`);

                Post.Cards.update({
                    metadata: JSON.stringify(meta)
                }, {
                    where: { id: card_id }
                }).then((resposta) => {
                    res.status(200).json(resposta);
                }).catch((error) => {
                    res.status(500).json(error);
                })

            } catch (error) {
                console.log('Erro na linha 143: ' + error.message);
            }

        } else {
            res.status(201).json('Você não tem permissão para editar cards.');
        }

    } else {
        res.redirect('/login')
    }

})

api.get(`/api/card/count/:pipe_id`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        Post.Cards.count({
            where: {
                pipe_id: req.params.pipe_id,
                status: `active`,
                step_id: {
                    [Op.notLike]: 0
                }
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

api.get(`/api/card/arquivo/:pipe_id/:page`, async(req, res) => {

    var user = req.session.usuario;

    if (user != undefined) {

        if (user.type == 'master' || user.permissions.cards && user.permissions.cards.includes('visualizar')) {

            var page = (parseInt(req.params.page) - 1) * 50;

            Post.Cards.findAndCountAll({
                limit: 50,
                offset: page,
                where: {
                    pipe_id: req.params.pipe_id,
                    status: {
                        [Op.like]: `active`
                    },
                    step_id: 0
                }
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

module.exports = api;