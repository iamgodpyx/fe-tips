export function setDomHidden(node: HTMLElement) {
    // Prevent zooming on iOS
    node.style.fontSize = '12pt';
    // Reset box model
    node.style.border = '0';
    node.style.padding = '0';
    node.style.margin = '0';
    // Move element out of screen horizontally
    node.style.position = 'absolute';
    node.style.left = '-9999px';
    // Move element to the same position vertically
    const yPosition = window.pageYOffset || document.documentElement.scrollTop;
    node.style.top = `${yPosition}px`;
}

// 最好传入attach的元素，否则select事件可能被拦截
export function copyToClipboard(target: string | HTMLElement, attach: HTMLElement = document.body) {
    let node;
    if (typeof target === 'string') {
        const textNode = document.createTextNode(target);
        const el = document.createElement('span');
        el.style.whiteSpace = 'pre-wrap';
        el.appendChild(textNode);
        node = el;
        // node = textNode
    } else {
        node = target;
    }

    setDomHidden(node);
    attach.appendChild(node);

    const range = document.createRange();
    range.selectNode(node);

    const selection = window.getSelection();
    if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
    }

    document.execCommand('Copy');
    attach.removeChild(node);
}
