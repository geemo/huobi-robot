'use strict';

const { uuid } = require('./util');

module.exports = {
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

// 订阅 k 线
// sp <==> symbol_period 
function subKline(sp, ws, cb) {
  let [symbol, period] = sp.split('.');

  return {
    sub: `market.${symbol}.kline.${period}`,
    id: uuid()
  };
}

// 订阅交易深度
// st <==> symbol_type
function subMarketDepth(st) {
  let [symbol, type] = st.split('.');

  return {
    sub: `market.${symbol}.depth.${type}`,
    id: uuid()
  };
}

// 订阅市场详情
// s <==> symbol
function subMarketDetail(s) {
  let symbol = s;
  
  return {
    sub: `market.${symbol}.detail`,
    id: uuid()
  };
}

// 订阅交易详情
// s <==> symbol
function subMarketTrade(s) {
  let symbol = s;

  return {
    sub: `market.${symbol}.trade.detail`,
    id: uuid()
  };
}

// 订阅订单
// s <==> symbol
function subOrders(s) {
  let symbol = s;

  return {
    op: 'sub',
    cid: uuid(),
    topic: `orders.${symbol}`
  };
}

// 请求 k 线
// spft <==> symbol_period[_from_to]
function reqKline(spft) {
  let [symbol, period, from, to] = sp.split('.');
  
  let ret = {
    req: `market.${symbol}.kline.${period}`,
    id: uuid()
  };

  if (from) {
    ret.from = +from;
  }
  
  if (to) {
    ret.to = +to;
  }

  return ret;
}

// 请求交易详情
// s <==> symbol
function reqMarketTrade(s) {
  let symbol = s;

  return {
    req: `market.${symbol}.trade.detail`,
    id: uuid()
  };
}
