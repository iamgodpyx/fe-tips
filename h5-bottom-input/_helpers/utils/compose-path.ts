// https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/util/helpers.ts
export function composedPath(e: Event): HTMLElement[] {
    if (e.composedPath) {
        const res = e.composedPath();
        if (res.length) {
            return res as HTMLElement[];
        }
    }

    const path: HTMLElement[] = [];
    let el = e.target as HTMLElement;

    while (el) {
        path.push(el);
        if (el.tagName === 'HTML' && window) {
            path.push(window.document as unknown as HTMLElement);
            path.push(window as unknown as HTMLElement);
            return path;
        }
        el = el.parentElement!;
    }
    return path;
}
