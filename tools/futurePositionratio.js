'use strict';

const axios = require('axios');
const moment = require('moment');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

module.exports = {
  getHourDate
};

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

  let data = res.data.data;

  return data.map(item => {
    let longs = parseFloat(item.longs);
    let shorts = parseFloat(item.shorts);
    return {
      '日期': moment(+item.date).format('YYYY-MM-DD HH:mm'),
      '精英多头': longs,
      '精英空头': shorts,
      '平均值': Math.round((longs + shorts) / 2 * 100) / 100,
      '差额': Math.round((longs - shorts) * 100) / 100
    };
  });
}

// (async () => {
//   let res = await getHourDate('okexbtcusdquarter', '2019-02-24 08:00', '2019-02-25 00:00');
//   fs.writeFileSync(path.resolve(__dirname, 'in.json'), JSON.stringify(res));

//   const parser = new Parser({
//     fields: ['日期', '精英多头', '精英空头', '平均值', '差额']
//   });

//   const csv = parser.parse(res);

//   console.log(csv);
// })();

async function getReport(symbol, startTime)
