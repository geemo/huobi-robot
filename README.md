# huobi-robot

火币自动交易机器人

**配置**

配置请修改 config 目录下的 json 文件

```js
{
  // 行情请求指令, 如请求 2019-01-14 12:00:00 到 2019-01-14 23:00:00 时间段以小时为粒度的 btc 季度合约的 k 线
  "marketReqDirects": ["kline|BTC_CQ.60min.1547438400.1547478000"],

  // 行情订阅指令, 如订阅 btc 季度合约以月为粒度的 k 线走势
  "marketSubDirects": ["kline|BTC_CQ.1mon"]
}
```

**测试**

```sh
npm run default
```