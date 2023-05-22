const express = require('express');
const session = require('express-session');
const api = express.Router();
const axios = require('axios').default;
const fs = require('fs');
const Post = require('../../models/Post');
const { Op } = require("sequelize");

api.get(`/api/subscriptions/:organization_id`, (req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {
        Post.Subscriptions.findAll({
            where: {
                organization_id: req.params.organization_id,
                status: 'paid'
            }
        }).then(async(pipes) => {
            res.status(200).json(pipes);
        }).catch((error) => {
            res.status(500).json(error)
        })
    } else {
        res.redirect('/login')
    }
})

api.get(`/api/subscriptions/all/:organization_id`, (req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {
        Post.Subscriptions.findAll({
            where: {
                organization_id: req.params.organization_id
            }
        }).then(async(pipes) => {
            res.status(200).json(pipes);
        }).catch((error) => {
            res.status(500).json(error)
        })
    } else {
        res.redirect('/login')
    }
})

api.get(`/api/subscriptions`, (req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {
        Post.Subscriptions.findAll({
            where: {
                organization_id: user.organization_id,
                status: 'paid'
            }
        }).then(async(pipes) => {
            res.status(200).json(pipes);
        }).catch((error) => {
            res.status(500).json(error)
        })
    } else {
        res.redirect('/login')
    }
})


api.get(`/api/subscription/:id`, (req, res) => {
    var user = req.session.usuario;

    if (user != undefined) {
        Post.Subscriptions.findOne({
            where: {
                id: req.params.id
            }
        }).then(async(pipes) => {
            res.status(200).json(pipes);
        }).catch((error) => {
            res.status(500).json(error);
        })
    } else {
        res.redirect('/login')
    }
})


module.exports = api;