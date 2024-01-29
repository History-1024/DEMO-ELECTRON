import { http } from '@renderer/utils/http/request'
interface RESPData {
  code: string
  message: string
  data: []
}
//密集区段数据统计-列表
export const doPostDenseList = (data?: object) => {
  return http.request<RESPData>('post', '/slconsole/login/denseSectionStatistics', {
    data
  })
}
