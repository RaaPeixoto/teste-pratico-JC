const express = require('express');
const session = require('express-session');
const api = express.Router();
const axios = require('axios').default;
const fs = require('fs');
const Post = require('../../models/Post');
const { Op } = require("sequelize");
const SENDGRID_API_KEY = "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"
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);


api.post('/api/email/sent', async(req, res) => {

    var texto = req.body.msg;
    var to = req.body.to;
    var subject = req.body.subject;

    var corpo = `<div style="font-family: sans-serif;position: relative;padding:20px;height:auto;">${texto}</div>`;

    const msg = {
        to: to,
        from: 'contato@pipedone.com',
        subject: subject,
        html: corpo,
    }

    try {
        const result = await sgMail.send(msg);
        console.log('Email sent', result);
        res.status(200).json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }

})

module.exports = api;