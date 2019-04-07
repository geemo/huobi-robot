'use strict';

const axios = require('axios');
const moment = require('moment');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const logger = require('../libs/logger');
const { execSync } = require('child_process');

const config = require('config');
const websocket = require('../libs/websocket');
const marketMethods = require('../libs/marketMethod');
const methods = require('../libs/marketMethod');

const UP_DOWN_DATA = [
  ['暴涨', '2019-01-14 22:00'],
  ['暴跌', '2019-01-20 18:00'],
  ['暴跌', '2019-01-28 06:00'],
  ['暴跌', '2019-02-06 08:00'],
  ['暴涨', '2019-02-08 22:00'],
  ['暴涨', '2019-02-18 04:00'],
  ['暴涨', '2019-02-23 04:00'],
  ['暴跌', '2019-02-24 22:00'],
  ['暴跌', '2019-02-28 04:00'],
  ['暴涨', '2019-04-02 12:00'],
  ['暴跌', '2019-04-06 06:00'],
];
let UP_DOWN_DATA_IDX = -1;

const parser = new Parser({
  fields: ['时间', '高', '低', '预警', '精英多头', '精英空头', '平均值', '差额']
});


websocket.connect(
  config.get('marketWsUrl'),
  { emit, monit }
);

function emit(ws) {
  UP_DOWN_DATA_IDX++
  let [upDown, date] = UP_DOWN_DATA[UP_DOWN_DATA_IDX];
  let [from, to] = beforeAfterSixHour(date);

  let req = methods.req['kline'](`BTC_CQ.60min.${from}.${to}`);
  logger.info(req, from, to);
  ws.send(JSON.stringify(req), err => {
    if (err) {
      logger.error(`error req: `, req, err);
      return;
    }
  });
}


async function monit(ws, data) {
  if (data.rep) {
    let klineDate = data.data;
    let position = await getHourDate(
      'okexbtcusdquarter',
      moment.unix(klineDate[0].id).format('YYYY-MM-DD HH:mm'),
      moment.unix(klineDate[klineDate.length - 1].id).format('YYYY-MM-DD HH:mm')
    );

    let writeDate = [];
    logger.info(`upDownElem: `, UP_DOWN_DATA[UP_DOWN_DATA_IDX], UP_DOWN_DATA_IDX);
    
    for (let i = 0; i < klineDate.length; i++) {
      let longs = parseFloat(position[i].longs);
      let shorts = parseFloat(position[i].shorts);

      writeDate.push({
        '时间': moment.unix(klineDate[i].id).format('YYYY-MM-DD HH:mm'),
        '高': klineDate[i].high,
        '低': klineDate[i].low,
        '预警': getWarningInfo(i, UP_DOWN_DATA[UP_DOWN_DATA_IDX]),
        '精英多头': longs,
        '精英空头': shorts,
        '平均值': Math.round((longs + shorts) / 2 * 100) / 100,
        '差额': Math.round((longs - shorts) * 100) / 100
      });
    }

    const csv = parser.parse(writeDate);

    let [upDown, upDownDate] = UP_DOWN_DATA[UP_DOWN_DATA_IDX];
    fs.writeFileSync(path.resolve(__dirname, `${upDownDate}_${upDown}.csv`), csv);

    if (UP_DOWN_DATA_IDX < (UP_DOWN_DATA.length - 1)) {
      emit(ws);
    }
  }
}

function getWarningInfo(dataIdx, upDownElem) {
  let [ upDown ] = upDownElem;

  let hour = (6 - dataIdx);
  let prefix = hour >= 0 ? `${upDown}前` : `${upDown}后`;

  return `${prefix}${Math.abs(hour)}H`;
}

function beforeAfterSixHour(date) {
  let from = moment(date).subtract(6, 'h').unix();
  let to = moment(date).add(6, 'h').unix();

  return [from, to];
}

function exec(cmd) {
  return execSync(cmd, { encoding: 'utf8' });
}

async function getHourDate(symbol, startTime, endTime) {
  let url = `http://api.heyuedi.com/api/okex/futurepositionratio?symbol=${symbol}&start_time=${+moment(startTime)}&end_time=${+moment(endTime)}`;
  let res = await axios({
    method: 'GET',
    url,
    headers: {
      'Host': 'api.heyuedi.com',
      'HEYUEDI-DEVICE-ID': 'ea2c087d9e2455a99ed94362e63201ec238d71c6114e69a0f2a320f8943d25ce',
      'Cookie': 'PHPSESSID=iuobb7nkifh6m962hen8p0i6vk; __cfduid=d86d041275fd55ca8be83fe1a6a6c47fa1553719261; ctrl_time=1; lang=zh_CN; yjs_id=06dae503f7e78db65165033f7480ff1b; __cfduid=d5ae6b290910689fbab2bfb491719a1791553717490',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16D57_HeYueDi_IOS_V1.3.8',
      'HEYUEDI-APP-TOKEN': '764d694dbe6dd44f1112d26f99f4cd39'
    }
  });

  return res.data.data;
}


