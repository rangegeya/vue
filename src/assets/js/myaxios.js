import axios from 'axios'
var myaxios = {}
myaxios.install = function (Vue) {
  var axiosobj = axios.create({
    baseURL: 'http://121.36.6.20:81/test2/public/index.php/',
    headers: {
      'Authorization': window.localStorage.getItem('token')
    }
  })
  Vue.prototype.$myHttp = axiosobj
}
export default myaxios
