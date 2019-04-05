import React, {Component} from 'react';
import { Button } from 'semantic-ui-react';
import { Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class  CampaignsRequest extends Component{

    static async getInitialProps(props){
      // const address = props.query.address;    //普通写法
      const {address} = props.query;           //高级写法,如果没有{}会导致地址错误

      const campaign = Campaign(address);
      var requestCount = await campaign.methods.getRequestCount().call();
      const contributorsCount =await campaign.methods.contributorsCount().call();
      console.log("requestCount=",requestCount);

      //创建请求数组，读取每一个请求填写到数组中。这段代码功能与下面一段相同
      // var requests = new Array(Number(requestCount));
      // for(let index of requests.keys()){
      //    //console.log(index);
      //    requests[index] = await  campaign.methods.requests(index).call();
      // }

      const requests = await Promise.all(
        Array(Number(requestCount)).fill().map((element,index)=>{
          return campaign.methods.requests(index).call();
        })    //注意这句话后面不能有分号;
      );
      console.log("requests=",requests);

      //返回address和requests，以后就可以作为this.props的属性使用了
      return {address, requests, requestCount, contributorsCount};
    }

    renderRow(){
        return this.props.requests.map((request,index)=>{
          //下面语句中的key,id,request,address就是RequestRow控件所需要的参数，赋值就表示传递参数
          //外界调用控件时会传入参数：key,id,request,address,contributorsCount
          return (
            <RequestRow  key={index}
                         id ={index}
                         request={request}
                         address={this.props.address}
                         contributorsCount={this.props.contributorsCount}
            ></RequestRow>
          )
        });
    }


    render(){
        //console.log(this.props.address);
        return (
          <Layout>
            <h1>请求列表</h1>
            <Link route={`/campaigns/${this.props.address}/requests/new`}>
              <a> <Button primary>创建请求</Button> </a>
            </Link>

            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>ID</Table.HeaderCell>
                  <Table.HeaderCell>描述</Table.HeaderCell>
                  <Table.HeaderCell>金额</Table.HeaderCell>
                  <Table.HeaderCell>受益人</Table.HeaderCell>
                  <Table.HeaderCell>同意票数</Table.HeaderCell>
                  <Table.HeaderCell>是否同意</Table.HeaderCell>
                  <Table.HeaderCell>是否完成</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                  { this.renderRow() }
              </Table.Body>

            </Table>

          </Layout>
        );
    }

}

export default CampaignsRequest;
