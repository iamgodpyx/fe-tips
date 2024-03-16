import React, { CSSProperties, forwardRef, useCallback, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import Loading from '../loading';
import { TouchAxis, useTouch } from '@/utils/touch';
import { getPX, useSyncRefState } from '@/utils';

import './index.less';

/**
 * 手势切换 tab / 懒加载的 tab
 * TODO：支持垂直方向的 tab 滑动
 */

export interface TabRef {
    loadTab: (key: string) => Promise<void>;
}

export interface TabItem {
    key: string;
    component?: React.ComponentType<any>;
    props?: Record<string, any>;
    loadFn?: () => Promise<{
        default: React.ComponentType<any>;
    }>;
    render?: () => React.ReactNode;
}

export interface TabProps {
    /** active 当前选中的 tab 的 key */
    active: string;

    /** tabs 面板，key: 当前面板的唯一 key，当 active = key 时，表示选中该面板，loadFn: 加载 tab 面板组件的函数， props：传入 loadFn 加载的组件的 props */
    tabs: TabItem[];

    /** tab面板的宽度 */
    width?: number;

    /** 是否自动设置当前 tab 高度 */
    autoHeight?: boolean;

    /** 当 滑动位移 > maxChangeOffset 时，切换面板 */
    maxChangeOffset?: number;

    /** 面板第一个向左滑和面板最后一个向右滑的最大位移 */
    maxBoundaryOffset?: number;

    style?: CSSProperties;

    itemStyle?: CSSProperties;

    /** 是否禁止手势滑动 */
    disabledTouch?: boolean;

    /** tab 隐藏时不渲染 tab，展示 loading */
    inactiveLoading?: boolean;

    /** 切换 tab 的函数 */
    onChange: (key: string) => void;

    getScroller?: (key: string, el: HTMLElement) => void;
}

const Tabs: React.ForwardRefRenderFunction<TabRef, TabProps> = (
    {
        active,
        tabs,
        style,
        width = getPX(375),
        itemStyle,
        disabledTouch,
        autoHeight = true,
        maxChangeOffset = 100,
        maxBoundaryOffset = 50,
        inactiveLoading = false,
        onChange,
        getScroller,
    },
    ref,
) => {
    const getIndex = () => {
        const i = tabs.findIndex(item => item.key === active);
        return i === -1 ? 0 : i;
    };

    const [loadedMap, loadedMapRef, setLoadedMap] = useSyncRefState<Record<string, any>>({});
    const [index, indexRef, setIndex] = useSyncRefState(getIndex());

    const loadingMapRef = useRef<Record<string, Promise<unknown>>>({});
    const wrapperRef = useRef<HTMLDivElement>(null);
    const childrenRef = useRef<(HTMLElement | null)[]>([]);

    const setPosition = useCallback(
        (fingerX: number, index: number) => {
            if (wrapperRef.current) {
                wrapperRef.current.style.transform = `translate(${-index * width + fingerX * 0.5}px, 0)`;
            }
        },
        [width, wrapperRef],
    );

    const currentEl = childrenRef.current[index];

    const disableLeft = (offset: number) => indexRef.current === 0 && offset > maxBoundaryOffset;
    const disableRight = (offset: number) => indexRef.current === tabs.length - 1 && offset < -maxBoundaryOffset;

    const { touchingRef } = useTouch({
        ref: wrapperRef,
        disable: disabledTouch,
        bindToEventTarget: true,
        disablePageSwipeBack: true,
        preventFailedNoMove: true,
        onTouchMove: (_, info) => {
            if (!wrapperRef.current || info.axis !== TouchAxis.X) {
                return;
            }
            if (disableLeft(info.x) || disableRight(info.x)) {
                return;
            }
            // 不能通过 React State 来设置位移，在长列表等场景下卡顿十分严重
            setPosition(info.x, indexRef.current);
        },
        onTouchEnd: (_, info) => {
            const initPosition = () => setPosition(0, index);

            if (!wrapperRef.current || info.axis !== TouchAxis.X) {
                initPosition();
                return;
            }

            const index = indexRef.current;

            // 滑到最左或者滑到最右，不能再向左滑或向右滑，重置位移
            if (disableLeft(info.x) || disableRight(info.x)) {
                initPosition();
                return;
            }

            // 向左滑，index - 1
            if (info.x > maxChangeOffset) {
                onChange?.(tabs[index - 1].key);
                return;
            }

            // 向右滑，index + 1
            if (info.x < -maxChangeOffset) {
                onChange?.(tabs[index + 1].key);
                return;
            }

            // 当滑动位移未超出阈值，重置位移
            initPosition();
        },
    });

    useImperativeHandle(
        ref,
        () => ({
            loadTab: async key => {
                const tab = tabs.find(tab => tab.key === key);
                tab && (await loadTabComponent(tab));
            },
        }),
        [tabs],
    );

    useLayoutEffect(() => {
        const index = getIndex();

        // 加载页面组件
        loadTabComponent(tabs[index]);

        setIndex(index);
        setPosition(0, index);
    }, [tabs, active]);

    const loadTabComponent = async (tab: TabItem) => {
        const loadingMap = loadingMapRef.current;

        if (!loadingMap[tab.key] && tab && tab.loadFn) {
            const promise = tab.loadFn();

            loadingMapRef.current[tab.key] = promise;

            promise
                .then(res => {
                    setLoadedMap({ ...loadedMapRef.current, [tab.key]: res.default });
                })
                .catch(e => {
                    console.log(e);
                });
        }
    };

    const wrap = (node: React.ReactNode, key: string, i: number) => (
        <div
            className="f-tabs-item"
            style={{
                width,
                ...itemStyle,
            }}
            id={key}
            ref={ref => {
                getScroller?.(key, ref as HTMLElement);
                childrenRef.current[i] = ref;
            }}
        >
            {node}
        </div>
    );

    const getTabsStyle = () => ({
        height: autoHeight ? currentEl?.children[0].clientHeight || 'auto' : undefined,
        ...style,
    });

    return (
        <div className="f-tabs" style={getTabsStyle()}>
            <div
                className="f-tabs-wrapper"
                ref={wrapperRef}
                style={{
                    transition: touchingRef.current ? 'none' : 'transform .3s',
                }}
            >
                {tabs.map((item, i) => {
                    const { component, key, render } = item;
                    if (render) {
                        return wrap(render(), key, i);
                    }
                    const Component = component || loadedMap[item.key];
                    if (!Component || (active !== key && inactiveLoading)) {
                        return wrap(<Loading />, key, i);
                    }
                    return wrap(<Component {...(item.props || {})} />, item.key, i);
                })}
            </div>
        </div>
    );
};

export default forwardRef(Tabs);
