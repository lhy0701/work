import React, { Component } from 'react'
import { Layout } from 'antd'
import CxdHeader from '../../components/Header'
import CxdFooter from '../../components/Footer'

class HeaderFooter extends Component {
  render() {
    return (
      <Layout>
        <CxdHeader />
        <div>{this.props.children}</div>
        <CxdFooter />
      </Layout>
    )
  }
}

export default HeaderFooter
