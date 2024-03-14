import { CSSProperties } from 'react';
import EventEmitter from 'eventemitter3';
import { bindScrollIsolator } from '../../_helpers/utils/scroll-isolator';
import { composedPath } from '../../_helpers/utils/compose-path';

import {
    VisualKeyboardEvent,
    VisualKeyboardEventTypes,
    getDetectorInstance as _getDetectorInstance,
} from '../../_helpers/utils/keyboard';
import { getConfig } from './config';

export enum BottomInputEvent {
    Trigger = 'trigger', // 点击/触摸输入框容器
    Focus = 'focus', // 聚焦
    Blur = 'blur', // 失焦
    Show = 'show', // 输入框可见
    Hide = 'hide', // 输入框隐藏
    LoadingChange = 'loadingChange', // loading状态改变
}

export interface EventTypes {
    [BottomInputEvent.Trigger]: (e: Event) => void;
    [BottomInputEvent.Focus]: () => void;
    [BottomInputEvent.Blur]: () => void;
    [BottomInputEvent.Show]: (e: { compatible: boolean }) => void;
    [BottomInputEvent.Hide]: () => void;
    [BottomInputEvent.LoadingChange]: (isLoading: boolean) => void;
}

export interface BottomInputInitProps {
    container: HTMLDivElement; // 容器dom
    input: HTMLTextAreaElement; // 输入框dom
    trigger: HTMLDivElement; // 触发dom
    actions?: HTMLElement[]; // 操作按钮dom列表
    disabled?: boolean; // 是否禁用（禁用时禁止一切操作）
    /** 兜底兼容展示的时候 input 出现位置的样式 */
    compatibleStyle?: CSSProperties;
}

export const ShowTransitionDuration = 150;
export const CompatibleShowInputTimeout = 1000;
export const IgnoreKeyboardHeight = 200; // 低于此值被认为不是键盘弹出的高度

const isIOS = () => Boolean(getConfig()?.isIOS?.());

const getDetectorInstance = () =>
    _getDetectorInstance({
        onKeyboardShow: getConfig()?.onKeyboardShow,
        onKeyboardHide: getConfig()?.onKeyboardHide,
    });

export class SerialMobileBottomInput extends EventEmitter<EventTypes> {
    container: HTMLDivElement; // 容器dom

    input: HTMLTextAreaElement; // textarea dom

    actions: HTMLElement[]; // 操作区 dom list

    trigger: HTMLDivElement; // 触发元素

    isVisible = false;

    isLoading = false;

    disabled: boolean;

    _unbindListeners: (() => void)[] = [];

    _loadingPromiseCount = 0;

    _useCompatibleStyle = false;

    compatibleStyle: CSSProperties = {};

    constructor({
        input,
        container,
        trigger,
        actions = [],
        compatibleStyle = { top: 0 },
        disabled = false,
    }: BottomInputInitProps) {
        super();
        this.input = input;
        this.container = container;
        this.actions = actions;
        this.trigger = trigger;
        this.disabled = disabled;
        this.compatibleStyle = compatibleStyle;

        // 不允许绕过组件聚焦
        // eslint-disable-next-line no-param-reassign
        // input.readOnly = true;

        // dom上绑定监听器(focus, blur, touchend)
        this._bindDomListeners();
        // 绑定滚动拦截
        this._bindScrollIsolator();
        // 点击触发设置
        this._bindTrigger();
        // 判断启动兜底模式
        this._bindCompatibleShowInput();
        // 调整输入框位置
        this._bindAdjustContainer();
        // 键盘弹起时展示输入框
        this._bindSetVisibleOnExpand();
        // 失焦时延迟隐藏输入框
        this._bindDelayHideOnCollapse();
        // 屏蔽点击其他区域事件
        this._bindInterceptTouch();
    }

    // 触发键盘聚焦，返回true：触发聚焦，false：被拦截
    focus(): boolean {
        const { container, input, isVisible } = this;
        if (isVisible) {
            return false;
        }

        input.readOnly = false;

        // 如果是iOS，将输入挪到顶部，防止页面滚动
        if (isIOS()) {
            container.style.opacity = '0';
            container.style.top = '0';
            container.style.bottom = 'unset';
        } else {
            container.style.top = 'unset';
            container.style.bottom = '0';
        }
        // console.log('focus', document.activeElement, input, document.activeElement !== input);
        // 必须同步否则iOS不弹出软键盘
        input.focus();
        return true;
    }

    updateActions(actions: HTMLElement[]) {
        this.actions = actions;
    }

    // 触发容器隐藏，强制键盘收起（注意区别于blur，blur只会收起键盘）
    _hide() {
        const { isVisible, input, container } = this;
        // 防止由于手机方向改变等意外resize后，输入框消失但键盘不收起
        // Fixed ios不加这行，下次点击会意外的触发focus
        if (document.activeElement === this.input) {
            input.blur();
        }
        input.readOnly = true;
        container.style.opacity = '';
        const height = container.classList.contains('permanent')
            ? window.innerHeight
            : window.innerHeight + 150;
        container.style.top = `${height}px`;
        if (!isVisible) {
            return;
        }
        this.emit(BottomInputEvent.Hide);
        this.isVisible = false;
        // 等待opacity过渡结束
        setTimeout(() => {
            container.style.transitionProperty = '';
            container.style.top = '';
            container.style.bottom = '';
            container.style.height = '';
            container.style.opacity = '';
            this._useCompatibleStyle = false;
        }, ShowTransitionDuration);
    }

    // 传入promise函数，在promise间进入loading状态
    // loading间重复会等待最后一个promise完成
    wait(callback: () => Promise<void>) {
        this.isLoading = true;
        this.emit(BottomInputEvent.LoadingChange, this.isLoading);

        const promise = callback();
        this._loadingPromiseCount += 1;

        promise.finally(() => {
            this._loadingPromiseCount -= 1;
            if (!this._loadingPromiseCount) {
                this.isLoading = false;
                this.emit(BottomInputEvent.LoadingChange, this.isLoading);
                this._hide();
            }
        });
    }

    unbind() {
        this._unbindListeners.forEach(fn => fn());
    }

    _bindDomListeners() {
        // 点击顺序：touchstart -> touchend -> focus -> click
        // 长按顺序：touchstart -> focus -> touchend -> click
        // capture事件位于该事件前，但不影响不同事件顺序
        const onClickContainer = (e: MouseEvent) => {
            this.emit(BottomInputEvent.Trigger, e);
        };
        const onFocus = () => {
            // Fixed iOS有时多触发一次focus
            if (this.isVisible) {
                return;
            }
            // this.logs.push(`on focus ${Date.now()}`);
            this.emit(BottomInputEvent.Focus);
        };
        const onBlur = () => {
            this.emit(BottomInputEvent.Blur);
        };
        this.trigger.addEventListener('click', onClickContainer, { passive: false });
        this.input.addEventListener('focus', onFocus, { passive: true });
        this.input.addEventListener('blur', onBlur, { passive: true });

        this._unbindListeners.push(() =>
            this.trigger.removeEventListener('click', onClickContainer),
        );
        this._unbindListeners.push(() => this.input.removeEventListener('focus', onFocus));
        this._unbindListeners.push(() => this.input.removeEventListener('focus', onBlur));
    }

    _bindScrollIsolator() {
        this.on(BottomInputEvent.Show, () => {
            const inputElement = this.input;
            const clearScrollIsolator = bindScrollIsolator(
                this.container,
                ({ scrollInElement, eventInElement, hasScroll, event }) => {
                    if (!(eventInElement && (scrollInElement || !hasScroll))) {
                        event.preventDefault();
                        this.hide();
                    } else if (eventInElement && event.target !== inputElement) {
                        event.preventDefault();
                    }
                },
            );
            this.once(BottomInputEvent.Hide, () => {
                clearScrollIsolator();
            });
        });
    }

    // 触发元素点击/触摸事件
    _bindTrigger() {
        this.on(BottomInputEvent.Trigger, () => {
            // toast('onTouchend');
            const { disabled, isLoading, isVisible } = this;
            // 如果loading或disabled，任何情况都prevent
            if (disabled || isLoading) {
                return;
            }
            // 未展现则程序触发
            if (!isVisible) {
                this.focus();
            }
        });
    }

    // 拦截点击到容器内，输入框外的事件
    _bindInterceptTouch() {
        const preventTouch = (e: Event) => {
            const { disabled, isLoading, isVisible, input, actions } = this;
            const prevent = () => {
                e.preventDefault();
                e.stopPropagation();
            };
            // 如果loading或disabled，任何情况都prevent
            if (disabled || isLoading) {
                prevent();
                return;
            }

            const paths = composedPath(e);
            const set = new Set(actions);
            const isTouchActions = paths.some(p => p instanceof HTMLElement && set.has(p));
            const isTouchInput = paths.some(p => p === input);
            // 如果点击了按钮，则不处理；
            if (isTouchActions) {
                return;
            }
            // 除点击已展现的输入框外，其他形式全部屏蔽
            if (!(isVisible && isTouchInput)) {
                prevent();
            }
        };

        this.on(BottomInputEvent.Show, () => {
            this.container.addEventListener('touchstart', preventTouch, { passive: false });
            this.container.addEventListener('mousedown', preventTouch, { passive: false });
        });
        this.on(BottomInputEvent.Hide, () => {
            this.container.removeEventListener('touchstart', preventTouch);
            this.container.removeEventListener('mousedown', preventTouch);
        });
    }

    // 调整输入框位置
    _bindAdjustContainer() {
        let isHide = false;
        const setPosition: VisualKeyboardEventTypes[VisualKeyboardEvent.ViewportChange] =
            height => {
                if (isHide) {
                    return;
                }
                const offsetBottom = window.innerHeight - height;
                if (offsetBottom < IgnoreKeyboardHeight && !this.isVisible) {
                    return;
                }
                if (!isIOS() || this._useCompatibleStyle) {
                    return;
                }
                const { container } = this;
                const top = height - container.offsetHeight;
                // toast(`adjust ${isShow} ${top} ${offsetBottom}`);
                container.style.top = `${top}px`;
            };
        this.on(BottomInputEvent.Focus, () => {
            isHide = false;
            getDetectorInstance().on(VisualKeyboardEvent.ViewportChange, setPosition);
        });
        this.on(BottomInputEvent.Hide, () => {
            isHide = true;
            setTimeout(() => {
                getDetectorInstance().off(VisualKeyboardEvent.ViewportChange, setPosition);
            }, ShowTransitionDuration);
        });
    }

    _bindCompatibleShowInput() {
        // 兜底策略（没有resize / 不支持virtualViewport）展示到顶部：
        // 已知适用：iOS < 13 / 无软键盘弹出
        const useCompatibleShow = () => {
            // 设置样式
            const { container } = this;

            Object.entries(this.compatibleStyle).forEach(([k, v]) => {
                console.log('compatibleStyle...', [k, v]);

                container.style[k] = v;
            });

            container.style.height = 'unset';
            container.style.bottom = 'unset';

            this._useCompatibleStyle = true;
            // 主动触发Show
            // toast('emit compatible show');
            this.emit(BottomInputEvent.Show, { compatible: true });
        };

        // 兼容特殊情况, 超时直接重置位置
        this.on(BottomInputEvent.Focus, () => {
            // 浏览器端，iOS < 13，一定使用兼容
            if (isIOS() && !(window as any).visualViewport) {
                useCompatibleShow();
            } else {
                // 延迟1s兜底展示
                // 适用于iPhone部分机型viewport事件触发延迟极高
                // 适用于其他各种意外情况
                const tid = window.setTimeout(useCompatibleShow, CompatibleShowInputTimeout);
                const clearForceStart = () => {
                    clearTimeout(tid);
                };
                this.once(BottomInputEvent.Show, clearForceStart);
            }
        });
    }

    // 绑定展示输入框事件
    _bindSetVisibleOnExpand() {
        const emitShow = () => {
            if (this.isVisible) {
                return;
            }
            this.emit(BottomInputEvent.Show, { compatible: false });
        };
        this.on(BottomInputEvent.Focus, () => {
            // 若键盘已展开，直接展示，否则等键盘展开再展示
            if (getDetectorInstance().isExpand) {
                emitShow();
            } else {
                getDetectorInstance().once(VisualKeyboardEvent.Expand, emitShow);
            }
        });

        // 展示键盘，使用fade过渡，然后再开启全部属性过渡
        this.on(BottomInputEvent.Show, () => {
            if (this.isVisible) {
                return;
            }
            this.isVisible = true;

            const { container } = this;
            // 不能设置其他的，输入框从上方移到下边时不能有过渡
            container.style.transitionProperty = 'opacity';
            requestAnimationFrame(() => {
                container.style.opacity = '1';
                // 让移动输入框也有过渡
                setTimeout(() => {
                    container.style.transitionProperty = 'all';
                }, ShowTransitionDuration);
            });
        });
    }

    // 等一个tick后若没有loading则自动隐藏
    hide() {
        if (!this.isVisible) {
            return;
        }
        setTimeout(() => {
            if (!this.isVisible) {
                return;
            }
            if (!this.isLoading) {
                this._hide();
            }
        }, 0);
    }

    _bindDelayHideOnCollapse() {
        this.on(BottomInputEvent.Focus, () => {
            getDetectorInstance().once(VisualKeyboardEvent.Collapse, () => this.hide());
            this.once(BottomInputEvent.Blur, () => this.hide());
        });
    }
}
