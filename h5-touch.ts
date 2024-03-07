/**
 * touch 手势滑动方向判断 & 获取位移
 * @param el
 * @param disable
 * @param stopPropagation
 * @param preventDefault
 * @param onTouchStart
 * @param onTouchMove
 * @param onTouchEnd
 *
 * @returns
 *  - touching 是否正在滑动
 *  - touchingRef 是否正在滑动（同步更新 ref）
 */

 import { useEffect, useRef } from 'react';
 import { useSyncRefState } from './hooks';
 import { inApp } from '@/constants/browser';
 import bridge from '@bridge/worldance';
 
 type SyncRefAction<T> = T | ((prev: T) => T);
 /** 同步设置Ref，不等待state变更 */
export function useSyncRefState<T>(initialValue: T): [T, React.MutableRefObject<T>, React.Dispatch<SyncRefAction<T>>] {
    const [state, setState] = useState<T>(initialValue);
    const stateRef = useRef<T>(state);

    const setData = (v: SyncRefAction<T>) => {
        const isFn = (_v: SyncRefAction<T>): _v is (prev: T) => T => typeof v === 'function';
        const newState = isFn(v) ? v(state) : v;
        stateRef.current = newState;
        setState(newState);
    };

    return [state, stateRef, setData];
}
 export enum TouchDirection {
     Up,
     Down,
     Left,
     Right,
 }
 
 export enum TouchAxis {
     X,
     Y,
 }
 
 const InitialState = {
     el: null,
     target: null,
     startX: 0,
     startY: 0,
     offsetX: 0,
     offsetY: 0,
     direction: undefined,
     axis: undefined,
 };
 
 interface TouchInfo {
     el: HTMLElement | null;
     target: EventTarget | null;
     startX: number;
     startY: number;
     offsetX: number;
     offsetY: number;
     direction: TouchDirection | undefined;
     axis: TouchAxis | undefined;
 }
 
 /**
  * x: x 方向的位移
  * y: y 方向的位移
  * direction: 位移方向，有上、下、左、右四个方向
  * axis: 位移的坐标轴，有 x、y 轴
  */
 export type TouchOffsetProps = {
     x: number;
     y: number;
     direction: TouchDirection | undefined;
     axis: TouchAxis | undefined;
 };
 
 export type MyRequired<O> = {
     [K in keyof O]: Exclude<O[K], undefined>;
 };
 export interface UseTouchProps {
     /** 监听 touch 事件的元素 */
     el?: HTMLElement | null | (() => HTMLElement | null);
 
     /** React节点的 ref */
     ref?: React.RefObject<HTMLElement>;
 
     /** 点触阈值 */
     touchThreshold?: number;
 
     /** 是否禁止监听 touch 事件 */
     disable?: boolean;
 
     /** 当某些滑动方向时，阻止默认事件（浏览器返回、滚动、app返回等） */
     preventDefault?: TouchDirection[];
 
     /** 是否允许冒泡，多个元素同时监听 touch 事件的时候设置 */
     stopPropagation?: boolean;
 
     /** 是否将 touchmove、touchend 绑定在 e.target 上 */
     bindToEventTarget?: boolean;
 
     /** 是否同时禁止页面右滑返回 */
     disablePageSwipeBack?: boolean;
 
     /** preventDefault 调用失败，不允许 move */
     preventFailedNoMove?: boolean;
 
     onTouchStart?: (e: TouchEvent) => void;
     onTouchMove?: (e: TouchEvent, touchInfo: MyRequired<TouchOffsetProps>) => void;
     onTouchEnd?: (e: TouchEvent, touchInfo: MyRequired<TouchOffsetProps>) => void;
 }
 
 export const getX = (e: TouchEvent) => e.touches[0].pageX;
 export const getY = (e: TouchEvent) => e.touches[0].pageY;
 
 export const useTouch = (props: UseTouchProps) => {
     const {
         el,
         ref,
         disable = false,
         preventDefault = [TouchDirection.Left, TouchDirection.Right],
         stopPropagation = false,
         bindToEventTarget = false,
         disablePageSwipeBack = false,
         touchThreshold = 0,
         preventFailedNoMove,
         onTouchStart,
         onTouchMove,
         onTouchEnd,
     } = props;
     const [touching, touchingRef, setTouching] = useSyncRefState(false);
     const touchInfoRef = useRef<TouchInfo>({ ...InitialState });
 
     const getEl = () => {
         if (ref) {
             return ref.current;
         }
         return (typeof el === 'function' ? el() : el) || document.body;
     };
 
     const getTarget = () => {
         return bindToEventTarget ? touchInfoRef.current.target : touchInfoRef.current.el;
     };
 
     const start = (e: TouchEvent) => {
         // console.log('---- touch start ----');
 
         const initTouch = () => {
             const target = getTarget();
 
             target?.removeEventListener('touchmove', move as EventListener);
             target?.removeEventListener('touchend', end as EventListener);
             touchInfoRef.current = { ...InitialState };
         };
 
         // ------------------------------- move -------------------------------
         // loading 的时候，父组件触发了 touchmove，此时子组件 loading 完成，e.target 被移除，此时父组件的 touchend 不会被触发
         // 因此这里将需要将 touchmove、touchend 等事件挂载到 touchstart 的 target 上
         // 同时 move handler 和 end handler 在闭包中声明，避免 removeEventListener 失败
         // MDN：https://developer.mozilla.org/en-US/docs/Web/API/Touch/target
         // stackoverflow：https://stackoverflow.com/questions/33298828/touch-move-event-dont-fire-after-touch-start-target-is-removed
         const move = (e: TouchEvent) => {
             const { startX, startY, direction } = touchInfoRef.current;
 
             const curX = getX(e);
             const curY = getY(e);
 
             const offsetX = Math.floor(curX - startX);
             const offsetY = Math.floor(curY - startY);
 
             touchInfoRef.current.offsetX = offsetX;
             touchInfoRef.current.offsetY = offsetY;
 
             // 第一次 touchmove 触发，设置位移的 direction
             if (direction === undefined) {
                 const dy = Math.abs(offsetY);
                 const dx = Math.abs(offsetX);
 
                 // dx > dy，说明 x 轴的位移大于
                 if (dx > dy && dx > touchThreshold) {
                     touchInfoRef.current.direction = offsetX > 0 ? TouchDirection.Left : TouchDirection.Right;
                     touchInfoRef.current.axis = TouchAxis.X;
                 }
                 if (dy > dx && dy > touchThreshold) {
                     touchInfoRef.current.direction = offsetY > 0 ? TouchDirection.Down : TouchDirection.Up;
                     touchInfoRef.current.axis = TouchAxis.Y;
                 }
             }
 
             let preventFailed = false;
             // 阻止默认的滚动行为
             preventDefault.forEach(d => {
                 if (d === touchInfoRef.current.direction) {
                     if (e.cancelable) {
                         e.preventDefault();
                     } else {
                         preventFailed = true;
                     }
                 }
             });
 
             if (preventFailedNoMove && preventFailed) {
                 return;
             }
 
             // 阻止其他元素的touch事件
             stopPropagation && e.stopPropagation();
 
             onTouchMove?.(e, {
                 x: offsetX,
                 y: offsetY,
                 direction: touchInfoRef.current.direction!,
                 axis: touchInfoRef.current.axis!,
             });
         };
 
         // ------------------------------- end -------------------------------
         const end = (e: TouchEvent) => {
             // console.log('---- touch end ----');
             setTouching(false);
 
             const { offsetX, offsetY, direction, axis } = touchInfoRef.current;
 
             onTouchEnd?.(e, {
                 x: offsetX,
                 y: offsetY,
                 direction: direction as TouchDirection,
                 axis: axis as TouchAxis,
             });
 
             initTouch();
         };
 
         setTouching(true);
         stopPropagation && e.stopPropagation();
 
         onTouchStart?.(e);
 
         touchInfoRef.current.startX = getX(e);
         touchInfoRef.current.startY = getY(e);
         touchInfoRef.current.el = getEl();
         touchInfoRef.current.target = e.target || getEl();
 
         const target = getTarget();
         target?.addEventListener('touchmove', move as EventListener, { passive: false });
         target?.addEventListener('touchend', end as EventListener, { passive: false });
         target?.addEventListener('touchcancel', end as EventListener, { passive: false });
     };
 
     useDisableSwipeBack(disablePageSwipeBack);
 
     useEffect(() => {
         if (disable) return;
 
         const el = getEl();
 
         el?.addEventListener('touchstart', start, { passive: false });
 
         return () => {
             el?.removeEventListener('touchstart', start);
         };
     }, [el, disable, ref, bindToEventTarget]);
 
     return { touching, touchingRef };
 };
 
 export const useDisableSwipeBack = (disable = true) => {
     useEffect(() => {
         if (inApp && disable) {
             bridge.nav.setSwipeBackEnabled({
                 enable: false,
             });
         }
     }, []);
 };



/**
 * 使用
 */
 useTouch({
    ref: cardRef,
    disable: className !== FirstCard || classNameList.current.length === 1,
    bindToEventTarget: true,
    disablePageSwipeBack: true,
    stopPropagation: true,
    onTouchStart: e => {
        if (cardRef.current) {
            cardRef.current.style.transition = 'none';
            positionRef.current = e.touches[0].clientX;
        }
    },
    onTouchMove: (e, info) => {
        if (info.axis === TouchAxis.X && cardRef.current) {
            const newPosition = e.touches[0].clientX;
            const diff = newPosition - positionRef.current;
            distanceRef.current = diff;
            const rotateAngle = (CriticalAngle * diff) / CriticalDistance;
            cardRef.current.style.transform = `translateX(${diff}px) rotate(${rotateAngle}deg)`;
        }
    },
    onTouchEnd: () => {
        if (cardRef.current) {
            if (distanceRef.current > CriticalDistance || distanceRef.current < -CriticalDistance) {
                const _style = SlideSwitchStyle[classNameList.current.length as CardsLengthKey];
                onDrag();
                cardRef.current.style.transform = _style;
                cardRef.current?.removeAttribute('style');
                distanceRef.current = 0;
                return;
            }
            (cardRef.current as HTMLElement).style.transform = 'translateX(0)';
            cardRef.current?.removeAttribute('style');
        }
    },
});
 