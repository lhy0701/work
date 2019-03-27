import React, { Component } from 'react'

export default class CbLogo extends Component {
  render() {
    return (
      <div style={styles.container}>
        <img src={require('./image/logo.png')} style={styles.logo} alt="北京车兄弟科技有限公司" />
      </div>
    )
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '20px'
  },
  logo: {
    width: '190px',
    marginRight: '16px',
    marginTop: '5px'
  }
}
