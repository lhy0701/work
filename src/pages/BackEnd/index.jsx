import React, { Component } from 'react'
import Banner from '../../components/Banner'
class Aboutus extends Component {
  constructor() {
    super()
    this.state = {
      count: 100
    }
    this.getCookie = this.getCookie.bind(this)
  }
  getCookie() {
    if (window.localStorage.count) {
      window.localStorage.count = window.localStorage.count * 1 + 1
      return window.localStorage.count
    } else {
      window.localStorage.count = 100
    }

    return this.state.count
  }
  componentDidMount() {
    this.setState({
      count: this.getCookie()
    })
  }
  render() {
    return (
      <div>
        <Banner />
        <div style={style.wrap}>
          <span>您是第 {this.state.count} 位访问者</span>
        </div>
      </div>
    )
  }
}
export default Aboutus
const style = {
  img: {
    width: '100%',
    minWidth: '1300px'
  },
  wrap: {
    height: '250px',
    textAlign: 'center',
    lineHeight: '250px',
    fontSize: '24px'
  }
}
