const express = require('express');
const session = require('express-session');
const api = express.Router();
const axios = require('axios').default;
const fs = require('fs');
const Post = require('../../models/Post');
const { Op } = require("sequelize");



module.exports = api;