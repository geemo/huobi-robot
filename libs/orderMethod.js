'use strict';

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
