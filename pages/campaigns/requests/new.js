import React, {Component} from 'react';
import { Form,Button,Input, Message } from 'semantic-ui-react';

import Layout   from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import web3     from '../../../ethereum/web3';
import { Router,Link } from '../../../routes';

class  CampaignsRequestNew extends Component{

    //状态变量
    state = {
      description:'',   //提款请求说明
      value:'',         //提款金额
      recipient:'',     //受益人地址
      errmsg:'',        //输入异常信息
      loading:''        //加载中标记
    };

    //生命周期函数，返回需要的数据
    static async getInitialProps(props){
      const {address}= props.query;
      return {address};
    }

    //捐款按钮点击处理函数
    onSubmit = async ()=>{
        event.preventDefault();

        this.setState({errmsg:''});
        this.setState({loading:true});  //一旦提交就切换成加载中转圈圈...

        if(this.state.value == '' ){
          console.log("输入数字不允许为空！");
          this.setState({errmsg:"输入数字不允许为空！"});
        }else if(this.state.value  <= 0){
          console.log("输入数字必须大于零！");
          this.setState({errmsg:"输入数字必须大于零！"});
        }else{
          try{
              //this.props就是由外部show.js调用ContributeForm传入的参数.
              //Campaign(this.props.address)不存在这样的构造函数，只能理解为强制类型转换。把地址转换为Campaign类型
              const campaign = Campaign(this.props.address);
              const accounts = await web3.eth.getAccounts();
              const {description,value,recipient} = this.state;

              //注意这里采用ether单位，输入框中的数字是ether单位，需要转成wei
              await campaign.methods.createRequest(description,web3.utils.toWei(value,'ether'),recipient).send({
                  from  : accounts[0],
              });

              //到了这里就表示捐款操作已经被确认了，该刷新页面显示请求列表
              Router.replaceRoute(`/campaigns/${this.props.address}/requests`);

          }catch(err){
              this.setState({errmsg:err.message});
          }
        }
        this.setState({loading:false});  //一旦提交完成恢复正常
    };

    render(){
        return (
          <Layout>
              <Link route = {`/campaigns/${this.props.address}/requests`}>
              <a>返回</a>
              </Link>
              <Form onSubmit = {this.onSubmit}  error={!!this.state.errmsg} >
                  <Form.Field>
                    <label>提款请求说明</label>
                    <Input
                        value = {this.state.description}
                        onChange = {event => this.setState({description:event.target.value})}
                     />
                  </Form.Field>

                  <Form.Field>
                    <label>提款金额(ether)</label>
                    <Input
                        value = {this.state.value}
                        onChange = {event => this.setState({value:event.target.value})}
                        label='ether'
                        labelPosition='right'
                     />
                  </Form.Field>

                  <Form.Field>
                    <label>受益人地址</label>
                    <Input
                        value = {this.state.recipient}
                        onChange = {event => this.setState({recipient:event.target.value})}
                     />
                  </Form.Field>
                  <Message error header='错误！' content={this.state.errmsg} />
                  <a>
                  <Button loading={!!this.state.loading} primary>创建请求</Button>
                  </a>
              </Form>
          </Layout>
        );
    }
}

export default CampaignsRequestNew;
