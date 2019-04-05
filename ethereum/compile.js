const path = require('path');         //导入路径库
const fs   = require('fs-extra');     //导入fs-extra库, 比fs库更强
const solc = require('solc');         //导入solc库

//定义build目录，如果已经存在就先删除，重新建立目录
const buildpath = path.resolve(__dirname, 'build');
fs.removeSync(buildpath);
fs.ensureDirSync(buildpath);

//读取sol文件全部内容, 写入build目录下的json文件
const campaignpath = path.resolve(__dirname,'contracts','campaign.sol');
console.log(campaignpath);
const source   = fs.readFileSync(campaignpath,'utf8');
const output   = solc.compile(source,1).contracts;  //对智能合约进行编译，第二个参数设置为1可以激活优化器optimiser
for(let contract in output){
  //注意contract名字前面多了一个冒号，用replace函数替换成空字符，就达到了删除目的。
  fs.outputJsonSync( path.resolve(buildpath,contract.replace(":","")+'.json'), output[contract]);
}
console.log('create json file success-----');
