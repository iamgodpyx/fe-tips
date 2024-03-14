import { setConfig, BottomInputInitConfig } from './config';

/**
 * 渲染环境相关需要提前注入
 */
export const init = (config: BottomInputInitConfig) => {
    setConfig(config);
};
