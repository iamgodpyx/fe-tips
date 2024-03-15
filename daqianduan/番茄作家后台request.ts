import axios, { AxiosRequestConfig, Method, AxiosResponse } from 'axios';
import qs from 'querystring';
import { mueRequestFail, mueResponseFail } from './monitor';
import urlMap from '@constants/url';

// 接口加密
import { get_a, get_A, get_res } from './encrypt';
import { transformKeyToLowercase } from './util';

// 需要加密的接口
const EncryptUrl = [
    urlMap.GET_INCOME_GIFT_MONTHLY,
    urlMap.INCOME_BOOK_SUMMARY,
    urlMap.INCOME_BOOK_DAILY,
    urlMap.INCOME_BOOK_MONTHLY,
    urlMap.GET_INCOME_GIFT_LIST,
]

export interface IRequestOptions<T> {
    url: string;
    method?: Method;
    params?: T | {};
    useCustomData?: boolean;
    customData?: FormData | {};
}

// 统一处理返回错误码
axios.interceptors.response.use((response: AxiosResponse<any>) => {
    const { data = {} } = response;
    const { code = 0 } = data;
    if (code >= -1999 && code <= -100) {
        data.message = '网络请求失败，请稍后重试';
    }

    return response;
})

export function request<Req, Resp>({
    method = 'get',
    url = '',
    params = {},
    useCustomData = false,
    customData = {},
}: IRequestOptions<Req>): Promise<Resp> {
    const data = method.toUpperCase() === 'GET' ? { params } : { data: qs.stringify(params) };

    return new Promise((resolve, reject) => {
        const config: AxiosRequestConfig = {
            method,
            url,
            ...data,
        };
        if (method.toUpperCase() === 'POST') {
            config.headers = {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            };
            if (useCustomData) {
                config.data = customData;
            }
        }
        
        // 部分接口需要加密处理
        let a;
        if (EncryptUrl.includes(url)) {
            // 增加时间戳解决ie请求缓存的问题
            config.params['sec_time'] = new DataTransfer().getTime();
            a = get_a();
            const A = get_A(a);
            if (config.headers) {
                config.headers['X-Muye-Encrypt-Key'] = A;
            } else {
                config.headers = {
                    'X-Muye-Encrypt-Key': A,
                }
            }
        };

        axios({
            ...config
        })
        .then((resp) => {
            // http header大小写不敏感，为避免问题，进行小写转换兜底
            resp.headers = transformKeyToLowercase(resp.headers);

            // 加密接口会有 x-muye-encrypt-downgrade 字段
            // 如果有 x-muye-encrypt-downgrade 且值为 '0'，则需要解密
            const encryptDowngrade = resp.headers['x-muye-encrypt-downgrade'];
            if (encryptDowngrade && Number(encryptDowngrade) === 0) {
                const B = resp.headers['x-muye-encrypt-key'];
                resp.data = get_res(B, a, resp.data);
            }
            if (resp.data && resp.status === 200) {
                // 过滤游客的错误情况， -3表示未登录
                if (resp.data.code !== 0 && resp.data.code !== -3) {
                    mueRequestFail(url, resp);
                }
                resolve(resp.data);
            } else {
                mueRequestFail(url, resp, {
                    resp_status: resp.status,
                    resp_text: resp.statusText,
                });
                reject(resp.data);
            }
        })
        .catch((err) => {
            if (err.response) {
                mueRequestFail(url, null, {
                    resp_status: err.response.status,
                    resp_text: err.response.statusText,
                });
                reject(err.response.data);
            } else {
                mueRequestFail(url);
                reject(err);
            }
        })
    })
}