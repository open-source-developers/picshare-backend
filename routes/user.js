const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const _ = require('lodash');

router.get('', (req, res, next) => {
  const limit = req.query.limit ? Number.parseInt(req.query.limit) : 20;
  const offset = req.query.offset ? Number.parseInt(req.query.offset) : 0;
  User.getAll(limit, offset, (err, data) => {
    const arr = data.map(user => {
      return _.omit(JSON.parse(JSON.stringify(user)), ['password', '__v']);
    });
    res.status(200).send(arr);
  });
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  User.getUserById(id, (err, data) => {
    if (err) {
      return res.status(404).send({ success: false, msg: 'Failed to find user with id: ' + id });
    } else {
      const obj = _.omit(JSON.parse(JSON.stringify(data)), ['password', '__v']);
      return res.status(200).send({ success: true, user: data });
    }
  });
});

module.exports = router;
