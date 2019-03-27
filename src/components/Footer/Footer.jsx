import React, { Component } from 'react'
import { Layout, Icon } from 'antd'
import './Footer.scss'
const { Footer } = Layout

class CbFooter extends Component {
  render() {
    return (
      <Footer className="Cbfooter">
        <div className="official-container">
          <div className="official-title">
            <h1>联系我们</h1>
          </div>
          <div className="official-main">
            <div className="officialUrl">
              <Icon type="phone" />
              <span>&nbsp;&nbsp;</span>
              <span>+86-15510022283</span>
            </div>
            <div className="officialUrl">
              <Icon type="phone" />
              <span>&nbsp;&nbsp;</span>
              <span>+86-15510066139</span>
            </div>
            <div className="officialUrl">
              <Icon type="dribbble" />
              <span>&nbsp;&nbsp;</span>
              <span>
                <a href="http://www.chexd.com">http://www.chexd.com</a>
              </span>
            </div>
            <div className="officialUrl">
              <Icon type="environment" />
              <span>&nbsp;&nbsp;</span>
              <span>北京市丰台区宋庄路39号扑满山写字楼1号楼1502室</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom-in">Copyright © 2018 北京车兄弟科技有限公司 - 京ICP备18061963号-1</div>
      </Footer>
    )
  }
}

export default CbFooter
