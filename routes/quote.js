var express = require('express');
var router = express.Router();

var Promise = require('bluebird');
var getDb = require('../services/db');

router.get('/', function(req, res) {
    return Promise.using(getDb(), function(client) {
        return client.queryAsync({
            name: 'select_quotes',
            text: 'SELECT * FROM quote ORDER BY created LIMIT 50 OFFSET $1',
            values: [req.query.offset || 0]
        }).get('rows').then(function(rows) {
            res.json(rows);
        }).catch(function(err) {
            res.send(500);
        });
    });
});

router.get('/quote/:id', function(req, res) {
    return Promise.using(getDb(), function(client) {
        return client.queryAsync({
            name: 'select_quote',
            text: 'SELECT * FROM quote WHERE id = $1',
            values: [req.params.id]
        }).get('rows').get(0).then(function(row) {
            res.json(row);
        }).catch(function(err) {
            res.send(500);
        });
    });
});

router.get('/quote/add', function(req, res) {
    return Promise.using(getDb(), function(client) {
        return client.queryAsync({
            name: 'add_quote',
            text: 'INSERT INTO quote (created, text) VALUES(now(), $1) RETURNING id',
            values: [req.body.text]
        }).get('rows').get(0).then(function(row) {
            res.redirect('/quote/' + row.id);
        }).catch(function(err) {
            res.send(500);
        });
    });
});

module.exports = router;
