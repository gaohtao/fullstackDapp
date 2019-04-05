import React from 'react';
import Layout from '../../components/Layout';

import Campaign from '../../ethereum/campaign';
import ContributeForm from '../../components/contributeForm';
import web3 from '../../ethereum/web3';

import { Card } from 'semantic-ui-react';
import { Grid } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { Link } from '../../routes';

class  CampaignShow extends React.Component{

  //这是生命周期函数，参数props由route转换时传递。
  static async getInitialProps(props){
    //console.log(props.query.address);
    const campaign = Campaign(props.query.address);   //得到众筹实例
    const summary = await campaign.methods.getSummary().call();  //调用getSummary方法
    //console.log(summary);

    //返回需要的数据
    return {
      address          : props.query.address,    //本众筹合约地址
      campaignName     : summary[0],             //众筹活动名称
      description      : summary[1],             //发起众筹的原因
      managerName      : summary[2],             //管理者名称
      manager          : summary[3],             //管理者地址
      miniDonation     : summary[4],             //最小捐款金额
      balance          : summary[5],             //众筹活动募集到的金额
      requestsCount    : summary[6],             //提款请求的总数
      contributorsCount: summary[7]              //捐款人总数
    };
  }

  //定义控件函数
  renderCards(){
    //属性赋值语句，快速写法
    const {
      address,
      campaignName,
      description,
      managerName,
      manager,
      miniDonation,
      balance,
      requestsCount,
      contributorsCount
    } = this.props;

    const items = [
      {
        header: campaignName,
        description: description,
        style:{overflowWrap:'break-word'}   //长字符串自动换行
      },
      {
        header: managerName ,
        description: '管理者创建了当前众筹活动，并且是众筹的受益人',
        meta: manager,
        style:{overflowWrap:'break-word'}   //长地址自动换行
      },
      {
        header: web3.utils.fromWei(balance,'ether'),
        description: '当前众筹账户剩余的金额',
        meta: '账户金额(ether)',
        style:{overflowWrap:'break-word'}   //长地址自动换行
      },
      {
        header: miniDonation,
        description: '捐款人捐助金额不得低于最小金额',
        meta: '最小捐款金额(wei)',
        style:{overflowWrap:'break-word'}   //长地址自动换行
      },
      {
        header: contributorsCount,
        description: '对本众筹活动捐款的所有捐款人数量',
        meta: '捐款人数量',
        style:{overflowWrap:'break-word'}   //长地址自动换行
      },
      {
        header: requestsCount,
        description: '管理者发起的提款请求总数量',
        meta: '提款请求数量',
        style:{overflowWrap:'break-word'}   //长地址自动换行
      }
    ];

    //必须要返回items对象，不然无法显示出来
    return <Card.Group items={items} />
  }


  render(){
    return (
      <Layout>
        <h1>众筹详情</h1>
        <Grid>
          <Grid.Row>
              <Grid.Column width={10}>
                  {this.renderCards() }
              </Grid.Column>

              <Grid.Column width={6}>
                  <ContributeForm  address = {this.props.address}/>
              </Grid.Column>
          </Grid.Row>

          <Grid.Row>
              <Grid.Column>
                  <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>
                      <Button primary>查看提款请求</Button>
                    </a>
                  </Link>
              </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }

}

export  default CampaignShow;
