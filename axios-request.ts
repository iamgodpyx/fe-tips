import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { mueRequestFail, mueResponseFail } from '@/utils';
import { MessageText } from '@/constants';

interface CommonParams {
    aid: number;
}

declare interface IResponse {
    code: number;
    message: string;
    data?: any;
    log_id: string;
}

export const COMMON_PARAMS: CommonParams = {
    aid: 0,
};

export const client = axios.create({
    timeout: 60 * 1000,
    transformRequest: axios.defaults.transformRequest,
} as AxiosRequestConfig);

export interface RequestConfig extends AxiosRequestConfig {
    retry?: number;
    form?: boolean;
}

export default function request<T, S extends IResponse>(
    url: string,
    method: 'get' | 'post' = 'get',
    useJSON = false,
    config: RequestConfig = {},
): (params?: T) => Promise<S> {
    return (params?: T) => {
        const requestConfig: RequestConfig = {
            headers: {},
            method,
            url,
            ...config,
        };

        if (method === 'get') {
            requestConfig.params = params;
        } else if (useJSON) {
            requestConfig.data = JSON.stringify(params);
            requestConfig.headers && (requestConfig.headers['content-type'] = 'application/json');
        } else if (requestConfig.form) {
            requestConfig.data = params;
        } else {
            requestConfig.data = qs.stringify(params);
        }

        let retryTimes = (requestConfig.retry || 0) + 1;

        return new Promise(async (resolve, reject) => {
            while (retryTimes--) {
                try {
                    const resp = await client(requestConfig);
                    const { status, statusText, data } = resp || {};

                    if (status === 200 && data) {
                        if (data.code !== 0) {
                            if (data.code >= -1999 && data.code <= -100) {
                                // 不面向用户展示
                                data.message = MessageText.netError;
                            }
                            mueResponseFail(url, resp.data);
                        }
                        resolve(data);
                        return;
                    }
                    mueRequestFail(url, data, {
                        resp_status: status,
                        resp_text: statusText,
                    });
                    reject(data);
                    return;
                } catch (err: any) {
                    if (err?.response) {
                        mueRequestFail(url, null, {
                            resp_status: err.response.status,
                            resp_text: err.response.statusText,
                        });
                    } else {
                        mueRequestFail(url);
                    }
                    if (retryTimes === 0) {
                        reject(err);
                    }
                }
            }
        });
    };
}

export async function requestFn<T>(fn: () => Promise<T>, tag = '', retryTime = 3, timeout = 5000) {
    let times = retryTime;
    let res: T | null = null;

    while (times--) {
        try {
            res = await Promise.race<T>([
                fn(),
                new Promise<T>((resolve, reject) => {
                    setTimeout(() => {
                        reject(new Error(`#requestFn:: tag: ${tag}, executed timeout: ${timeout} ms`));
                    }, timeout);
                }),
            ]);
            return res;
        } catch (error: any) {
            mueRequestFail(tag, res, { error });
            console.log(`requestFn fail:: ${error}`);
        }
    }

    return null;
}



// 文件上传
export const uploadCoverApi = '/api/author/book/upload_pic/v0/';
export const uploadCover = request(uploadCoverApi, 'post', false, { form: true });


export const getSignInfo = request<GetSignBasicInfoRequest, GetSignBasicInfoResponse>(
    '/api/author/sign/basic_info/v0/',
    'get',
    false,
    { retry: 2 },
);


// json返回数据
export const getBookReadRate = request<any, GetReadRateStatsResponse>(
    '/api/author/statistic/book_read_rate/v0',
    'post',
    true,
);