;(function() {
  window.onload = function() {
    document.querySelector('.uploadFile img').onclick = function() {
      document.querySelector('.imageUpload').click()
    }
  }
  const uploadImages = {
    formFile: new FormData(),
    // 图片数据流
    imageMsg: [],
    // 大小
    maxSize: 1024 * 1024 * 2,
    // 获取节点
    $(dom) {
      return document.querySelector(dom)
    },
    /**
     * 添加图片到数据流
     *
     * @param { Array } files input files
     */
    filters: function(files, name) {
      ;[...files].forEach(element => {
        this.imageMsg.push({
          name: element.name,
          src: this.getFileUrl(element),
          file: element
        })
        this.formFile.append(name, element)
      })
    },
    /**
     * 获取文件路径
     * @param { Object } file
     */
    getFileUrl: function(file) {
      let url = null
      if (window.createObjectURL !== undefined) {
        url = window.createObjecURL(file)
      } else if (window.URL.createObjectURL !== undefined) {
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    }
  }

  uploadImages.$('.imageUpload').onchange = function() {
    if (!this.files[0]) {
      return
    }
    const files = this.files
    const fileSize = this.files[0] && this.files[0].size
    // 图片多张
    if (uploadImages.imageMsg.length >= 2) {
      return alert('最多只能上传2张图片')
    }
    // 大小限制
    if (uploadImages.maxSize < fileSize) {
      return alert('上传图片超出大小')
    }
    // 格式限制
    if (this.files[0].type != 'image/png' && this.files[0].type != 'image/jpeg' && this.files[0].type != 'image/gif') {
      return alert('图片上传格式不正确')
    }
    uploadImages.filters(files, 'files')
    let image = document.createElement('img')
    image.src = uploadImages.getFileUrl(this.files[0])
    document.body.appendChild(image)
  }

  window.uploadImages = uploadImages
})()
