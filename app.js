var express = require('express');
var throng = require('throng');

var PORT = process.env.PORT || 3030;
var BLITZ_KEY = process.env.BLITZ_KEY;

var cpus = process.env.WEB_CONCURRENCY || 4;
throng(start, { workers: cpus, lifetime: Infinity });

function start() {
  console.log('Start Worker Process', process.pid);

  var crypto = require('crypto');
  var express = require('express');
  var blitz = require('blitzkrieg');
  var app = express();

  app
    .use(blitz(BLITZ_KEY))
    .get('/cpu', cpuBound)
    .get('/memory', memoryBound)
    .get('/io', ioBound)
    .listen(PORT, onListen);

  function cpuBound(req, res, next) {
    var key = Math.random() < 0.5 ? 'ninjaturtles' : 'powerrangers';
    var hmac = crypto.createHmac('sha512WithRSAEncryption', key);
    var date = Date.now() + '';
    hmac.setEncoding('base64');
    hmac.end(date, function() {
      res.write('A hashed date for you! ' + hmac.read());
      res.write('From:' + process.pid);
      res.end();
    });
  }

  function memoryBound(req, res, next) {
    var hundredk = new Array(100 * 1024).join('X');
    setTimeout(function sendResponse() {
      res.send('Large response: ' + hundredk);
    }, 20).unref();
  }

  function ioBound(req, res, next) {
    setTimeout(function SimulateDb() {
      res.send('Got response from fake db!');
    }, 300).unref();
  }

  function onListen() {
    console.log('Listening on', PORT);
  }

}

