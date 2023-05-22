const express = require('express')
const session = require('express-session')
const app = require('express')();
const httpServer = require('http').createServer(app);
const https = require('https').createServer(app);

const cors = require('cors');
app.use(cors());

// SOCKET>IO
const { Server } = require("socket.io")
const io = new Server(httpServer);

const path = require('path')
const serveIndex = require('serve-index');
const axios = require('axios').default
const fs = require('fs')
const Post = require('./models/Post')
const { Op } = require("sequelize")

const nodeSchedule = require('node-schedule');

// // Configurações do Handelbars
const hndbrs = require('express-handlebars')
const handlebars = hndbrs.create({
    defaultLayout: 'main',
    extname: '.handlebars'
})

// // Definido o sistema de criptografia
const Password = require("node-php-password");

const bodyParser = require('body-parser')

const favicon = require('serve-favicon')
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// // Diretórios staticos
app.use(express.static(__dirname + '/public/'));
app.use('/js', express.static(__dirname + '/public/js/'))
app.use('/lib', express.static(__dirname + '/public/lib/'))
app.use('/css', express.static(__dirname + '/public/css/'))
app.use('/img', express.static(__dirname + '/public/img/'))
app.use('/fonts', express.static(__dirname + '/public/fonts/'))
app.use('/html', express.static(__dirname + '/public/html/'))
app.use('/webfonts', express.static(__dirname + '/public/webfonts/'))
app.use('/json', express.static(__dirname + '/public/json/'))
app.use('/mp3', express.static(__dirname + '/public/mp3/'))
app.use('/pdf', express.static(__dirname + '/public/pdfs/'))
app.use('/anexos', express.static(__dirname + '/public/anexos/'))

// // Para utilizar a session
app.use(
    session({

        // It holds the secret key for session
        secret: "&235689Ra#311291Jl@",

        // Forces the session to be saved
        // back to the session store
        resave: true,

        // Forces a session that is "uninitialized"
        // to be saved to the store
        saveUninitialized: false,
        cookie: {

            // Session expires after 1 min of inactivity.
            expires: 600000000
        }
    })
);

// // body parser
app.use(bodyParser.json({
    limit: '500mb'
}));

app.use(bodyParser.urlencoded({
    limit: '500mb',
    parameterLimit: 100000,
    extended: true
}));

// // Template engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Rotas
const api = require('./routs/api');
app.use('/', api);

const pages = require('./routs/pages');
app.use('/', pages);

const Clients = require('./routs/api/Clients');
app.use('/', Clients);

const Pipes = require('./routs/api/Pipes');
app.use('/', Pipes);

const List = require('./routs/api/List');
app.use('/', List);

const Steps = require('./routs/api/Steps');
app.use('/', Steps);

const Cards = require('./routs/api/Cards');
app.use('/', Cards);

const Forms = require('./routs/api/Forms');
app.use('/', Forms);

const Pdfs = require('./routs/api/Pdfs');
app.use('/', Pdfs);

const Signatures = require('./routs/api/Signatures');
app.use('/', Signatures);

const Models = require('./routs/api/Models');
app.use('/', Models);

const Photos = require('./routs/api/Photos');
app.use('/', Photos);

const Proposals = require('./routs/api/Proposals');
app.use('/', Proposals);

const Users = require('./routs/api/Users');
app.use('/', Users);

const Chat = require('./routs/api/Chat');
app.use('/', Chat);

const Agendas = require('./routs/api/Agendas');
app.use('/', Agendas);

const Webhooks = require('./routs/api/Webhooks');
app.use('/', Webhooks);

const Analisys = require('./routs/api/Analisys');
app.use('/', Analisys);

const Pagarme = require('./routs/api/Pagarme');
app.use('/', Pagarme);

const Plans = require('./routs/api/Plans');
app.use('/', Plans);

const Subscriptions = require('./routs/api/Subscriptions');
app.use('/', Subscriptions);

const Emails = require('./routs/api/Emails');
const { dirname } = require('path');
app.use('/', Emails);

const Apps = require('./routs/api/Apps');
app.use('/', Apps);

const Hinova = require('./routs/api/Hinova');
app.use('/', Hinova);

const Organizations = require('./routs/api/Organizations');
app.use('/', Organizations);

const Stripe = require('./routs/api/Stripe');
app.use('/', Stripe);

const PublicApi = require('./routs/PublicApi');
app.use('/', PublicApi);

const Notifications = require("./routs/api/Notifications");
app.use("/", Notifications);

app.use('/.well-known', express.static('.well-known'), serveIndex('.well-known'));

app.use((req, res, next) => {
    res.status(404).render('404');
})

const usuarios = [];
io.on("connection", async(socket) => {

    socket.onAny((event, ...args) => {
        console.log(event, args);
    });

    socket.on("logar", async(usuario, callback) => {

        console.log("socket.id");
        console.log(socket.id);
        console.log("Fim socket.id");

        var user = usuarios.filter(item => item.user_id == usuario.user_id)[0];

        if (user == null || user == undefined || user.length == 0) {

            var setUser = {
                user_id: usuario.user_id,
                organization_id: usuario.organization_id,
                socketId: socket.id,
            }

            usuarios.push(setUser);

            io.sockets.emit("refresh_status_users", usuarios);

        } else {
            var getUser = usuarios.find(item => item.user_id == usuario.user_id);
            getUser.socketId = socket.id;

            console.log("getUser.socketId");
            console.log(getUser.socketId);
            console.log("Fim getUser.socketId");
        }

        console.log('logar');
        console.log(socket);
        console.log('=====');

    });

    // socket.on("refresh_page", (apelido, callback) => {
    //     io.sockets.emit("refresh_status_users", Object.keys(usuarios));
    // });

    socket.on("move_card", (card, callback) => {

        io.sockets.emit("refresh_cards", card);

        callback();
    });

    socket.on("disconnect", () => {
        delete usuarios[socket.apelido];
        io.sockets.emit("refresh_status_users", usuarios);
    });

    socket.on("send", (dados, callback) => {

        var mensagem_enviada = dados.msg;
        var usuario = dados.destiny;
        var data = dados.data;
        var sender = dados.sender;

        if (usuario == null)
            usuario = '';

        var msg = {
            mensagem: mensagem_enviada,
            usuario: usuario,
            data: data,
            sender: sender,
        }

        console.log(usuarios);
        if ((usuario in usuarios)) {
            usuarios[usuario].emit("refresh_message", msg);
        } else {
            console.log('Ninguém logado!');
        }

        callback();
    });


    socket.on("sendMensage", (dados, callback) => {

        console.log("texto dados")
        console.log(dados.texto)
        console.log("============")

        console.log("destiny dados")
        console.log(dados.destiny)
        console.log("============")

        console.log("socket dados")
        console.log(socket)
        console.log("============")

        console.log("usuarios dados")
        console.log(usuarios)
        console.log("============")

        var user = usuarios.find(item => item.user_id == dados.destiny);
        console.log("user dados")
        console.log(user)
        console.log("============")

        if (user != null && user != undefined && user.length != 0) {
            // socket.to(`${user.socketId}`).emit("refresh_message", dados);
            io.sockets.emit("refresh_message", dados);
            // io.sockets.to(user.socketId).emit("refresh_message", {
            //     dados: dados,
            //     from: socket.id,
            // });

        } else {
            console.log(dados.destiny + ' não está logado!');
        }

        callback();
    });

    socket.on("newNotification", (notification,callback) => {
        console.log("received refresh_notifications event", notification);
        // Envia a notificação para o usuário correto
        console.log("notificação, app",notification)
        io.sockets.emit("refresh_notifications", notification);
    });

    // socket.on("send_notification", (dados, callback) => {

    //     var usuario = dados.user_id;
    //     var msg = dados;

    //     console.log(usuarios);
    //     if ((usuario in usuarios)) {
    //         usuarios[usuario].emit("notify", msg);
    //     } else {
    //         console.log('Ninguém logado!');
    //     }

    //     callback();
    // });

    // socket.on("send_not_proposta_aceita", (dados, callback) => {

    //     var usuario = dados.creator_id;
    //     var msg = dados;

    //     console.log(usuarios);
    //     if ((usuario in usuarios)) {
    //         usuarios[usuario].emit("proposta_aceita_refresh", msg);
    //     } else {
    //         console.log('Ninguém logado!');
    //     }

    //     callback();
    // });

    // socket.on("send_fotos_registradas_refresh", (dados, callback) => {

    //     var usuario = dados.creator_id;
    //     var msg = dados;

    //     console.log(usuarios);
    //     if ((usuario in usuarios)) {
    //         usuarios[usuario].emit("fotos_registradas_refresh", msg);
    //     } else {
    //         console.log('Ninguém logado!');
    //     }

    //     callback();
    // });
    // socket.on("send_documento_assinado_refresh", (dados, callback) => {

    //     var usuario = dados.creator_id;
    //     var msg = dados;

    //     console.log(usuarios);
    //     if ((usuario in usuarios)) {
    //         usuarios[usuario].emit("documento_assinado_refresh", msg);
    //     } else {
    //         console.log('Ninguém logado!');
    //     }

    //     callback();
    // });

});

api.get(`/usuarios-online/:organization_id`, (req, res) => {
    var lista = [];

    for (var user of usuarios) {
        var the = {
            user_id: user.user_id,
            organization_id: user.organization_id,
        }

        if (the.organization_id == req.params.organization_id) {
            lista.push(the);
        }
    }

    res.status(200).json(lista)
})

api.get(`/usuarios-online`, (req, res) => {
    res.status(200).json(usuarios)
})


api.post(`/api/agendas/create-note`, (req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {
        Post.Agendas.create({
            organization_id: user.organization_id,
            user_id: user.id,
            note: req.body.note,
            date: req.body.date,
            time: req.body.time,
            status: 'pending',
        }).then((note) => {

            process.env.TZ = "America/Fortaleza";
            var data = new Date(req.body.date + ' ' + req.body.time);
            var ano = data.getFullYear();
            var mes = data.getMonth();
            var dia = data.getDate();
            var hora = data.getHours();
            var minutes = data.getMinutes();

            var dt = new Date(ano, mes, dia, hora, minutes);

            var obj = {
                id: note.id,
                note: req.body.note,
                date: req.body.date,
                time: req.body.time,
            }

            var job = nodeSchedule.scheduleJob(dt, () => {

                if ((user.id in usuarios)) {
                    usuarios[user.id].emit("notify", obj);
                } else {
                    console.log('Ninguém logado!');
                }

            });

            console.log(job.nextInvocation());
            console.log(nodeSchedule.scheduledJobs)
            res.status(200).json(note)

        }).catch((error) => {
            res.status(500).json(error)
        })
    } else {
        res.redirect('/login')
    }

})

api.put(`/api/agendas/update`, (req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        Post.Agendas.update({
            note: req.body.note,
            date: req.body.date,
            time: req.body.time,
        }, {
            where: { id: req.body.id }
        }).then((agendas) => {

            process.env.TZ = "America/Fortaleza";
            var data = new Date(req.body.date + ' ' + req.body.time);
            var ano = data.getFullYear();
            var mes = data.getMonth();
            var dia = data.getDate();
            var hora = data.getHours();
            var minutes = data.getMinutes();

            var dt = new Date(ano, mes, dia, hora, minutes);

            var obj = {
                id: agendas.id,
                note: req.body.note,
                date: req.body.date,
                time: req.body.time,
            }

            var job = nodeSchedule.scheduleJob(dt, () => {

                if ((user.id in usuarios)) {
                    usuarios[user.id].emit("notify", obj);
                } else {
                    console.log('Ninguém logado!');
                }

            });

            console.log(job.nextInvocation());

            console.log(nodeSchedule.scheduledJobs)

            res.status(200).json(agendas);
        }).catch((error) => {
            res.status(500).json(error);
            console.log(error)
        })

    } else {
        res.redirect('/login')
    }

})

api.put(`/api/agendas/update/status`, (req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        Post.Agendas.update({
            status: req.body.status
        }, {
            where: { id: req.body.id }
        }).then((agendas) => {
            res.status(200).json(agendas);
        }).catch((error) => {
            res.status(500).json(error);
            console.log(error)
        })

    } else {
        res.redirect('/login')
    }

})

api.get('/testes', async(req, res) => {

    Post.Subscriptions.findAll({
        where: {
            organization_id: 1,
            status: 'paid'
        }
    }).then((sucess) => {
        var teste = {
            status: 200,
            dados: sucess
        };

        res.json(teste);
    }).catch((error) => {
        var teste = {
            status: 500,
            dados: error
        };

        res.json(teste);
    })


})

// Add headers before the routes are defined
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

httpServer.listen(3000, () => {
    console.log('Servidor rodando...')
})