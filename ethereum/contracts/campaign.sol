pragma solidity ^0.4.23;

//工厂模式， 提供便捷的创建合约和读取合约数组方法
contract CampaignFactory{
  address[]  deployedCampaign;   //已经部署的众筹合约地址

  //创建众筹合约
  function creatCampaign(string campaignName, string description, string managerName,uint mininum) public {
      address newcp = new Campaign(campaignName, description, managerName, msg.sender, mininum);
      deployedCampaign.push(newcp);
  }

  //读取合约数组
  function getDeployedCampaign() public view returns(address[]){
    return deployedCampaign;
  }
}


contract  Campaign{

  struct Request{
    string description;   //请求的详细描述，说明提款的原因和用途
    uint   value;         //提款金额
    address reciptor;     //收款人地址
    bool   complete;      //请求是否被通过，多数捐款人批准才能通过。
    uint   vote;          //赞成票数
    mapping(address => bool) contributors;   //批准请求的捐款人列表
  }    //此处语法禁止有分号，会导致合约编译错误

  string    public  campaignName;   //众筹活动名称
  string    public  description;    //发起众筹的原因说明
  string    public  managerName;    //管理人(发起人)名称
  address   public  manager;        //管理人(发起人)地址
  uint      public  miniDonation;   //最小捐款金额

  mapping(address => bool) public contributors;   //捐款人列表
  uint      public  contributorsCount;     //捐款人数量
  Request[] public  requests;       //提款请求列表，

  //构造函数
  constructor(string _campaignName, string _description, string _managerName, address _manager, uint _miniDonation) public {
      campaignName = _campaignName;
      description  = _description;
      managerName  = _managerName;
      manager      = _manager;
      miniDonation = _miniDonation;
  }

  //捐款函数，保存捐款人地址，接收捐款金额必须大于最小值
  function contribute() public payable{
    require(msg.value >= miniDonation);
    contributors[msg.sender] = true;
    contributorsCount++;
  }

  modifier restricted(){
    require(msg.sender == manager);
    _;
  }

  //创建提款请求
  function createRequest(string _description, uint _value, address _reciptor ) public restricted {

    //注意这个Request是结构体类型，不能用new创建，语法比较特殊
    Request memory newrequest =  Request({
      description: _description,
      value      : _value,
      reciptor   : _reciptor,
      complete   : false,
      vote       : 0
      });

      requests.push(newrequest);
  }

  //批准提款请求， index是请求命令编号
  function approveRequest(uint index) public {
    require(contributors[msg.sender]);

    Request storage req = requests[index];
    require(!req.contributors[msg.sender]);
    req.contributors[msg.sender] = true;
    req.vote ++;
  }

  //完成请求的全部操作，一旦赞成数过半就执行转账操作
  function finalizeRequest(uint index) public payable restricted {
    Request storage req = requests[index];
    // 确保赞成票数过半
    require(req.vote > contributorsCount/2);

    //转账给收款人
    req.reciptor.transfer(req.value);

    //到此请求完成了，设置成true状态
    req.complete = true;
  }

  //读取合约的大体数据
  function  getSummary() public view returns(string,string,string,address, uint,uint,uint,uint){
    return (campaignName,
            description,
            managerName,
            manager,
            miniDonation,
            address(this).balance,
            requests.length,
            contributorsCount);
  }

  //读取请求总数
  function getRequestCount() public view returns(uint){
    return requests.length;
  }

}
