'use strict';

module.exports = {
  sub: {
    kline: 'market.$symbol.kline.$period',
    marketDepth: 'market.$symbol.depth.$type',
    markDetail: 'market.$symbol.detail',
    tradeDetail: 'market.$symbol.trade.detail',
    order: 'orders.$symbol'
  },
  req: {
    kline: 'market.$symbol.kline.$period',
    tradeDetail: 'market.$symbol.trade.detail'
  }
};
