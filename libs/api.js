'use strict';

const axios = require('axios');
const moment = require('moment');
const config = require('config');
const { sign } = require('./util');
const restUrlPrefix = config.get('restUrlPrefix');

function getContractAccountInfo(symbol) {
  let body = symbol ? { symbol } : {};
  const method = 'POST';
  const path = '/api/v1/contract_account_info';
  const realBody = Object.assign(getCommonBody(), body);

  let signStr = sign(
    method,
    restUrlPrefix,
    path,
    realBody
  );

  return axios({
    method,
    baseURL: restUrlPrefix,
    url: `${path}?${signStr}`,
    data: realBody
  });
}

function getCommonBody() {
  const commonBody = {
    AccessKeyId: config.get('apiKey'),
    SignatureMethod: 'HmacSHA256',
    SignatureVersion: 2,
    Timestamp: '2019-04-06T19:05:05',
  };

  return commonBody;
}

(async () => {
  try {
    let res = await getContractAccountInfo();
    console.log(res);
  //   let body = getCommonBody();
  //   let method = 'POST';
  //   let host = 'https://api.hbdm.com';
  //   let path = '/api/v1/contract_contract_info';
  //   let reqBody = { symbol: 'btc' };
  //   let realBody = Object.assign(body, reqBody);
  //   console.log(method, host, path, realBody);
  //   console.log(sign(method, host, path, realBody));
  } catch(err) {
    console.error(err);
  }
})();