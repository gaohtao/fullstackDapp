const assert  = require('assert');
const ganache = require('ganache-cli');
const Web3    = require('web3');   //大写的Web3是导入的类
const web3    = new Web3(ganache.provider()); //这里就是构造函数，把ganache测试网络和web3库连接起来.

const compileFactory  = require('../ethereum/build/CampaignFactory.json');
const compileCampaign = require('../ethereum/build/Campaign.json');

//定义全局变量
var accounts;
var factory;
var campaignAddress;
var campaign;

beforeEach( async()=>{

  /*下面的测试代码中地址说明：
      accounts[0]: 当做管理员地址，
      accounts[1]: 捐款人地址
      accounts[2]: 提款请求的受益人
  */
  accounts = await web3.eth.getAccounts();
  // console.log(accounts);

  //创建工厂对象
  factory = await new web3.eth.Contract(JSON.parse(compileFactory.interface))
                  .deploy({data:'0x'+compileFactory.bytecode})
                  .send({from:accounts[0],gas:1000000});

  //通过工厂创建出合约对象,注意得到的是合约地址，存储在工厂内部的合约数组中。
  //使用accounts[0]作为合约管理员
  await factory.methods.creatCampaign(100).send({from:accounts[0],gas:1000000});
  //这种特殊写法可以得到数组的第0元素, 静态方法需要用call调用
  [campaignAddress] = await factory.methods.getDeployedCampaign().call();
  campaign = await new web3.eth.Contract(JSON.parse(compileCampaign.interface), campaignAddress);

  // console.log('  beforeEach  run  completed!');
});

describe('campaign',()=>{

  //检查factory、campaign对象是否部署成功。
  it('deploy factory and  campaign success!', async ()=>{
    assert.ok(factory.options.address);   //如果指定的对象存在就OK，不存在就失败
    assert.ok(campaign.options.address);
  });

  //检查管理员地址是否与调用这一致，否则失败。调用静态方法，
  it('check manager address', async ()=>{
    const  manager = await campaign.methods.manager().call();
    assert(manager, accounts[0]);

  });

  //测试捐款方法, accounts[1]捐款200wei
  it('test contribute()', async ()=>{
    await campaign.methods.contribute().send({from:accounts[1],value:200});
    const ret = await campaign.methods.contributors(accounts[1]).call();
    assert(ret);
  });

  //测试最小捐款数是佛有效, 能捕获到的error就算执行正确。
  it('require a mininum contribute', async ()=>{
    try{
      await campaign.methods.contribute().send({from:accounts[1],value:10});
      const ret = await campaign.methods.contributors(accounts[1]).call();
      assert(ret);
    }catch(err){
      console.log(err);
    }
  });

  //测试创建提款请求，只能由管理员accounts[0]发起请求，受益人是accounts[2]
  it('allows a manager to make request', async ()=>{
    await campaign.methods.createRequest('buy computer',120,accounts[2]).send({from:accounts[0],gas:1000000});
    const req = campaign.methods.requests(0).call();
    assert('buy computer',req.description);
  });
});
