/**
 * 多张图片上传
 * 支持浏览器&APP
 */
 import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
 import { ImagePreview, Toast } from '@arco-design/mobile-react-serial-i18n';
 import { useTranslation } from '@ies/intl-react-plugin';
 import bridge from '@bridge/worldance';
 import DEFAULT_COVER from '@/static/image/cover.png';
 import FAIL_COVER from '@/static/image/no-network.gif';
 import DELETE_PIC from '@/static/image/delete-pic.png';
 import { API_BASE, inApp } from '@/constants/browser';
 import { fileToBase64 } from '@/utils';
 import { multipleUploadPhoto, MULTIPLE_UPLOAD_API } from '@/service/api';
 import { MessageText } from '@/constants/const';
 import { cloneSplitArr } from './utils';
 import { BatchUploadPicData } from '@typings/toutiao_novel_origin_overseas_bookapi';
 
 import './index.less';


 export const cloneSplitArr = (arr:any[], index: number): any[] => {
    const tempArr = [...arr];
    tempArr.splice(index, 1);
    return tempArr;
}
 
 export type imgListRefType = {
     imgList: BatchUploadPicData[];
     uploading: boolean;
     hasError: boolean;
     imgIdListRef: number[];
     netWorkError: React.MutableRefObject<boolean>;
 };
 
 
 interface IProps {
     // 是否展示删除图片按钮
     showDelete?: boolean;
     // 是否展示upload图标
     showUpload?: boolean;
     // 多选最多几张图片
     multiple: number;
     // 点击是否蒙层预览
     hasMasking?: boolean;
     // 选择图片回调
     onSelect?: () => void;
     extraInfo?: boolean;
     // 图片上传出错回调
     onError?: (val: boolean) => void;
     getAsyncResult?: (func: (val: any[]) => Promise<any>, list: any[]) => Promise<void>;
 }
 
 export type AppImageRsp = {
     path: string;
     base64Content: string;
 };
 
 // 自增id，使预览图片与实际图片对应
 let uploadId = 0;
 
 const IMG_TYPE = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
 
 const IMG_MAX_SIZE = 2 * 1024; // KB
 
 const Upload = (
     { showDelete, multiple, hasMasking, onSelect, extraInfo, showUpload, onError, getAsyncResult }: IProps,
     ref: ForwardedRef<imgListRefType>,
 ) => {
     // 预览图片
     const [previewImages, setPreviewImages] = useState<any[]>([]);
     // 图片id list
     const imgIdListRef = useRef<number[]>([]);
     // 上传的一批图片的id list
     const startIdListRef = useRef<number[]>([]);
     // 上传图片信息
     const [itemInfo, setItemInfo] = useState<{ itemList: BatchUploadPicData[]; uploading: boolean }>({
         itemList: [],
         uploading: false,
     });
 
     const netWorkError = useRef(false);
 
     // 预览图片索引
     const [openIndex, setOpenIndex] = useState(-1);
     const imgListLength = previewImages.length;
     const hasError = useMemo(() => itemInfo.itemList.some(item => !item.is_success), [itemInfo]);
 
     const { i18n } = useTranslation();
 
     useEffect(() => {
         onError?.(itemInfo.itemList.some(item => !item.is_success));
     }, [itemInfo]);
 
     const requestUpload = async (list: Array<{ path: string }>) => {
         return bridge.net.uploadDataV2({
             type: 'image',
             url: `${API_BASE}${MULTIPLE_UPLOAD_API}`,
             fileList: list,
         });
     };
 
     const handleSelectByWeb = async (file: FileList) => {
         try {
             const list = Array.from(file);
             const length = list.length;
 
             // 校验
             await verifyImg(list, length);
 
             // 预览
             await previewImgByWeb(list);
 
             // 上传
             if (getAsyncResult) {
                 getAsyncResult?.(uploadByWeb, list);
             } else {
                 uploadByWeb(list);
             }
         } catch (error) {
             console.log(error);
         }
     };
 
     const verifyImg = async (list: File[], length: number) => {
         // 超出限制数量
         if (length > multiple - imgListLength) {
             Toast.info(i18n.t('upload_pic_max'));
             throw Error();
         }
 
         // 大小检验
         for (let i = 0; i < length; i++) {
             const { size } = list[i];
             const isOverSize = Number(size) / 1024 > IMG_MAX_SIZE;
             if (isOverSize) {
                 Toast.info(i18n.t('create_cover_size'));
                 throw Error();
             }
         }
 
         // 异步并行，图片文件检查（把其他文件后缀改成图片格式的情况）
         const promiseLists = list.map(item => {
             return new Promise((resolve, reject) => {
                 fileToBase64(item, (base64Data: string) => {
                     const imgObj = new Image();
                     imgObj.src = base64Data;
                     imgObj.onload = () => {
                         resolve(true);
                     };
                     imgObj.onerror = () => {
                         Toast.info(i18n.t('cover_file_fail'));
                         reject();
                     };
                 });
             });
         });
 
         await Promise.all(promiseLists);
     };
 
     const previewImgByWeb = async (list: File[]) => {
         startIdListRef.current = [];
         // 展示预览图
         const images = list.map(file => {
             startIdListRef.current = startIdListRef.current.concat(uploadId);
             imgIdListRef.current = imgIdListRef.current.concat(uploadId);
             uploadId++;
             return URL.createObjectURL(file);
         });
 
         setPreviewImages(pre => [...pre, ...images]);
     };
 
     const uploadByWeb = async (list: File[]) => {
         try {
             netWorkError.current = false;
             // 当次新增的id
             const startIdList = startIdListRef.current;
             const formData = new FormData();
             list.forEach(item => {
                 formData.append('image', item);
             });
             setItemInfo(pre => ({ itemList: pre.itemList, uploading: true }));
             const { code, data } = await multipleUploadPhoto(formData as any);
 
             if (code !== 0) {
                 throw Error();
             }
 
             // 上传图片途中，点击了取消图片
             const imgList = data.pic_data_list.filter((item, index) => {
                 return imgIdListRef.current.includes(startIdList[index]);
             });
             setItemInfo(pre => ({ itemList: [...pre.itemList, ...imgList], uploading: false }));
         } catch (error) {
             // 网络错误，清空预览图片
             netWorkError.current = true;
             console.log(error);
             setPreviewImages([]);
             imgIdListRef.current = [];
             setItemInfo({ itemList: [], uploading: false });
             Toast.info(MessageText.netError);
         }
     };
 
     const selectImgByNative = async () => {
         const { code, imageList }: any = await bridge.view.selectImageV2({
             count: multiple - imgListLength,
             needCompression: true,
             // 图片大小限制2m
             maxSize: 2,
         });
 
         if (code !== 0) {
             throw Error();
         }
 
         return JSON.parse(imageList);
     };
 
     const previewImgByNative = async (list: any[]) => {
         startIdListRef.current = [];
 
         // 展示预览图
         const images = list.map((item: AppImageRsp) => {
             startIdListRef.current = startIdListRef.current.concat(uploadId);
             imgIdListRef.current = imgIdListRef.current.concat(uploadId);
 
             uploadId++;
             return item;
         });
 
         setPreviewImages(pre => [...pre, ...images]);
     };
 
     const uploadByNative = async (resultList: AppImageRsp[]) => {
         try {
             netWorkError.current = false;
             if (resultList?.length === 0) {
                 return;
             }
             // 当次新增的id
             const startIdList = startIdListRef.current;
             setItemInfo(pre => ({ itemList: pre.itemList, uploading: true }));
             const requestList = resultList.map((item: AppImageRsp) => ({ path: item.path }));
             const { code, data } = await requestUpload(requestList);
 
             if (code !== 0) {
                 throw Error();
             }
             // 上传图片途中，点击了取消图片
             const imgList = data.pic_data_list.filter((item: BatchUploadPicData, index: number) => {
                 return imgIdListRef.current.includes(startIdList[index]);
             });
             setItemInfo(pre => ({ itemList: [...pre.itemList, ...imgList], uploading: false }));
         } catch (error) {
             netWorkError.current = true;
             setPreviewImages([]);
             imgIdListRef.current = [];
             setItemInfo({ itemList: [], uploading: false });
             console.log('error', error);
             Toast.info(MessageText.netError);
         }
     };
 
     const handleSelectByNative = async () => {
         try {
             if (extraInfo) {
                 onSelect?.();
                 return;
             }
             const resultList = await selectImgByNative();
 
             await previewImgByNative(resultList);
 
             // 上传图片
             if (getAsyncResult) {
                 getAsyncResult?.(uploadByNative, resultList);
             } else {
                 uploadByNative(resultList);
             }
         } catch (error) {
             Toast.info(MessageText.netError);
             console.log('error', error);
         }
     };
 
     const remove = (index: number) => {
         // 图片id列表中去除
         imgIdListRef.current = cloneSplitArr(imgIdListRef.current, index);
         // 去除预览图片
         setPreviewImages(pre => cloneSplitArr(pre, index));
         if (itemInfo.itemList[index]) {
             setItemInfo(pre => ({ itemList: cloneSplitArr(pre.itemList, index), uploading: pre.uploading }));
         }
     };
 
     const handleClickImg = (index: number) => {
         setOpenIndex(index);
     };
 
     useImperativeHandle(ref, () => ({
         imgList: itemInfo.itemList,
         uploading: itemInfo.uploading,
         hasError,
         imgIdListRef: imgIdListRef.current,
         netWorkError,
     }));
 
     return (
         <div className="upload-multiple">
             {previewImages.length
                 ? previewImages.map((item, index) => (
                       <div className="upload-multiple-picker" key={index} onClick={() => handleClickImg(index)}>
                           {/* 图片上传失败时，展示错误上传图片 */}
                           <img
                               src={
                                   // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
                                   itemInfo.itemList?.[index]?.is_success === false
                                       ? FAIL_COVER
                                       : (inApp ? item.base64Content : item) || DEFAULT_COVER
                               }
                           />
                           {showDelete && (
                               <div className="upload-multiple-delete" onClick={() => handleClickImg(index)}>
                                   <div
                                       className="delete-icon"
                                       onClick={e => {
                                           e.stopPropagation();
                                           remove(index);
                                       }}
                                   >
                                       <img src={DELETE_PIC} />
                                   </div>
                               </div>
                           )}
                       </div>
                   ))
                 : null}
             {previewImages.length < multiple && showUpload ? (
                 inApp ? (
                     <div className="upload-multiple-tool" onClick={handleSelectByNative} />
                 ) : (
                     <div className="upload-multiple-tool">
                         <input
                             type="file"
                             multiple
                             accept={IMG_TYPE.join(',')}
                             onChange={e => {
                                 handleSelectByWeb(e.target.files!);
                             }}
                             onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                                 e.currentTarget.value = '';
                             }}
                         />
                     </div>
                 )
             ) : null}
             {hasMasking && (
                 <ImagePreview
                     close={() => setOpenIndex(-1)}
                     openIndex={openIndex}
                     images={previewImages.map((item, index) => ({
                         src:
                             // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
                             itemInfo.itemList?.[index]?.is_success === false
                                 ? FAIL_COVER
                                 : inApp
                                 ? item.base64Content
                                 : item,
                     }))}
                 />
             )}
         </div>
     );
 };
 
 export default forwardRef(Upload);
 