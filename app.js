var express = require('express');
var throng = require('throng');

var port = process.env.PORT || 3030;
var cpus = process.env.WEB_CONCURRENCY || 1;
throng(start, { workers: cpus, lifetime: Infinity });

function start() {
  console.log('Started worker');
  process.on('SIGTERM', function() {
     console.log('Worker exiting');
     process.exit();
  });
}

