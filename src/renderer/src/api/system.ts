import { http } from '@renderer/utils/http/request'

export type RefreshTokenResult = {
  code: string
  data: {
    /** `token` */
    access_token: string
    /** `token_标识` */
    token_type: string
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires_in: number
    expires: Date
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string
  }
  message: string
}

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>(
    'post',
    '/token/auth/oauth/token?client_id=slconsole&client_secret=secret&grant_type=password&username=NanChangGongWuBu&password=63771258',
    { data }
  )
}
export const refreshTokenApiTTT = (data?: object) => {
  return http.request<RefreshTokenResult>('post', '/api/auth/oauth/token?', { data })
}
