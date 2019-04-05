/*
Author: Tom.hongtao.gao
created: 2019-03-28
Note:  页面顶部的导航栏，具备首页、创建众筹快捷功能
*/

import React  from 'react';
import { Menu } from 'semantic-ui-react'
import { Link } from '../routes';

export default props =>{
  return (
    <Menu style={{marginTop:'15px'}}>
      <Menu.Item>
        <Link route='/'>
        <a>
        首页
        </a>
        </Link>
      </Menu.Item>

      <Menu.Menu position='right'>
        <Menu.Item>
          <Link route='/'>
          <a>
          众筹
          </a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link route='/campaigns/new'>
          <a>
          +
          </a>
          </Link>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}
