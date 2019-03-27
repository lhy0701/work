import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Layout } from 'antd'
import Logo from '../Logo'
import './Header.scss'
import { headerMenuConfig } from '../../MenuConfig/MenuConfig'

const { SubMenu, Item } = Menu
const { Header } = Layout
class CbHeader extends Component {
  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { location = {} } = this.props
    const { pathname } = location
    return (
      <Header style={style.header}>
        <div className="header-container">
          <div className="header-content">
            <Logo />
            <Menu
              className="header-navbar-menu"
              mode="horizontal"
              selectedKeys={[pathname]}
              defaultSelectedKeys={[pathname]}
            >
              {headerMenuConfig &&
                headerMenuConfig.length > 0 &&
                headerMenuConfig.map((nav, index) => {
                  if (nav.children && nav.children.length > 0) {
                    return (
                      <SubMenu key={index} title={<span>{nav.name}</span>}>
                        {nav.children.map(item => {
                          const linkProps = {}
                          if (item.external) {
                            if (item.newWindow) {
                              linkProps.target = '_blank'
                            }
                            linkProps.href = item.path
                            return (
                              <Item key={item.path}>
                                <a {...linkProps}>
                                  <span>{item.name}</span>
                                </a>
                              </Item>
                            )
                          }
                          linkProps.to = item.path
                          return (
                            <Item key={item.path}>
                              <Link {...linkProps}>
                                <span>{item.name}</span>
                              </Link>
                            </Item>
                          )
                        })}
                      </SubMenu>
                    )
                  }
                  const linkProps = {}
                  if (nav.external) {
                    if (nav.newWindow) {
                      linkProps.target = '_blank'
                    }
                    linkProps.href = nav.path
                    return (
                      <Item key={nav.path}>
                        <a {...linkProps}>
                          <span>{nav.name}</span>
                        </a>
                      </Item>
                    )
                  }
                  linkProps.to = nav.path
                  return (
                    <Item key={nav.path}>
                      <Link {...linkProps}>
                        <span>{nav.name}</span>
                      </Link>
                    </Item>
                  )
                })}
            </Menu>
          </div>
        </div>
      </Header>
    )
  }
}
export default withRouter(CbHeader)
const style = {
  header: {
    background: '#ffffff'
  }
}
