'use strict';

const crypto = require('crypto');
const moment = require('moment');
const config = require('config');

module.exports = {
  sleep,
  uuid: _uuid(1000, 2000),
  parseMethod,
  sign
};

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function _uuid(start, end) {
  let cnt = start;
  return () => {
    let code = cnt++;
    if (code > end) {
      code = start;
    }

    return `${Date.now()}${code}`
  };
}

function parseMethod(chReq) {
  let parts = chReq.split('.');
  let method = `${parts[0]}_${parts[2]}`;

  switch(method) {
    case `market_kline`:
    case `market_depth`:
      return {
        method,
        args: [parts[1], parts[3]]
      };
    case `market_detail`:
    case `market_trade`:
    case `order`:
      return {
        method,
        args: [parts[1]]
      };
  }

  return null;
}

function sign(method, baseUrl, path, body) {
  let pairs = [];
  for (let key in body) {
    pairs.push(`${key}=${encodeURIComponent(body[key])}`);
  }

  let concatBody = pairs.sort().join('&');
  let meta = [method, baseUrl, path, concatBody].join('\n');

  let hash = crypto
    .createHmac('sha256', config.get('secretKey'))
    .update(meta)
    .digest('base64');
  
  return `${concatBody}&Signature=${encodeURIComponent(hash)}`
}
