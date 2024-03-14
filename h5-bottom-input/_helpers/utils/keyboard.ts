import EventEmitter from 'eventemitter3';
import debounce from 'lodash.debounce';

const ResizeDebounceTimout = 50;
const CloseResizeThreshold = 200;

// 生命周期为：focusin -> expand -> focusout -> collapse
export enum VisualKeyboardEvent {
    Focusin,
    Focusout,
    Expand,
    Collapse,
    StateChange,
    ViewportChange,
}

// 最小视口高度，否则视为程序错误；
const MinViewportHeight = 50;

export interface VisualKeyboardEventTypes {
    [VisualKeyboardEvent.Expand]: () => void;
    [VisualKeyboardEvent.Collapse]: () => void;
    [VisualKeyboardEvent.StateChange]: (isExpand: boolean) => void;
    [VisualKeyboardEvent.Focusin]: () => void;
    [VisualKeyboardEvent.Focusout]: () => void;
    [VisualKeyboardEvent.ViewportChange]: (height: number, oldHeight: number) => void;
}

interface Subscription {
    remove: () => void;
}

export interface VisualKeyboardDetectorProps {
    // eslint-disable-next-line camelcase
    onKeyboardShow?: (callback: (_: { keyboard_height: number }) => void) => Subscription;
    // eslint-disable-next-line camelcase
    onKeyboardHide?: (callback: () => void) => Subscription;
}

export class VisualKeyboardDetector extends EventEmitter<VisualKeyboardEventTypes> {
    isExpand = false;

    isStart = false; // 是否在生命周期中（focus - collapse）

    viewportHeight = 0;

    _unbind?: () => void;
    onKeyboardShowListener: VisualKeyboardDetectorProps['onKeyboardShow'];
    onKeyboardHideListener: VisualKeyboardDetectorProps['onKeyboardHide'];

    constructor(props?: VisualKeyboardDetectorProps) {
        super();
        if (typeof window === 'undefined') {
            return;
        }
        // 键盘监听 需要外部传入 本身不耦合 bridge
        const { onKeyboardShow, onKeyboardHide } = props || {};
        this.onKeyboardShowListener = onKeyboardShow;
        this.onKeyboardHideListener = onKeyboardHide;

        this.pollViewportHeight();
        this.on(VisualKeyboardEvent.StateChange, isExpand => {
            this.emit(isExpand ? VisualKeyboardEvent.Expand : VisualKeyboardEvent.Collapse);
        });

        this._bindStartListeners();

        this._bindExpandListeners();

        this._bindResizeListeners();

        this._bindCollapseListeners();
    }

    _setViewportHeight(height: number) {
        if (height < MinViewportHeight) {
            return;
        }
        if (height !== this.viewportHeight) {
            const oldHeight = this.viewportHeight;
            this.viewportHeight = height;
            this.emit(VisualKeyboardEvent.ViewportChange, height, oldHeight);
        }
    }

    _bindStartListeners() {
        const removeShow = this.onKeyboardShowListener
            ? // eslint-disable-next-line camelcase
              this.onKeyboardShowListener(({ keyboard_height }) => {
                  // eslint-disable-next-line camelcase
                  this._setViewportHeight(window.innerHeight - keyboard_height);
              })?.remove
            : () => {};
        const removeHide = this.onKeyboardHideListener
            ? this.onKeyboardHideListener(() => {
                  this._setViewportHeight(window.innerHeight);
              })?.remove
            : () => {};

        const onFocusin = () => {
            this.emit(VisualKeyboardEvent.Focusin);
        };
        const onFocusout = () => {
            this.emit(VisualKeyboardEvent.Focusout);
        };
        window.addEventListener('focusin', onFocusin, { passive: true });
        window.addEventListener('focusout', onFocusout, { passive: true });

        this._unbind = () => {
            window.removeEventListener('focusin', onFocusin);
            window.removeEventListener('focusout', onFocusout);
            removeShow();
            removeHide();
        };
    }

    _bindExpandListeners() {
        this.on(VisualKeyboardEvent.Focusin, () => {
            if (this.isStart) {
                return;
            }
            this.isStart = true;
            this.once(VisualKeyboardEvent.ViewportChange, () => {
                if (this.isStart && !this.isExpand) {
                    this.isExpand = true;
                    this.emit(VisualKeyboardEvent.StateChange, true);
                }
            });
        });
    }

    _bindCollapseListeners() {
        const setCollapse = () => {
            if (this.isStart && this.isExpand) {
                this.isExpand = false;
                this.isStart = false;
                this.emit(VisualKeyboardEvent.StateChange, false);
            }
        };
        let clear: () => void;

        // 在一段连续resize中，若resize高度超过base，立即触发Collapse
        const getOnResizeCollapse = () => {
            let baseHeight = this.viewportHeight;
            const setBaseHeight = debounce((height: number) => {
                baseHeight = height;
            }, ResizeDebounceTimout);

            return (height: number) => {
                if (height - baseHeight > CloseResizeThreshold) {
                    setCollapse();
                    clear();
                }
                setBaseHeight(height);
            };
        };

        this.on(VisualKeyboardEvent.Focusin, () => {
            const onViewportChange = getOnResizeCollapse();
            clear = () => this.off(VisualKeyboardEvent.ViewportChange, onViewportChange);
            this.on(VisualKeyboardEvent.ViewportChange, onViewportChange);
        });
    }

    _bindResizeListeners() {
        const getOnResize = (getHeight: () => number) => () => {
            this._setViewportHeight(getHeight());
        };

        this.on(VisualKeyboardEvent.Focusin, () => {
            const onVisualViewportResize = getOnResize(
                () => (window as any)?.visualViewport?.height,
            );
            const onWindowResize = getOnResize(() => window.innerHeight);
            window.addEventListener('resize', onWindowResize, { passive: true });
            (window as any).visualViewport?.addEventListener('resize', onVisualViewportResize, {
                passive: true,
            });
            this.once(VisualKeyboardEvent.Collapse, () => {
                window.removeEventListener('resize', onWindowResize);
                (window as any).visualViewport?.removeEventListener(
                    'resize',
                    onVisualViewportResize,
                );
            });
        });
    }

    unbind() {
        this._unbind?.();
    }

    /**
     * 防止安卓 webview 内 js 代码提前执行 获取不到 innerHeight 需要轮询
     */
    private pollViewportHeight = () => {
        const update = () => {
            this.viewportHeight = (window as any).visualViewport?.height || window.innerHeight;
            return this.viewportHeight;
        };
        if (!update()) {
            let pollCount = 0;
            const pollWindowHeight = () => {
                if (!update()) {
                    // poll the window innerHeight 10 times
                    pollCount += 1;
                    if (pollCount < 10) {
                        setTimeout(pollWindowHeight, 50);
                    }
                }
            };
            document.addEventListener('DOMContentLoaded', pollWindowHeight, false);
        }
    };
}

let detector: VisualKeyboardDetector;

export const getDetectorInstance = (props?: VisualKeyboardDetectorProps) => {
    if (!detector) {
        detector = new VisualKeyboardDetector(props);
    }
    return detector;
};
