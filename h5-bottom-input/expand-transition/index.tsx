/* eslint-disable max-lines-per-function */
/**
 * 展开过渡
 * ExpandTransition: 纵向展开
 * ExpandXTransition: 横向展开
 * props见interface定义
 * 参考：https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/components/transitions/expand-transition.ts
 */
import React, { CSSProperties, HTMLAttributes, useMemo, useRef } from 'react';
// import Transition from '../../transition';
import { Transition } from 'react-transition-group';
import omit from 'lodash/omit';
import './index.less';

function capitalize(t: string) {
    return t.charAt(0).toUpperCase() + t.slice(1);
}

type Handler = (el: HTMLElement) => void;

interface ExpandState {
    animating: boolean; // 是否正在动画中
    endSize?: number; // 元素size终值
    initSize?: number; // 元素size初值
}

// 注意，禁止设置容器大小和过渡相关样式：transition, overflow, width, height, minWidth, minHeight
export interface ExpandTransitionProps extends HTMLAttributes<HTMLDivElement> {
    in: boolean;
    timeout?: number;
    // 使用display none而非unmount，类似v-show，但mountOnEnter仍为true
    show?: boolean;
}

const TransitionClass = 'expand-transition-active';

export function createExpandTransition(x: boolean) {
    const sizeProperty: 'width' | 'height' = x ? 'width' : 'height';
    // const minProperty = `min${capitalize(sizeProperty)}` as 'minWidth' | 'minHeight';
    const offsetProperty = `offset${capitalize(sizeProperty)}` as 'offsetHeight' | 'offsetWidth';
    const resetStyles = (el: HTMLElement) => {
        // eslint-disable-next-line no-param-reassign
        el.style.overflow = '';
        // eslint-disable-next-line no-param-reassign
        el.style[sizeProperty] = '';
        // eslint-disable-next-line no-param-reassign
        el.style.transition = '';
    };
    return ({
        in: inProp,
        timeout = 200,
        show,
        children,
        style,
        className,
        ...props
    }: ExpandTransitionProps) => {
        const ref = useRef<ExpandState>({ animating: false });
        const containerStyle = useMemo<CSSProperties>(
            () =>
                omit(
                    style || {},
                    'transition',
                    'overflow',
                    'width',
                    'height',
                    'minWidth',
                    'minHeight',
                ),
            [style],
        );

        const onEnter: Handler = el => {
            if (show) {
                // eslint-disable-next-line no-param-reassign
                el.style.display = '';
            }
            ref.current = { animating: ref.current.animating };
            if (ref.current.animating) {
                ref.current.initSize = el[offsetProperty];
                resetStyles(el);
            }
            ref.current.animating = true;
            ref.current.endSize = el[offsetProperty];
            el.classList.add(TransitionClass);
        };
        const onEntering: Handler = el => {
            el.style.setProperty('transition', 'none', 'important');
            el.style.setProperty('overflow', 'hidden');
            // eslint-disable-next-line no-param-reassign
            el.style[sizeProperty] =
                ref.current.initSize == null ? '0' : `${ref.current.initSize}px`;
            el.style.setProperty('transition', '');
            el.style.setProperty('transitionDuration', `${timeout}ms`);

            const offset = `${ref.current.endSize}px`;
            requestAnimationFrame(() => {
                // eslint-disable-next-line no-param-reassign
                el.style[sizeProperty] = offset;
            });
        };
        const onEntered: Handler = el => {
            resetStyles(el);
            ref.current = { animating: false };
            el.classList.remove(TransitionClass);
            el.style.setProperty('transitionDuration', '');
        };
        const onExit: Handler = el => {
            ref.current = { animating: true, endSize: el[offsetProperty] };
            if (ref.current.animating) {
                resetStyles(el);
            }
            el.classList.add(TransitionClass);
            el.style.setProperty('transitionDuration', `${timeout}ms`);
        };
        const onExiting: Handler = el => {
            el.style.setProperty('overflow', 'hidden');
            // eslint-disable-next-line no-param-reassign
            el.style[sizeProperty] = `${ref.current.endSize}px`;
            el.style.setProperty('transitionDuration', `${timeout}ms`);

            requestAnimationFrame(() => {
                // eslint-disable-next-line no-param-reassign
                el.style[sizeProperty] = '0';
            });
        };
        const onExited: Handler = el => {
            resetStyles(el);
            ref.current = { animating: false };
            el.classList.remove(TransitionClass);
            el.style.setProperty('transitionDuration', '');
            if (show) {
                el.style.setProperty('display', 'none');
            }
        };
        return (
            <Transition
                appear
                in={inProp}
                timeout={timeout}
                mountOnEnter
                unmountOnExit={!show}
                onExit={onExit}
                onExiting={onExiting}
                onExited={onExited}
                onEnter={onEnter}
                onEntering={onEntering}
                onEntered={onEntered}
            >
                <div
                    {...props}
                    style={containerStyle}
                    className={`expand-container ${className || ''}`}
                >
                    {children}
                </div>
            </Transition>
        );
    };
}

export const ExpandTransition = createExpandTransition(false); // 纵向展开
export const ExpandXTransition = createExpandTransition(true); // 横向展开
