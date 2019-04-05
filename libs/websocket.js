'use strict';

const WebSocket = require('ws');
const config = require('config');
const zlib = require('zlib');
const logger = require('./logger');
const { sleep } = require('./util');
const methods = require('../consts/method');

const wsUrl = config.get('wsUrlPrefix');

function connect(handler) {
  let ws = new WebSocket(wsUrl);
  ws.on('open', () => {
    logger.info(`connect ${wsUrl} success!`);

    const sub = config.get('sub') || [];
    for (let method of sub) {
      ws.send();
    }
  }).on('close', async () => {
    logger.error(`ws connection close`);
    await sleep(5000);
    connect();
  }).on('message', data => {
    try {
      let text = zlib.gunzipSync(data).toString();
      let resObj = JSON.parse(text);
      if (resObj.ping) {
        ws.send(JSON.stringify({ pong: resObj.ping }));
        return;
      }

      
    } catch(err) {
      logger.error(err);
    }
  });
}

module.exports = {
  connect
};
