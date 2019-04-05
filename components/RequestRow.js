/*
Author: Tom.hongtao.gao
created: 2019-03-28
Note:  自定义表格的行控件，
参数：外界调用控件时会传入参数：key,id,request,address,contributorsCount
*/

import React  from 'react';
import { Table,Button,Message } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';

class RequestRow extends React.Component {

  state = {
    errmsg:'',    //输入异常信息
    loading1:'',   //批准加载中标记
    loading2:'',   //完成加载中标记
  };


  //批准请求操作
  onApprove = async ()=>{
    this.setState({errmsg:''});
    this.setState({loading1:true});  //一旦提交就切换成加载中转圈圈...

    try{
        const campaign  = Campaign(this.props.address);
        const accounts  = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(this.props.id).send({
          from:accounts[0]
        });

        //到了这里就表示批准操作已经被确认了，该刷新页面显示出新的批准票数了
        Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    }catch(err){
        this.setState({errmsg:err.message});
    }

    this.setState({loading1:false});  //一旦提交完成恢复正常
  }

  //完成操作
  onFinalize = async ()=>{
    this.setState({errmsg:''});
    this.setState({loading2:true});  //一旦提交就切换成加载中转圈圈...

    try{
        const campaign  = Campaign(this.props.address);
        const accounts  = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(this.props.id).send({
          from:accounts[0]
        });

        //到了这里就表示批准操作已经被确认了，该刷新页面显示出新的批准票数了。这句话没有用处，无法实现页面刷新。
        Router.replaceRoute(`/campaigns/${this.props.address}/requests`);

    }catch(err){
        this.setState({errmsg:err.message});
    }

    this.setState({loading2:false});  //一旦提交完成恢复正常
  }

  //老师视频中使用这句话便捷赋值，以后可以直接使用Row、Cell，不再用Table.Row, Table.Cell.
  //但是这里会出错编译失败，必须用Table.Row, Table.Cell写法。
  // const { Row, Cell } = Table;
  render(){
    // {
    //   !!this.state.errmsg ? (<Message error header='错误！' content={this.state.errmsg} />) : null
    // }
    return (
      <Table.Row disabled={this.props.request.complete}>
        <Table.Cell>{this.props.id}</Table.Cell>
        <Table.Cell>{this.props.request.description}</Table.Cell>
        <Table.Cell>{web3.utils.fromWei(this.props.request.value,'ether')}</Table.Cell>
        <Table.Cell>{this.props.request.reciptor}</Table.Cell>
        <Table.Cell>{this.props.request.vote}/{this.props.contributorsCount}</Table.Cell>
        <Table.Cell >
            <Button color='green' disabled={this.props.request.complete} onClick={this.onApprove} loading={!!this.state.loading1}>同意</Button>
        </Table.Cell>
        <Table.Cell>
            <Button color='teal' disabled={this.props.request.complete}  onClick={this.onFinalize} loading={!!this.state.loading2}>完成</Button>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default RequestRow;
