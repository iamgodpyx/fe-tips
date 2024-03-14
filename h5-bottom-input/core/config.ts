import { VisualKeyboardDetectorProps } from '../../_helpers/utils/keyboard';

export interface BottomInputInitConfig {
    isIOS?: (...args: any) => boolean;
    px2rem?: (px: number) => number;
    getPX?: (px: number) => number;
    onKeyboardShow?: VisualKeyboardDetectorProps['onKeyboardShow'];
    onKeyboardHide?: VisualKeyboardDetectorProps['onKeyboardHide'];
}

let config: BottomInputInitConfig | null = null;

export const getConfig = () => config;

export const setConfig = (_config: BottomInputInitConfig | null) => {
    config = _config;
    return config;
};
