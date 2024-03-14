/**
 * copy from mobile
 */
import { composedPath } from './compose-path';

// 是否有滚动条
function hasYScrollbar(el?: Element) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }

    const style = window.getComputedStyle(el);
    return (
        (['auto', 'scroll'].includes(style.overflowY) || el.tagName === 'SELECT') &&
        el.scrollHeight > el.clientHeight
    );
}

// 是否会在元素上触发滚动
function shouldScroll(el: Element, deltaY: number): boolean {
    const alreadyAtStart = Math.abs(el.scrollTop) < 1;
    const alreadyAtEnd = Math.abs(el.scrollTop + el.clientHeight - el.scrollHeight) < 1;

    const scrollingUp = deltaY < 0;
    const scrollingDown = deltaY > 0;

    if (!alreadyAtStart && scrollingUp) {
        return true;
    }
    if (!alreadyAtEnd && scrollingDown) {
        return true;
    }

    return false;
}

export interface CheckScrollReturn {
    eventInElement: boolean; // 事件是否在元素内
    scrollInElement: boolean; // 滚动是否在元素内
    hasScroll: boolean; // 是否发生滚动
}

// 滚动是否发生在元素内（包含该元素）
function checkScroll(
    element: HTMLElement | null | undefined,
    e: Event,
    deltaY: number,
): CheckScrollReturn {
    const path = composedPath(e);
    const eventInElement = path.some(el => el === element);
    // if (!isInElement) {
    //     return { eventInElement: false, scrollInElement: false }; // 容器外发生的滚动一定不在容器内滚动
    // }
    let hasPassContainer = false; // 是否已经经过容器
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < path.length; ++i) {
        const el = path[i] as HTMLElement;
        if (hasYScrollbar(el) && shouldScroll(el, deltaY)) {
            return { eventInElement, scrollInElement: !hasPassContainer, hasScroll: true };
        }
        if (el === element) {
            hasPassContainer = true;
        }
    }
    return { eventInElement, scrollInElement: false, hasScroll: false };
}

export type ScrollIsolatorListener = (
    res: CheckScrollReturn & { event: Event; deltaY: number },
) => void;

export function bindScrollIsolator(
    container: HTMLElement | null | undefined,
    listener: ScrollIsolatorListener,
): () => void {
    if (!container) {
        return () => {};
    }
    const checkPrevent = (deltaY: number, event: Event) => {
        const res = checkScroll(container, event, deltaY);
        listener({ ...res, event, deltaY });
    };
    const onWheel = (e: WheelEvent) => {
        checkPrevent(e.deltaY, e);
    };
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
        touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
        const { clientY } = e.touches[0];
        const deltaY = touchStartY - clientY;
        checkPrevent(deltaY, e);
        touchStartY = clientY;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
    };
}
