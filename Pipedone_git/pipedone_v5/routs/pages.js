const express = require('express')
const session = require('express-session')
const pages = express.Router()
const app = require('express')();
const axios = require('axios').default;
const Password = require('node-php-password')
const bodyParser = require('body-parser')
const Post = require('../models/Post')
const { Op } = require("sequelize");

const http = require('http').Server(app);
const io = require('socket.io')(http);

pages.get('/', async(req, res, next) => {

    res.render('pagina_inicial');

})

pages.get('/pipes', async(req, res, next) => {

    let oauth = req.session.usuario;

    if (oauth != undefined) {

        var subscription = await Post.Subscriptions.findAll({
            where: {
                organization_id: oauth.organization_id,
                status: 'paid'
            }
        })

        if (subscription.length > 0) {

            var hoje = new Date(new Date().toISOString().split('T')[0]);
            let data = new Date(subscription[subscription.length - 1].dataValues.createdAt.toISOString().split('T')[0]);
            let dataSomada = data.setDate(data.getDate() + subscription[subscription.length - 1].period);
            let vencimento = new Date(dataSomada);

            if (vencimento >= hoje) {
                res.render('home');
            } else {
                res.redirect('planos');
            }

        } else {
            res.redirect('planos');
        }

    } else {
        res.redirect('sair');
    }

})


pages.get('/lists', async(req, res, next) => {

    let oauth = req.session.usuario;

    if (oauth != undefined) {

        var subscription = await Post.Subscriptions.findAll({
            where: {
                organization_id: oauth.organization_id,
                status: 'paid'
            }
        })

        if (subscription.length > 0) {

            var hoje = new Date(new Date().toISOString().split('T')[0]);
            let data = new Date(subscription[subscription.length - 1].dataValues.createdAt.toISOString().split('T')[0]);
            let dataSomada = data.setDate(data.getDate() + subscription[subscription.length - 1].period);
            let vencimento = new Date(dataSomada);

            if (vencimento >= hoje) {
                res.render('lists');
            } else {
                res.redirect('planos');
            }

        } else {
            res.redirect('planos');
        }

    } else {
        req.session.destroy();
        res.render('pagina_vendas');
    }

})


pages.get('/times', async(req, res) => {

    let oauth = req.session.usuario;

    if (oauth != undefined) {

        try {
            var subscription = await Post.Subscriptions.findAll({
                where: {
                    organization_id: oauth.organization_id,
                    status: 'paid'
                }
            })

        } catch {
            var subscription = 0;
        }

        if (subscription.length > 0) {

            var hoje = new Date(new Date().toISOString().split('T')[0]);
            let data = new Date(subscription[subscription.length - 1].dataValues.createdAt.toISOString().split('T')[0]);
            let dataSomada = data.setDate(data.getDate() + subscription[subscription.length - 1].period);
            let vencimento = new Date(dataSomada);
            if (vencimento > hoje) {

                if (oauth.type == 'master' || oauth.permissions.times.includes('visualizar')) {
                    res.render('times');
                } else {
                    res.redirect('/acesso_negado');
                }

            } else {
                res.redirect('planos');
            }

        } else {
            res.redirect('planos');
        }


    } else {
        req.session.destroy();
        res.redirect('/login');
    }

})
pages.get('/pagamentos', async(req, res) => {

    let oauth = req.session.usuario;

    if (oauth != undefined) {

        try {
            var subscription = await Post.Subscriptions.findAll({
                where: {
                    organization_id: oauth.organization_id,
                    status: 'paid'
                }
            })

        } catch {
            var subscription = 0;
        }

        if (subscription.length > 0) {

            var hoje = new Date(new Date().toISOString().split('T')[0]);
            let data = new Date(subscription[subscription.length - 1].dataValues.createdAt.toISOString().split('T')[0]);
            let dataSomada = data.setDate(data.getDate() + subscription[subscription.length - 1].period);
            let vencimento = new Date(dataSomada);

            if (vencimento > hoje) {


                if (oauth.type == 'master' || oauth.permissions.pagamentos.includes('visualizar')) {
                    res.render('pagamentos');
                } else {
                    res.redirect('/acesso_negado');
                }
            } else {

                res.redirect('planos');
            }

        } else {
            res.redirect('planos');
        }

    } else {
        req.session.destroy();
        res.redirect('/login');
    }

})

pages.get('/aceite-digital/:base64', async(req, res) => {

    function b64_to_utf8(str) {
        return atob(str);
    }

    var code = b64_to_utf8(req.params.base64);
    var dados = code.split('/');

    var sign = await Post.Signatures.findOne({
        where: {
            id: dados[0]
        }
    })

    res.render('selfsign', {
        doc: sign.id,
        email: dados[1]
    });

})

pages.get('/down-pdf/:arquivo', function(req, res) {
    const file = `./public/pdfs/${req.params.arquivo}`;
    res.download(file);
});

pages.get('/termos-de-uso', async(req, res) => {

    res.render('termos');

})

pages.get('/agendamento', async(req, res) => {

    res.render('calendly');

})

pages.get('/painel', async(req, res) => {

    res.render('painel');

})

pages.get('/planos', async(req, res) => {

    let oauth = req.session.usuario;

    if (oauth != undefined) {

        res.render('planos', {
            user: JSON.stringify(oauth)
        });

    } else {
        req.session.destroy();
        res.redirect('/login');
    }

})

pages.get('/pipe/:pipe_id', async(req, res) => {

    let oauth = req.session.usuario;

    if (oauth != undefined) {
        // RENDERIZA AQUI SE ESTIVER LOGADO!

        try {

            var subscription = await Post.Subscriptions.findAll({
                where: {
                    organization_id: oauth.organization_id,
                    status: 'paid'
                }
            })

        } catch {
            var subscription = 0;
        }

        if (subscription.length > 0) {

            var hoje = new Date(new Date().toISOString().split('T')[0]);

            let data = new Date(subscription[subscription.length - 1].dataValues.createdAt.toISOString().split('T')[0]);
            let dataSomada = data.setDate(data.getDate() + subscription[subscription.length - 1].period);
            let vencimento = new Date(dataSomada);

            if (vencimento > hoje) {

                if (oauth.type == 'master' || oauth.permissions.pipes.includes('visualizar')) {

                    try {

                        var getPipe = await Post.Pipes.findOne({
                            where: {
                                id: req.params.pipe_id,
                                status: 'active',
                                organization_id: oauth.organization_id,
                                users: {
                                    [Op.like]: `%${oauth.id}%`
                                },
                            }
                        });

                        if (getPipe) {
                            res.render('pipe', { pipe: JSON.stringify(getPipe) });
                        } else {
                            res.redirect('/acesso_negado');
                        };

                    } catch (error) {
                        res.redirect('/acesso_negado');
                    }

                } else {
                    res.redirect('/acesso_negado');
                }

            } else {
                res.redirect('/planos');
            }

        } else {
            res.redirect('/planos');
        }

    } else {
        req.session.destroy();
        res.redirect('/login');
    }

})

pages.get('/teste-api', (req, res) => {
    res.render('teste');
})

pages.get('/pipe/:pipe_id/card/:card_id', async(req, res) => {

    let oauth = req.session.usuario;

    if (oauth != undefined) {
        // RENDERIZA AQUI SE ESTIVER LOGADO!

        var subscription = await Post.Subscriptions.findAll({
            where: {
                organization_id: oauth.organization_id,
                status: 'paid'
            }
        })

        if (subscription.length > 0) {

            var hoje = new Date(new Date().toISOString().split('T')[0]);
            let data = new Date(subscription[subscription.length - 1].dataValues.createdAt.toISOString().split('T')[0]);
            let dataSomada = data.setDate(data.getDate() + subscription[subscription.length - 1].period);
            let vencimento = new Date(dataSomada);

            if (vencimento > hoje) {

                if (oauth.type == 'master' || oauth.permissions.cards.includes('visualizar')) {

                    Post.Pipes.findOne({
                        where: {
                            id: req.params.pipe_id,
                            status: 'active',
                            organization_id: oauth.organization_id,
                            users: {
                                [Op.like]: `%${oauth.id}%`
                            },
                        }
                    }).then((pipes) => {
                        res.render('pipe', { pipe: JSON.stringify(pipes), card_id: req.params.card_id });
                    }).catch((error) => {
                        res.status(500).json(error)
                    })

                } else {
                    res.redirect('/acesso_negado');
                }
            } else {
                res.redirect('/planos');
            }
        } else {
            res.redirect('/planos');
        }


    } else {
        req.session.destroy();
        res.redirect('/login');
    }

})

pages.get('/list/:list_id', async(req, res) => {

    let oauth = req.session.usuario;

    if (oauth != undefined) {

        Post.Lists.findOne({
            where: {
                id: req.params.list_id,
                status: 'active'
            }
        }).then((list) => {
            res.render('list', { list: JSON.stringify(list) });
        }).catch((error) => {
            res.status(500).json(error)
        })

    } else {
        req.session.destroy();
        res.redirect('/login');
    }

})

pages.get('/workchat', async(req, res) => {

    let oauth = req.session.usuario;

    if (oauth != undefined) {

        res.render('workchat');

    } else {
        req.session.destroy();
        res.redirect('/login');
    }

})


pages.get('/account', async(req, res) => {

    let oauth = req.session.usuario;

    if (oauth != undefined) {

        var user = await Post.Users.findOne({
            where: {
                id: oauth.id
            }
        })

        var org = await Post.Organizations.findOne({
            where: {
                id: oauth.organization_id
            }
        })

        var usuario = {
            id: user.id,
            nome: user.name,
            email: user.email,
            telefone: user.phone,
            cpf: user.cpf,
            org: user.organization_id,
            type: user.type,
            status: user.status,
        }

        var empresa = {
            id: org.id,
            nome: org.name,
            status: org.status,
        }

        var metaOrg = org.metadata;

        res.render('count', {
            user: JSON.stringify(usuario),
            meta: JSON.stringify(oauth.metadata),
            org: JSON.stringify(empresa),
            metaOrg: JSON.stringify(metaOrg),
        });

    } else {
        req.session.destroy();
        res.redirect('/login');
    }

})

pages.get('/form/:pipe_id', async(req, res) => {

    var pipe_id = atob(req.params.pipe_id);

    var pipe = await Post.Pipes.findOne({
        where: {
            id: pipe_id,
            status: 'active'
        }
    })

    res.render('form', {
        form: JSON.stringify(pipe)
    });

})


pages.get('/fatura/:subs_id', async(req, res) => {

    var subs = await Post.Subscriptions.findOne({
        where: {
            id: req.params.subs_id
        }
    });

    res.render('fatura', {
        subs: JSON.stringify(subs)
    });

})


pages.get('/auditor', async(req, res) => {

    res.redirect('./');

})

pages.get('/auditor/:sign_id', async(req, res) => {

    var sign_id = req.params.sign_id;

    Post.Signatures.findOne({
        where: {
            id: sign_id
        }
    }).then((signature) => {
        res.render('auditor', {
            meta: JSON.stringify(signature.metadata),
            signers: JSON.stringify(signature.signers),
            doc: JSON.stringify(signature.document)
        });
    }).catch((error) => {
        res.status(500).json(error)
    })


})

pages.get('/form/:pipe_id/:rastreador', async(req, res) => {

    var pipe_id = atob(req.params.pipe_id);
    var rastreador = req.params.rastreador;

    var pipe = await Post.Pipes.findOne({
        where: {
            id: pipe_id,
            status: 'active'
        }
    })

    res.render('form', {
        form: JSON.stringify(pipe),
        rastreador: rastreador
    });

})

pages.get('/registro-de-foto/:photo_id', async(req, res) => {

    Post.Photos.findOne({
        where: {
            id: req.params.photo_id,
            status: 'active'
        }
    }).then((list) => {
        res.render('registro-de-foto', { meta: JSON.stringify(list) });
    }).catch((error) => {
        res.status(500).json(error)
    })

})

pages.get('/proposta/:proposals_id', async(req, res) => {

    var id = atob(req.params.proposals_id);

    Post.Proposals.findOne({
        where: {
            id: id
        }
    }).then((list) => {
        res.render('propostas', { meta: JSON.stringify(list) });
    }).catch((error) => {
        res.status(500).json(error)
    })

})

pages.get('/login', async(req, res) => {

    let oauth = req.session.usuario;

    if (oauth != undefined) {
        res.redirect('/pipes');
    } else {
        res.render('login')
    }

})

pages.get('/recovery', async(req, res) => {

    res.render('recovery')

})

pages.get('/new-pass/:code', async(req, res) => {

    res.render('new-pass', { user_id: req.params.code })

})

pages.get('/register', async(req, res) => {

    let oauth = req.session.usuario;

    if (oauth != undefined) {
        res.redirect('/');
    } else {
        res.render('register')
    }

})

pages.get('/sair', async(req, res) => {

    req.session.destroy();

    res.redirect('/login');

})

pages.get('/acesso_negado', async(req, res) => {

    res.render('acesso_negado')

})

pages.get('/obrigado-pelo-pagamento', async(req, res) => {

    req.session.destroy();
    res.render('obrigado-pelo-pagamento');

})

pages.get('/bem-vindo', async(req, res) => {

    req.session.destroy();
    res.render('bem-vindo');

})

module.exports = pages;