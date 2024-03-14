import { API_BASE, inApp } from '@/constants/share';
import { dataUrlToFile } from './file';
import { UPLOAD_API, uploadPhoto } from '@/service/api';
import bridge from '@bridge/worldance';


export const uploadPhoto = request<UploadPicRequest, UploadPicResponse>(UPLOAD_API, 'POST', false, {
    form: true,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});


/**
 * 单个上传通用方法
 */
export const upload = async (input: string | File) => {
    const isB64 = typeof input === 'string';
    if (inApp && isB64) {
        return bridge.net.uploadData({
            type: 'image',
            url: `${API_BASE}${UPLOAD_API}`,
            base64: input,
        });
    }

    let file = input;

    if (isB64) {
        file = dataUrlToFile(input);
    }

    const formData = new FormData();
    formData.append('file', file);
    // eslint-disable-next-line
    return uploadPhoto(formData as any);
};
