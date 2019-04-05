import web3 from './web3';
import CompileFactory  from './build/CampaignFactory.json';

//得到工厂合约对象
const instance  = new web3.eth.Contract(
  JSON.parse(CompileFactory.interface),
  '0xfc7A306B15D944aEcF6CD86da7B181d2a15512Ea'
);

export default instance;
