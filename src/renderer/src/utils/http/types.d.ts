import { Method, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'

export type resultType = {
  accessToken?: string
}

export type RequestMethods = Extract<
  Method,
  'get' | 'post' | 'put' | 'delete' | 'patch' | 'option' | 'head'
>

export interface SLHttpError extends AxiosError {
  isCancelRequest?: boolean
}

export interface SLHttpResponse extends AxiosResponse {
  config: SLHttpRequestConfig
}

export interface SLHttpRequestConfig extends AxiosRequestConfig {
  beforeRequestCallback?: (request: SLHttpRequestConfig) => void
  beforeResponseCallback?: (response: SLHttpResponse) => void
}

export default class PureHttp {
  request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: SLHttpRequestConfig
  ): Promise<T>
  post<T, P>(url: string, params?: T, config?: SLHttpRequestConfig): Promise<P>
  get<T, P>(url: string, params?: T, config?: SLHttpRequestConfig): Promise<P>
}
