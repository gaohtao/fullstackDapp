import React, {Component} from 'react';
import { Button, Form,Input } from 'semantic-ui-react';
import {Message} from 'semantic-ui-react';
import {Router}  from '../../routes';


import Layout from '../../components/Layout';
import web3 from  '../../ethereum/web3';
import factory from  '../../ethereum/factory';



class  CampaignNew extends Component{

  state = {
    campaignName:'', //众筹活动名称
    description:'',  //发起众筹的原因说明
    managerName:'',  //管理人名称
    minimum:'',      //最小捐款金额
    errmsg:'',       //输入异常信息
    loading:'',      //加载中标记
  }

  //表单提交处理函数
  onSubmit = async ()=>{
    event.preventDefault();  //阻止默认表单提交动作，使用next自己的下面的处理代码

    this.setState({errmsg:''});
    this.setState({loading:true});  //一旦提交就切换成加载中转圈圈...
    // console.log("minimum=",this.state.minimum);

    if(this.state.campaignName == '' ){
      console.log("众筹活动名称不允许为空！");
      this.setState({errmsg:"众筹活动名称不允许为空！"});
    }else if(this.state.description == ''){
      console.log("发起众筹的原因说明不允许为空！");
      this.setState({errmsg:"发起众筹的原因说明不允许为空！"});
    }else if(this.state.managerName == ''){
      console.log("管理人名称不允许为空！");
      this.setState({errmsg:"管理人名称不允许为空！"});
    }else if(this.state.minimum == '' ){
      console.log("输入数字不允许为空！");
      this.setState({errmsg:"输入数字不允许为空！"});
    }else if(this.state.minimum <=100){
      console.log("最小捐款金额100wei！");
      this.setState({errmsg:"低于最小捐款金额100wei！"});
    }else{
      try{
        const accounts = await web3.eth.getAccounts();  //获得发起人的账号地址

        //用工厂创建出众筹活动
        await factory.methods.creatCampaign(this.state.campaignName,
                                            this.state.description,
                                            this.state.managerName,
                                            this.state.minimum).send({from:accounts[0]});

        //正确执行创建操作就返回首页
        Router.pushRoute('/');   // /表示首页地址

      }catch(err){
        this.setState({errmsg:err.message});
      }
    }

    this.setState({loading:false});  //一旦提交完成恢复正常
  }

  render(){
    // console.log(this.state);

    /*his.state.errmsg说明： 是转换成bool类型，字符串空就转换成false，字符串存在就转换成true。这样一旦有错误信息form表单就显示出来*/
    return  (
      <Layout>
        <h3>创建你的众筹项目</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errmsg} >
            <Form.Field>
              <label>请输入众筹活动名称</label>
              <Input
                  value = {this.state.campaignName}
                  onChange = {event => this.setState({campaignName:event.target.value})}
              />
              <label>发起众筹的原因说明</label>
              <Input
                  value = {this.state.description}
                  onChange = {event => this.setState({description:event.target.value})}
              />
              <label>管理人(发起人)名称</label>
              <Input
                  value = {this.state.managerName}
                  onChange = {event => this.setState({managerName:event.target.value})}
              />
              <label>请输入最小捐款金额</label>
              <Input label='wei' labelPosition='right'
                  value = {this.state.ninimum}
                  onChange = {event => this.setState({minimum:event.target.value})}
              />
            </Form.Field>
            <Message error header='错误！' content={this.state.errmsg} />
            <Button loading={!!this.state.loading} primary>创建众筹</Button>
        </Form>
      </Layout>
    );
  }
}

export  default CampaignNew;
