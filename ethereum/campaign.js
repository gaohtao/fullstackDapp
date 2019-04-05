//创建众筹活动的实例模块， 只要知道这个众筹合约的地址就能创建出来一个实例。

import web3 from './web3';
import Campaign  from './build/Campaign.json';

export default (address)=>{

  const instance  = new web3.eth.Contract(
    JSON.parse(Campaign.interface),
    address
  );
  return instance;
}
