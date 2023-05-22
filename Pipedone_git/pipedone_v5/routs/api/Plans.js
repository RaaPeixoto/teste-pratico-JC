const express = require('express');
const session = require('express-session');
const api = express.Router();
const axios = require('axios').default;
const fs = require('fs');
const Post = require('../../models/Post');
const { Op } = require("sequelize");

api.post(`/api/plano/create`, async(req, res) => {

    Post.Plans.create({
        plan_id: req.body.plan_id,
        metadata: req.body.metadata,
        value: req.body.value,
        status: req.body.status,
    }).then((insertCard) => {
        res.status(200).json(insertCard)
    }).catch((erro) => {
        res.status(500).json(erro)
    })

})

api.get(`/api/plano/:plan_id`, async(req, res) => {

    Post.Plans.findOne({
        where: {
            plan_id: req.params.plan_id,
            status: 'active'
        }
    }).then(async(pipes) => {
        res.status(200).json(pipes);
    }).catch((error) => {
        res.status(500).json(error)
    })

})


module.exports = api;