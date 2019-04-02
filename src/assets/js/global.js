export const getUrlParams = () => {
    let url = window.location.href
    let options = {}
    url.replace(/[?&]([^#&?]+)=([^#&\?=]+)/g, (group, catchName, catchValue) => {
        // console.log(group)
        // console.log(catchName)
        // console.log(catchValue)
        options[catchName] = catchValue
        return ''
    })
    return options
}