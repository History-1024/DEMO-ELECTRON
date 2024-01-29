import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { SLHttpError, RequestMethods, SLHttpResponse, SLHttpRequestConfig } from './types'
import { getToken, formatToken } from '@renderer/utils/auth'
import { RefreshTokenResult } from '@renderer/api/system'
import { useAppHook } from '@renderer/store/modules/system'

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  baseURL: '/sanLing',
  // 请求超时时间
  timeout: 300000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  }
}

class SLHttp {
  constructor() {
    this.httpInterceptorsRequest()
    this.httpInterceptorsResponse()
  }
  /** token过期后，暂存待执行的请求 */
  private static requests = []
  /** 防止重复刷新token */
  private static isRefreshing = false
  /** 初始化配置对象 */
  private static initConfig: SLHttpRequestConfig = {}
  /** 保存当前Axios实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig)
  /** 重连原始请求 */
  private static retryOriginalRequest(config: SLHttpRequestConfig) {
    return new Promise((resolve) => {
      SLHttp.requests.push((token: string) => {
        config.headers!['Authorization'] = formatToken(token)
        resolve(config)
      })
    })
  }
  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    SLHttp.axiosInstance.interceptors.request.use(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (config: SLHttpRequestConfig): Promise<any> => {
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof config.beforeRequestCallback === 'function') {
          config.beforeRequestCallback(config)
          return config
        }
        if (SLHttp.initConfig.beforeRequestCallback) {
          SLHttp.initConfig.beforeRequestCallback(config)
          return config
        }
        /** 请求白名单，放置一些不需要token的接口（通过设置请求白名单，防止token过期后再请求造成的死循环问题） */
        const whiteList = [
          '/token/auth/oauth/token?client_id=slconsole&client_secret=secret&grant_type=password&username=NanChangGongWuBu&password=63771258',
          '/login'
        ]
        return whiteList.find((url) => {
          return url === config.url
        })
          ? config
          : new Promise((resolve) => {
              //获取token
              const data = getToken()
              //token存在
              if (data) {
                const now = new Date().getTime()
                //计算 token 的过期时间是否小于等于当前时间戳
                const expired = data.expires - now <= 0
                if (expired) {
                  //检查是否在刷新token
                  if (!SLHttp.isRefreshing) {
                    SLHttp.isRefreshing = true
                    // token过期刷新
                    useAppHook()
                      .handRefreshToken({ refreshToken: data.refreshToken })
                      .then((res: RefreshTokenResult) => {
                        const token = res.data.access_token
                        config.headers['Authorization'] = formatToken(token)
                        SLHttp.requests.forEach((cb) => cb(token))
                        SLHttp.requests = []
                      })
                      .finally(() => {
                        SLHttp.isRefreshing = false
                      })
                  }
                  resolve(SLHttp.retryOriginalRequest(config))
                } else {
                  config.headers['Authorization'] = formatToken(data.access_token)
                  resolve(config)
                }
              } else {
                resolve(config)
              }
            })
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = SLHttp.axiosInstance
    instance.interceptors.response.use(
      (response: SLHttpResponse) => {
        const $config = response.config

        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof $config.beforeResponseCallback === 'function') {
          $config.beforeResponseCallback(response)
          return response.data
        }
        if (SLHttp.initConfig.beforeResponseCallback) {
          SLHttp.initConfig.beforeResponseCallback(response)
          return response.data
        }
        // return response.data
        return response.data
      },
      (error: SLHttpError) => {
        const $error = error
        $error.isCancelRequest = Axios.isCancel($error)
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error)
      }
    )
  }

  /** 通用请求工具函数 */
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: SLHttpRequestConfig
  ): Promise<T> {
    console.log('axiosConfig: ', axiosConfig)
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as SLHttpRequestConfig

    // 单独处理自定义请求/响应回调
    return new Promise<T>((resolve, reject) => {
      SLHttp.axiosInstance
        .request(config)
        .then((response: AxiosResponse<T>) => {
          resolve(response.data) // 返回响应数据而不是整个 AxiosResponse
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /** 单独抽离的post工具函数 */
  public post<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: SLHttpRequestConfig
  ): Promise<P> {
    return this.request<P>('post', url, params, config)
  }

  /** 单独抽离的get工具函数 */
  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: SLHttpRequestConfig
  ): Promise<P> {
    return this.request<P>('get', url, params, config)
  }
}

export const http = new SLHttp()
