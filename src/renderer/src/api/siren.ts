import { http } from '@renderer/utils/http/request'

//列车报警-列表
interface RESPData {
  code: string
  message: string
  data: []
}
export const doPostTrainData = (data?: object) => {
  return http.request<RESPData>('post', '/slconsole/login/trainDataLevelCount', {
    data
  })
}

//线路报警

export const doPostLineData = (data?: object) => {
  return http.request<RESPData>('post', '/slconsole/login/lineDataLevelCount', {
    data
  })
}
