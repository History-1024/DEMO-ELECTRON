import Cookies from 'js-cookie'
export interface DataInfo<T> {
  /** token */
  access_token: string
  /** `access_token`的过期时间（时间戳） */
  expires: T
  /** `后端给返回的超时秒数 */
  expires_in: number
  /** 用于调用刷新accessToken的接口时所需的token */
  refreshToken: string
  /** 用户名 */
  username?: string
  /** 当前登陆用户的角色 */
  roles?: Array<string>
}

export const userKey = 'user-info'
export const TokenKey = 'authorized-token'
/** 获取`token` */
export function getToken(): DataInfo<number> {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return Cookies.get(TokenKey) ? JSON.parse(Cookies.get(TokenKey)) : ''
}
/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return 'bearer ' + token
}

/**
 * @description 设置`token`以及一些必要信息
 * 将`access_token`、`expires`这两条信息放在key值为authorized-token的cookie里（过期自动销毁）
 */
export function setToken(data: DataInfo<Date>) {
  let expires = 0
  const { access_token } = data
  expires = new Date(data.expires).getTime() // 如果后端直接设置时间戳，将此处代码改为expires = data.expires，然后把上面的DataInfo<Date>改成DataInfo<number>即可

  const cookieString = JSON.stringify({ access_token, expires })
  expires > 0
    ? Cookies.set(TokenKey, cookieString, {
        expires: data.expires
      })
    : Cookies.set(TokenKey, cookieString)
}
