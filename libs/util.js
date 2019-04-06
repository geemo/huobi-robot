'use strict';

module.exports = {
  sleep,
  uuid: _uuid(1000, 2000),
  parseMethod
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

function parseMethod(ch) {
  let parts = ch.split('.');
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
