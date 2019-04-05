'use strict';

const config = require('config');
const websocket = require('./libs/websocket');
const handler = require('./libs/handler');

websocket.connect(handler);
