import apiService from './api'

class BackEnd {
  getData(message) {
    return apiService.post('ERPService.svc/DoService', {
      Message: message
    })
  }
}

export default new BackEnd()
