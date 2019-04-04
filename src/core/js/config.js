let config = {
  service: '',
  domain: ''
}

if (__DEV__) {
  config = {
    service: '/test/',
    // service: '/prod/',
    domain: ''
  }
}
if (__TEST__) {
  config = {
    service: '/backends/',
    domain: ''
  }
}
if (__PRODUCTION__) {
  config = {
    service: '/backends/',
    domain: ''
  }
}

export default config
