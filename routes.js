//require('next-routes') 是导入的函数，添加上（）才是调用函数，生成对象routes
const routes = require('next-routes')();

//先匹配前面的规则，后匹配后面的规则。所以正常的页面url保持不变，一串数字地址的url就跳到show页面。
routes.add('/campaigns/new','/campaigns/new')
      .add('/campaigns/:address', '/campaigns/show')
      .add('/campaigns/:address/requests', '/campaigns/requests/index')
      .add('/campaigns/:address/requests/new', '/campaigns/requests/new')

      
//注意这里的 exports单词，千万别少写一个s，会导致server.js运行失败， 服务器启动失败。
module.exports =  routes;
