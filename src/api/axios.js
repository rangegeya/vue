import axios from 'axios'
import qs from 'qs'
axios.defaults.baseURL = 'http://121.36.6.20/test2/public/index.php/'
// axios.defaults.withCredentials = true
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers['Authorization'] = window.localStorage.getItem('token')

axios.defaults.transformRequest = data => {
  if (!data) return data
  return qs.stringify(data)
}
axios.interceptors.response.use(response => response, reason => Promise.reject(reason))
export default axios
