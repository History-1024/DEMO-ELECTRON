import { http } from '@renderer/utils/http/request'
interface RepeatInfo {
  gongWuDuan: string
  lineName: string
  lineNum: number
  xingBie: number
  repeatMergeCounts: number
  repeatCount: number
  chuizhiMax: number
  shuipingMax: number
}
export type DoPostGetDataResult = {
  code: string
  data: {
    duanRepeatCounts: Array<object>
    lineRepeatCounts: Array<object>
    repeatInfoList: Array<RepeatInfo>
  }
  message: string
}

//重复病害统计-列表
export const doPostGetData = (data?: object) => {
  return http.request<DoPostGetDataResult>('post', '/slconsole/login/statisticsRepeatErJi', {
    data
  })
}
export const doGetTest = () => {
  return http.request('get', '/slconsole/login/test')
}

//大致病害统计-列表
export const doPostRepeatLargeValue = (data?: object) => {
  return http.request<DoPostGetDataResult>('post', '/slconsole/login/statisticsRepeatLargeValue', {
    data
  })
}
