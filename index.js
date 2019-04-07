'use strict';

const config = require('config');
const websocket = require('./libs/websocket');

websocket.connect(
  config.get('marketWsUrl'),
  require('./libs/marketHandler'),
  config.get('marketSubDirects'),
  config.get('marketReqDirects')
);

// websocket.connect(
//   config.get('orderWsUrl'),
//   require('./libs/orderHandler'),
//   config.get('orderSubDirects'),
//   config.get('orderReqDirects')
// );
