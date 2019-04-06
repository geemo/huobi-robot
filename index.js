'use strict';

const config = require('config');
const websocket = require('./libs/websocket');
const handler = require('./libs/handler');

const wsMarketUrlPrefix = config.get('wsMarketUrlPrefix');
const wsOrderUrlPrefix = config.get('wsOrderUrlPrefix');

websocket.connect(wsMarketUrlPrefix, handler);
// websocket.connect(wsOrderUrlPrefix, handler);
