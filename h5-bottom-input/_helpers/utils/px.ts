/**
 * px转rem
 * @param px 375屏宽下的px值
 * @param unit 是否需要rem单位，默认true
 * @returns rem值
 */

export function px2rem(px: number, unit?: true): string;
export function px2rem(px: number, unit: false): number;
export function px2rem(px: number, unit = true) {
    const rem = Math.floor((px / 50) * 1000000) / 1000000;
    if (unit) {
        return `${rem}rem`;
    }

    return rem;
}

// /**
//  * 获取真实屏幕宽度下的像素大小
//  * @param px 375屏宽下的px值
//  * @returns 真实屏宽下的px值
//  */
// export const getPX = (px: number) => {
//     const rem = px2rem(px, false);
//     return window.htmlFontSize * rem;
// };
