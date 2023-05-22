const express = require('express')
const session = require('express-session')
const api = express.Router()
const axios = require('axios').default
const fs = require('fs')
const Post = require('../../models/Post')
const { Op } = require("sequelize")

api.get(`/api/chats/conversations/:member_id`, async(req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        var sends = await Post.Chats.findAll({
            where: {
                recipient: req.params.member_id,
                sender: user.id,
                status: 'active'
            }
        })

        var receiveds = await Post.Chats.findAll({
            where: {
                recipient: user.id,
                sender: req.params.member_id,
                status: 'active'
            }
        })

        var mensagens = [];

        for (let i = 0; i < receiveds.length; i++) {

            var received = receiveds[i];

            mensagens.push(received);
        }

        for (let i = 0; i < sends.length; i++) {
            var send = sends[i];
            mensagens.push(send);
        }

        // ordenar os elementos:

        mensagens.sort((x, y) => {
            return y.id - x.id;
        })
        res.status(200).json(mensagens);

    } else {
        res.redirect('/login')
    }

})

api.post(`/api/chats/post`, (req, res) => {

    const user = req.session.usuario;

    if (user != undefined) {

        Post.Chats.create({
            organization_id: user.organization_id,
            metadata: req.body.metadata,
            message: req.body.message,
            sender: user.id,
            recipient: req.body.recipient,
            status: 'active',
        }).then((chat) => {
            res.status(200).json(chat)
        }).catch((error) => {
            res.status(500).json(error)
        })

    } else {
        res.redirect('/login')
    }

})

module.exports = api;