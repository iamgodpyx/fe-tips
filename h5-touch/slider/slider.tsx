import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import cs from 'classnames';
import { TouchAxis, useTouch } from '@/utils/touch';
import { useSyncRefState } from '@/utils';

import './index.less';

interface IProps<T = any> {
    // slider-item 的宽度
    width: number;

    // slider-item 的高度
    height: number;

    // 自定义的数据
    data: T[];

    // 自定义 render
    renderSliderItem: (item: T) => React.ReactNode;

    // slider-item 的唯一 key，如果 slider 出现闪烁时需要配置
    itemKey: (item: T) => string;

    getTouchContainer?: () => HTMLElement | null;

    // touch 位移，当父组件传入 offset 时，slider-item 的位移由父组件来控制
    offset?: number;

    className?: string;

    // 切换动画时长
    duration?: number;

    // slider-item 的间距
    padding?: number;

    // 缩放比例
    scale?: number;

    // fake-item 的个数，当数组为 [0, 1, 2, 3]，fakeNum = 2 时，会在数组前后插入两个虚拟节点：[2, 3] | [0, 1, 2, 3] | [0, 1]
    fakeNum?: number;

    // 需要展示的节点个数，当数组为 [0, 1, 2, 3]，showNum = 3，则只展示[0, 1, 2]，而 [3] 这个节点的 opacity 会变成 0
    showNum?: number;

    baseOffset?: number;

    // 切换轮播图时
    onChange?: (i: number) => void;

    // 当 offset 不传时，onOffsetChange 可获取到 slider 的 touch 位移
    onOffsetChange?: (offset: number) => void;
}

interface SliderItem {
    item: any;
    index: number;
}

export interface SliderRef {
    next: () => void;
    prev: () => void;
}

const CanSlideOffset = 50;

const Slider = (
    {
        getTouchContainer,
        className,
        data,
        renderSliderItem,
        itemKey,
        width,
        height,
        padding = 0,
        scale = 1,
        duration = 0.3,
        fakeNum: _fakeNum = 1,
        showNum: _showNum = data.length,
        onChange,
        onOffsetChange,
    }: IProps,
    ref: ForwardedRef<SliderRef>,
) => {
    type Item = SliderItem;

    const [fakeIndex, setFakeIndex] = useState(0);
    const [preItems, preItemsRef, setPreItems] = useSyncRefState<Item[]>([]);
    const [nextItems, nextItemsRef, setNextItems] = useSyncRefState<Item[]>([]);
    const [items, itemsRef, setItems] = useSyncRefState<Item[]>([]);
    const [running, setRunning] = useState(false);
    const [itemOffset, setItemOffset] = useState(0);
    const [touchOffset, touchOffsetRef, setTouchOffset] = useSyncRefState(0);

    const offsetRef = useRef(0);
    const boxRef = useRef<HTMLDivElement>(null);

    const showNum = Math.min(data.length, _showNum);
    const fakeNum = Math.min(data.length, _fakeNum);
    const canSlide = showNum > 1;

    const canTouchSlide = (offset: number) => Math.abs(offset) > CanSlideOffset;

    useTouch({
        el: getTouchContainer?.() || boxRef.current,
        disable: !canSlide,
        stopPropagation: true,
        onTouchMove: (_, info) => {
            if (info.axis === TouchAxis.X) {
                setTouchOffset(info.x);
                onOffsetChange?.(info.x);
            }
        },
        onTouchEnd: (_, info) => {
            if (info.axis === TouchAxis.X) {
                const offset = touchOffsetRef.current;
                if (canTouchSlide(offset)) {
                    const target = offset < 0 ? 1 : -1;
                    handleSlide(target);
                }
                setTouchOffset(0);
                onOffsetChange?.(0);
            }
        },
    });

    const touching = touchOffset !== 0;

    // 可允许滑动总位移
    const totalOffset = width * scale + padding;

    // 手指滑动位移与屏幕宽度的比例
    const getScreenRatio = (needSign = false) => {
        if (touchOffset > 0) {
            return Math.min(touchOffset / window.innerWidth, 1);
        }
        const ratio = Math.max(touchOffset / window.innerWidth, -1);
        return needSign ? ratio : -ratio;
    };

    const getItems = (offset = 0, newItems?: Item[]) => {
        let newArr = newItems || items;
        const len = data.length;

        if (offset > 0) {
            const offsetItems = newArr.splice(0, offset);
            newArr = [...newArr, ...offsetItems];
        }

        if (offset < 0) {
            const offsetItems = newArr.splice(len + offset, -offset);
            newArr = [...offsetItems, ...newArr];
        }

        setItems(newArr);
        setPreItems(newArr.slice(-fakeNum));
        setNextItems(newArr.slice(0, fakeNum));
    };

    const isItemHide = (pos: number) => {
        const show = [fakeIndex, fakeIndex + showNum];
        // 即将显示元素
        if (pos >= show[0] && pos < show[1]) {
            return false;
        }
        return true;
    };

    const getOpacity = (pos: number) => {
        const isCur = pos === 0;
        const isShow = pos === showNum;
        const isHide = pos === showNum - 1;
        const isPrev = pos === -1;
        const screenRatio = getScreenRatio() * 2;

        if (touching) {
            // 左移
            if (touchOffset < 0) {
                if (isCur) {
                    return 1 - screenRatio;
                }
                if (isShow) {
                    return screenRatio;
                }
            }

            if (touchOffset > 0) {
                if (isPrev) {
                    return screenRatio;
                }
                if (isHide) {
                    return 1 - screenRatio;
                }
            }
        }

        return isItemHide(pos) ? 0 : 1;
    };

    const getScale = (pos: number) => {
        const offsetIndex = pos - fakeIndex;

        const isCur = pos === 0;
        const isNext = pos === 1;
        const isPrev = pos === -1;

        if (!touching) {
            return offsetIndex ? scale : 1;
        }

        const targetRatio = Math.min(getScreenRatio() + scale, 1);
        // 左移
        if (touchOffset < 0) {
            if (isCur) {
                return 1 + scale - targetRatio;
            }

            if (isNext) {
                return targetRatio;
            }
        }

        // 右移
        if (touchOffset > 0) {
            if (isCur) {
                return 1 + scale - targetRatio;
            }

            if (isPrev) {
                return targetRatio;
            }
        }

        return offsetIndex ? 0.6 : 1;
    };

    const getItemStyle = (pos: number) => {
        const scaleRatio = getScale(pos);
        const total = totalOffset + 10;
        const hideOffset = -fakeNum * (width * scale + padding);

        let curOffset = Math.min(getScreenRatio() * 2 * total, total);
        curOffset = touchOffset > 0 ? curOffset : -curOffset;

        return {
            width: width * scaleRatio,
            height: height * scaleRatio,
            opacity: getOpacity(pos),
            paddingRight: padding,
            transition: running ? `all ${duration}s` : 'none',
            transform: `translate(${(touching ? curOffset : itemOffset) + hideOffset}px, 0) scale(${getScale(pos)})`,
        };
    };

    const slideToIndex = async (i: number) => {
        const offset = i - fakeIndex;
        const offsetAbs = Math.abs(offset);

        const { current, target } = addClassBeforeRun(i);

        setFakeIndex(i);
        setRunning(true);
        setItemOffset((offset > 0 ? -1 : 1) * totalOffset * offsetAbs);

        offsetRef.current = i;

        setTimeout(() => {
            setRunning(false);
            removeClassAfterRun(current, target);
        }, duration * 1000);
    };

    const addClassBeforeRun = (i: number) => {
        if (i < 0) {
            boxRef.current?.classList.add('slide-to-prev');
        }
        if (i > 0) {
            boxRef.current?.classList.add('slide-to-next');
        }

        const sliderItems = document.querySelectorAll('.slider-item');
        const current = sliderItems[fakeIndex + fakeNum];
        const target = sliderItems[i + fakeNum];

        current?.classList.add('slider-item-last');
        target?.classList.add('slider-item-target');

        return { current, target };
    };

    const removeClassAfterRun = (current: Element, target: Element) => {
        boxRef.current?.classList.remove('slide-to-prev');
        boxRef.current?.classList.remove('slide-to-next');
        current?.classList.remove('slider-item-last');
        target?.classList.remove('slider-item-target');
    };

    const handleSlide = (i: number) => {
        if (running) {
            return;
        }
        const realIndex = getRealIndex(i);

        onChange?.(realIndex);
        slideToIndex(i);
    };

    const getRealIndex = (i: number) =>
        [...preItemsRef.current, ...itemsRef.current, ...nextItemsRef.current][i + fakeNum].index;

    const renderItem = (data: Item, i: number, isFake = false) => {
        const hide = isItemHide(i);
        return (
            <div
                className={cs('slider-item', {
                    'slider-item-current': fakeIndex === i,
                    'fake-item': isFake,
                    'hide-item': hide,
                })}
                data-index={i}
                style={getItemStyle(i)}
                key={itemKey(data.item)}
                onClick={() => (canSlide && !hide ? handleSlide(i) : undefined)}
            >
                {renderSliderItem(data.item)}
            </div>
        );
    };

    useEffect(() => {
        const _items = data.map((item, i) => ({ item, index: i }));
        getItems(0, _items);
    }, [data]);

    useEffect(() => {
        if (!running && items.length) {
            getItems(offsetRef.current);
            setFakeIndex(0);
            setItemOffset(0);
        }
    }, [running]);

    useImperativeHandle(ref, () => ({
        next: () => handleSlide(1),
        prev: () => handleSlide(-1),
    }));

    return (
        <div
            className={cs('slider-container', className, {
                'can-slide': canTouchSlide(touchOffset),
            })}
            style={{ height }}
            ref={boxRef}
        >
            {data.length > 0 ? (
                <div className="slider-wrapper">
                    {preItems.map((item, i) => {
                        return renderItem(item, i - fakeNum, true);
                    })}
                    {items.map((item, i) => {
                        return renderItem(item, i);
                    })}
                    {nextItems.map((item, i) => {
                        return renderItem(item, i + items.length, true);
                    })}
                </div>
            ) : null}
        </div>
    );
};

export default forwardRef(Slider);
