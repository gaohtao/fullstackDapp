/*
Author: Tom.hongtao.gao
created: 2019-03-28
Note:  自定义表格的行控件，
参数：外界调用控件时会传入参数：key,id,request,address,contributorsCount
*/


import React, {Component}  from 'react';
import { Form,Button,Input } from 'semantic-ui-react';
import {Message} from 'semantic-ui-react';

import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import {Router}  from '../routes';

class  ContributeForm extends Component{

  state = {
    value : '',
    errmsg:'',    //输入异常信息
    loading:'',   //加载中标记
  };

  //捐款按钮点击处理函数
  onSubmit = async ()=>{
      event.preventDefault();

      this.setState({errmsg:''});
      this.setState({loading:true});  //一旦提交就切换成加载中转圈圈...

      if(this.state.value == '' ){
        console.log("输入数字不允许为空！");
        this.setState({errmsg:"输入数字不允许为空！"});
      }else if(this.state.value * 10**18 <= 100){
        console.log("最小捐款金额100wei！");
        this.setState({errmsg:"低于最小捐款金额100wei！"});
      }else{
        try{
            //this.props就是由外部show.js调用ContributeForm传入的参数.
            //Campaign(this.props.address)不存在这样的构造函数，只能理解为强制类型转换。把地址转换为Campaign类型
            const campaign = Campaign(this.props.address);
            const accounts = await web3.eth.getAccounts();

            //注意这里采用ether单位，输入框中的数字是ether单位，需要转成wei
            await campaign.methods.contribute().send({
                from  : accounts[0],
                value : web3.utils.toWei(this.state.value,'ether')
            });

            //到了这里就表示捐款操作已经被确认了，该刷新页面显示出新的账户金额了
            Router.replaceRoute(`/campaigns/${this.props.address}`);

        }catch(err){
            this.setState({errmsg:err.message});
        }
      }
      this.setState({loading:false});  //一旦提交完成恢复正常
  };

  render(){
    return (
        <Form onSubmit = {this.onSubmit}  error={!!this.state.errmsg} >
            <Form.Field>
              <label>请输入您的捐款金额</label>
              <Input
                  value = {this.state.value}
                  onChange = {event => this.setState({value:event.target.value})}
                  label='ether'
                  labelPosition='right' />
            </Form.Field>
            <Message error header='错误！' content={this.state.errmsg} />
            <Button loading={!!this.state.loading} primary>捐款</Button>
        </Form>
    );
  }

}

export default ContributeForm;
