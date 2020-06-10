// export function createAPI (options = {}) {
//   // return this.$myHttp.post('/create', options)
//   return this.$myHttp({
//     url: 'insert_topic',
//     method: 'post',
//     data: options,
//     headers: {
//       'Authorization': window.localStorage.getItem('token')
//     }
//   })
// }
import axios from './axios'
export function createAPI (options = {}) {
  return axios.post('/insert_topic', options)
}

export function createPanDuanAPI (options = {}) {
  return axios.post('/judge_topic', options)
}

export function selectAPI (options) {
  return axios.get('/id_qus?id=' + options)
}
// export function queryList (params = {}) {
//   return this.$myHttp.get('/query', {
//     params
//   })
// }
