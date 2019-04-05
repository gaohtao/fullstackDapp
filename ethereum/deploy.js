const HDWalletProvider = require('truffle-hdwallet-provider');

const Web3    = require('web3');   //大写的Web3是导入的类

const compileFactory  = require('./build/CampaignFactory.json');


const provider = new HDWalletProvider(
  // this is Tom psw, 助记词是没问题的，用这个可以得到自己的账户地址：web3.eth.getAccounts()
  'tribe warrior flush finger target hope unveil whip gloom popular guide unique',
  //这个就是infura网站的项目id，验证是可以正常发出交易的。
  'https://ropsten.infura.io/v3/5391d9a764884afbb4bbd7d0994e68ec'
);

//这里就是构造函数，通过infura把测试网络ropsten和web3库连接起来，生成一个对象小写的web3.
const web3  = new Web3(provider);

//定义匿名函数
const deploy = async ()=>{
  const accounts = await web3.eth.getAccounts();
  console.log('attempt to deploy contract', accounts[0]);

  //注意gaslimit的数值，测试出现超过1730000. 如果数值过小将会出现部署失败
  var result = await new web3.eth.Contract(JSON.parse(compileFactory.interface))
                .deploy({data:'0x'+compileFactory.bytecode})
                .send({from:accounts[0],gas:3000000});
  //输出交易地址
  console.log("contract deployed to: ",result.options.address);
}

//执行这个函数
deploy();
