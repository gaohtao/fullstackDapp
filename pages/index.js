import React, {Component} from 'react';
import { Card,Button } from 'semantic-ui-react'
import Layout from '../components/Layout';
import { Link } from '../routes';

import factory from  '../ethereum/factory';
import Campaign from '../ethereum/campaign';

//Component是react框架的类
class  CampaignIndex extends Component{

  //这是生命周期函数，会在next server一开始启动时调用执行，结果作为html对象返回给浏览器，相当于变相的执行了js脚本。
  static async getInitialProps(){
    var summarys = new Map();   //活动参数列表 地址-->summary
    const campaigns = await factory.methods.getDeployedCampaign().call();

    for(let address of campaigns){
      const campaign = Campaign(address);   //得到众筹实例
      const summary = await campaign.methods.getSummary().call();  //调用getSummary方法
      summarys.set(address,summary);
    }

    return {campaigns,summarys};
  };

  renderCampaign(){

    const items = this.props.campaigns.map(address =>{
      var summary;
      for(let s of this.props.summarys){
        if(s[0]== address){
            summary=s[1];
        }
      }
      // const summary = this.props.summarys.get(address);
      return {
        header:
            <Link route={`/campaigns/${address}`}>
              <a> {summary[0]} </a>
            </Link>,
        description:summary[1],
        fluid:true
      };
    });

    return <Card.Group items= {items} />;
  }

  //componentDidMount函数被next server调用，如果浏览器禁用js脚本就无法运行了。
  // async componentDidMount(){
  //   console.log("4444444");
  //   const campaign = await factory.methods.getDeployedCampaign().call();
  //   //const campaign = await factory.options.address;
  //   console.log("55555--",campaign);
  // }

  render(){
    return (
      <Layout>
        <div>
          <h3>众筹活动</h3>
            <Link route='/campaigns/new'>
              <a>
                <Button floated="right" content='创建众筹' icon='add circle' labelPosition='right' primary/>
              </a>
            </Link>
          {this.renderCampaign()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
