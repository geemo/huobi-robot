'use strict';

const methods = require('./marketMethod');
const logger = require('./logger');
const { parseMethod } = require('./util');

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

function emit(ws, subDirects, reqDirects) {
  for (let item of subDirects) {
    let [method, args] = item.split('|');
    let sub = methods.sub[method](args);
    ws.send(JSON.stringify(sub), err => {
      if (err) {
        logger.error(`error sub: `, sub, err);
        return;
      }
    });
  }

  for (let item of reqDirects) {
    let [method, args] = item.split('|');
    let req = methods.req[method](args);
    ws.send(JSON.stringify(req), err => {
      if (err) {
        logger.error(`error req: `, req, err);
        return;
      }
    });
  }
}

function monit(ws, data) {
  // 订阅成功响应消息  
  if (data.subbed) {
    logger.info(`subscribe success: `, data);
    return;
  }
  
  // 订阅失败响应消息  
  if (data['err-code']) {
    logger.error(data);
    return; 
  }
  
  // 订阅消息处理  
  if (data.ch) {
    let obj = parseMethod(data.ch);
    if (obj) {
      let { method, args } = obj;
      handleMethods.sub[method](ws, args, data);
    }
    return;
  }
  
  // 请求消息处理  
  if (data.rep) {
    let obj = parseMethod(data.rep);
    let { method, args } = obj;
    handleMethods.req[method](ws, args, data);
    return;
  }

  logger.error(data);
}

function subKline(ws, args, data) {
  logger.info('args: ', args);
  logger.info('data: ', JSON.stringify(data, null, 2));
}

function subMarketDepth(ws, args, data) {
  logger.info('args: ', args);
  logger.info('data: ', JSON.stringify(data, null, 2));
}

function subMarketDetail(ws, args, data) {
  logger.info('args: ', args);
  logger.info('data: ', JSON.stringify(data, null, 2));
}

function subMarketTrade(ws, args, data) {
  logger.info('args: ', args);
  logger.info('data: ', JSON.stringify(data, null, 2));
}

function subOrders(ws, args, data) {
  logger.info('args: ', args);
  logger.info('data: ', JSON.stringify(data, null, 2));
}

function reqKline(ws, args, data) {
  logger.info('args: ', args);
  logger.info('data: ', JSON.stringify(data, null, 2));
}

function reqMarketTrade(ws, args, data) {
  logger.info('args: ', args);
  logger.info('data: ', JSON.stringify(data, null, 2));
}

module.exports = {
  emit,
  monit
};

