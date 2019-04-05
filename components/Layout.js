/*
Author: Tom.hongtao.gao
created: 2019-03-28
Note:  自定义容器，容纳这个页面所有元素，具备顶部导航栏。自动居中等布局管理。
*/

import React  from 'react';
import { Container } from 'semantic-ui-react'
import Header from './Header';

export default props =>{
  return (
    <Container>
      <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
      <div>
        <Header />
          {props.children}
      </div>
    </Container>
  );
}
