/**
 * 组件描述
 * @type 数据录入
 * @name BottomInput
 */
/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines-per-function */
import React, {
    forwardRef,
    Ref,
    useRef,
    useImperativeHandle,
    useEffect,
    useState,
    useCallback,
} from 'react';
import cs from 'classnames';
import SendIcon from './images/send.png';

import Textarea, { SerialI18nTextareaRef } from '../textarea';
import Loading from '../loading';

import { BottomInputEvent, SerialMobileBottomInput, ShowTransitionDuration } from './core/model';
import { SubmitStatus } from './typings';
import { getConfig } from './core/config';
import { ExpandXTransition } from './expand-transition';
import { px2rem as _px2rem } from '../_helpers/utils/px';

export * from './typings';
export * from './core';

export interface SerialI18nBottomInputProps {
    /** 限制输入字符数 */
    maxLength?: number;
    /** 是否常驻底部，default to false */
    permanent?: boolean;
    placeholder?: string;
    /** 禁用输入框 */
    disabled?: boolean;
    value?: string; // 输入的值
    onChange?: (value: string) => void; // 修改输入回调
    onSubmit?: (value: string) => void | Promise<void>; // 提交时回调
    onCancel?: () => void; // 未提交时回调
    onError?: (e: any) => void; // 提交报错时回调
    onExceedMaxLength?: (value: string) => void; // 超出最大输入值时调用
    inputExtra?: React.ReactNode;
    showInputExtra?: boolean;
    showSubmitBtn?: boolean;
    /** 键盘挂载完的回调 */
    onKeyboardReady?: (kb: SerialMobileBottomInput) => void;
    /** 自定义颜色样式 */
    customStyle?: {
        background?: React.CSSProperties['background'];
    };
}

export interface SerialI18nBottomInputRef extends Partial<SerialI18nTextareaRef> {
    container: HTMLDivElement | null;
    content: HTMLDivElement | null;
    input: HTMLTextAreaElement | null;
    actions: HTMLElement[] | null;
    keyboard: SerialMobileBottomInput | null;
}

const ShowSafeAreaDelay = 0.5 * ShowTransitionDuration;
const getLoadingRadius = () => getConfig()?.getPX?.(8) || 8;
const isIOS = () => Boolean(getConfig()?.isIOS?.());
const px2rem = (px: number) => (getConfig()?.px2rem || _px2rem)(px);

const BottomInput = forwardRef(
    (props: SerialI18nBottomInputProps, ref: Ref<SerialI18nBottomInputRef>) => {
        const {
            maxLength,
            permanent = false,
            value,
            placeholder,
            disabled,
            onChange,
            onSubmit,
            onCancel,
            onError,
            onExceedMaxLength,
            customStyle,
            showInputExtra,
            inputExtra,
            showSubmitBtn,
            onKeyboardReady,
        } = props;

        const inputRef = useRef<SerialI18nTextareaRef>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);
        const submitBtnRef = useRef<HTMLDivElement>(null);
        const extraBtnRef = useRef<HTMLDivElement>(null);
        const triggerRef = useRef<HTMLDivElement>(null);
        const submitStatusRef = useRef(SubmitStatus.NotSubmit);
        const [actions, setActions] = useState<HTMLElement[]>([]);
        const [loading, setLoading] = useState(false);
        const [keyboard, setKeyboard] = useState<SerialMobileBottomInput | null>(null);
        const [isVisible, setIsVisible] = useState(false);
        const [triggerWidth, setTriggerWidth] = useState(0);
        const [showSafeArea, setShowSafeArea] = useState(true);
        const hasText = Boolean(value?.length);

        /**
         * trigger 的宽度需要动态 目前这个结构实在不太好改 只能通过 rect 获取实时宽度
         */
        const updateTriggerWidth = useCallback(() => {
            const inputRealWidth = inputRef.current?.dom?.getBoundingClientRect?.()?.width || 0;
            setTriggerWidth(inputRealWidth);
        }, []);

        useEffect(() => {
            setTimeout(() => {
                updateTriggerWidth();
            }, 30); // hack ios 点 done 收起键盘
        }, [isVisible, showInputExtra, showSubmitBtn]);

        useEffect(() => {
            const submitActions = [submitBtnRef.current].filter(el => Boolean(el)) as HTMLElement[];
            setActions(submitActions);
            const topHeight = 50; // TODO 现在写死了

            let keyboardObj: SerialMobileBottomInput | null = null;
            if (containerRef.current && inputRef.current?.textarea && triggerRef.current) {
                keyboardObj = new SerialMobileBottomInput({
                    container: containerRef.current,
                    input: inputRef.current?.textarea,
                    trigger: triggerRef.current,
                    actions: submitActions,
                    compatibleStyle: { top: `${px2rem(topHeight)}rem` },
                });
                onKeyboardReady?.(keyboardObj);
                setKeyboard(keyboardObj);
                setTimeout(() => {
                    updateTriggerWidth();
                }, 50);
            }
            return () => keyboardObj?.unbind();
        }, []);

        useEffect(() => {
            keyboard?.on(BottomInputEvent.Show, () => {
                setIsVisible(true);
                setShowSafeArea(false);
            });
            keyboard?.on(BottomInputEvent.LoadingChange, isLoading => {
                setLoading(isLoading);
            });
            keyboard?.on(BottomInputEvent.Hide, () => {
                setIsVisible(false);
                setTimeout(() => {
                    setShowSafeArea(true);
                }, ShowSafeAreaDelay);
            });
        }, [keyboard]);
        useEffect(() => {
            const callback = () => {
                if (submitStatusRef.current === SubmitStatus.NotSubmit) {
                    onCancel?.();
                }
                submitStatusRef.current = SubmitStatus.NotSubmit;
            };
            keyboard?.on(BottomInputEvent.Hide, callback);
            return () => {
                keyboard?.off(BottomInputEvent.Hide, callback);
            };
        }, [keyboard, onCancel]);

        useEffect(() => {
            keyboard?.updateActions(submitBtnRef.current ? [submitBtnRef.current] : []);
            keyboard?.updateActions(extraBtnRef.current ? [extraBtnRef.current] : []);
        }, [hasText]);

        useImperativeHandle(
            ref,
            () => ({
                container: containerRef.current,
                content: contentRef.current,
                input: inputRef.current?.textarea || null,
                actions,
                keyboard,
            }),
            [keyboard, actions],
        );

        const InputElement = (
            <Textarea
                className={cs('textarea-wrap-input', { loading })}
                ref={inputRef}
                textareaClass="textarea-wrap-input-element"
                autosize
                rows={1}
                disabled={disabled}
                showStatistics={false}
                value={value}
                /* 原生不支持省略（聚焦时无法省略） */
                suffix={
                    !hasText && <div className="textarea-wrap-input-placeholder">{placeholder}</div>
                }
                onChange={(_, v) => {
                    if (maxLength && v.length > (maxLength || Infinity)) {
                        if ((value || '').length < maxLength) {
                            onChange?.(v.slice(0, maxLength));
                        }
                        onExceedMaxLength?.(v);
                    } else {
                        onChange?.(v);
                    }
                }}
            />
        );
        const SubmitBtn = (
            <ExpandXTransition
                className="textarea-wrap-btn-container"
                show
                in={Boolean(showSubmitBtn)}
            >
                <div
                    ref={submitBtnRef}
                    className="textarea-wrap-btn"
                    onClick={() => {
                        if (!onSubmit) {
                            return;
                        }
                        keyboard?.wait(async () => {
                            try {
                                await onSubmit(inputRef.current?.textarea?.value || '');
                                submitStatusRef.current = SubmitStatus.Success;
                            } catch (e) {
                                onError?.(e);
                                submitStatusRef.current = SubmitStatus.Failed;
                            }
                        });
                    }}
                >
                    {loading ? (
                        <Loading type="circle" radius={getLoadingRadius()} color="#c4c4c4" />
                    ) : (
                        <img className="bottom-textarea__submit" src={SendIcon} />
                    )}
                </div>
            </ExpandXTransition>
        );

        const extraBtn = (
            <ExpandXTransition
                className="textarea-wrap__extra-btn"
                show
                in={Boolean(showInputExtra)}
            >
                <div className="extra-btn-container" ref={extraBtnRef}>
                    {inputExtra}
                </div>
            </ExpandXTransition>
        );

        return (
            <div ref={containerRef} className={cs('bottom-textarea', { permanent })}>
                <div
                    ref={contentRef}
                    className={cs('bottom-textarea-content')}
                    style={{
                        ...(customStyle?.background && {
                            background: customStyle.background,
                        }),
                    }}
                >
                    {/* 这个 trigger 的宽度 不太好控制 */}
                    <div
                        ref={triggerRef}
                        style={{
                            display: !isVisible ? 'block' : 'none',
                            width: triggerWidth || '100%',
                        }}
                        className={cs('bottom-textarea-content-blocker', {
                            'has-safe-area': showSafeArea,
                        })}
                    />
                    <div className={cs('textarea-wrap')}>
                        {InputElement}
                        {SubmitBtn}
                        {extraBtn}
                    </div>
                    {isIOS() && (
                        <div
                            className={cs({ 'safe-area-transition': showSafeArea })}
                            style={{ height: showSafeArea ? `${px2rem(36)}rem` : '0' }}
                        />
                    )}
                </div>
            </div>
        );
    },
);

export default BottomInput;
