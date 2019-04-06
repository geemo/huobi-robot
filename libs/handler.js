'use strict';

const methods = require('./method');
const logger = require('./logger');
const { parseMethod } = require('./util');
const config = require('config');
const sub = config.get('sub');

let subStatus = {};
let handleMethods = {
  sub: {
    market_kline: subKline,
    market_depth: subMarketDepth,
    market_detail: subMarketDetail,
    market_trade: subMarketTrade,
    order: subOrders
  },
  req: {
    market_kline: reqKline,
    market_trade: reqMarketTrade
  }
};

function emitSub(ws) {
  for (let item of sub) {
    let [method, args] = item.split('|');
    let req = methods.sub[method](args);

    subStatus[req.sub] = { id: req.id };

    ws.send(JSON.stringify(req), err => {
      if (err) {
        logger.error(`emit ${req.sub}||${req.id} error: `, err);
        return;
      }
    });
  }
}

function monit(ws, data) {
  if (data.subbed) {
    // 订阅成功响应消息
    subStatus[data.subbed] = data;
    logger.info(`subscribe success: `, data);
  } else if (data['err-code']) {
    // 订阅失败响应消息
    for (let sub in subStatus) {
      if (subStatus[sub].id === data.id) {
        subStatus[sub] = data;
        logger.error(`subscribe error: `, data);
        break;
      }
    }
  } else if (data.tick) {
    // 订阅消息处理
    let obj = parseMethod(data.ch);
    if (obj) {
      let { method, args } = obj;
      handleMethods.sub[method](ws, args, data);
    }
  } else {
    logger.info("req data: ", data);
    // 请求消息处理
    let obj = parseMethod(data.ch);
    let { method, args } = obj;
    handleMethods.req[method](ws, args, data);
  }
}

function subKline(ws, args, data) {
  logger.info('args: ', args);
  logger.info('data: ', data);
}

function subMarketDepth(ws, args, data) {

}

function subMarketDetail(ws, args, data) {

}

function subMarketTrade(ws, args, data) {

}

function subOrders(ws, args, data) {

}

function reqKline(ws, args, data) {

}

function reqMarketTrade(ws, args, data) {

}

module.exports = {
  emitSub,
  monit
};

