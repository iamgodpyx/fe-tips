/**
 * 上传本地文件转base64
 * @param {File} file 文件流
 * @param {Function} callback 回调函数
 */
 export const fileToBase64 = (file: File, callback: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        if (e?.target) {
            callback(e.target.result);
        }
    };
};