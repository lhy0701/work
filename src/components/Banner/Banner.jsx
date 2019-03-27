import React, { Component } from 'react'
import { Carousel } from 'antd'
class Banner extends Component {
  render() {
    return (
      <Carousel autoplay speed={1000}>
        <div>
          <img style={style.banner} src={require('./images/banner-home.png')} alt="北京车兄弟有限公司" />
        </div>
        <div>
          <img style={style.banner} src={require('./images/banner.png')} alt="北京车兄弟有限公司" />
        </div>
      </Carousel>
    )
  }
}
export default Banner

const style = {
  banner: {
    width: '100%',
    height: '100%'
  }
}
