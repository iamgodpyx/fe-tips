import React, { useCallback, useRef, useState } from 'react';

const POLL_TIMEOUT = 2000;
export const useTypeWord = () => {
    // 文本内容
    const [textContent, setTextContent] = useState('');
    const [hasEnd, setHasEnd] = useState(false);

    const timer = useRef<any>();
    const frameQueue = useRef<string[]>([]);

    const typeWord = () => {
        if (timer.current) {
            return;
        }

        if (!frameQueue.current.length) {
            setHasEnd(true);
            return;
        }

        const frame = frameQueue.current.shift();
        const wordList = frame?.split('') || [];

        const interval = Math.floor((POLL_TIMEOUT - 100) / wordList.length);
        timer.current = setInterval(() => {
            const wordRest = wordList.length;
            if (wordRest) {
                const word = wordList.shift();
                setTextContent((prev) => `${prev}${word}`);
                return;
            }

            clearInterval(timer.current);
            timer.current = undefined;
            typeWord();
        }, interval);
    };

    const addFrame = (frame: string) => {
        if (!frame.length) {
            return;
        }
        setHasEnd(false);
        frameQueue.current.push(frame);
        typeWord();
    };

    const clearFrame = useCallback(() => {
        clearInterval(timer.current);
        timer.current = undefined;

        frameQueue.current = [];
        setTextContent('');
    }, []);

    /**
     * 手动结束 frame，并设置文本内容
     */
    const finishFrame = useCallback((textCotent?: string) => {
        clearInterval(timer.current);
        timer.current = undefined;

        frameQueue.current = [];
        setHasEnd(true);
        setTextContent(textCotent || '');
    }, []);

    return { textContent, hasEnd, addFrame, clearFrame, finishFrame };
};




// 使用
const { textContent, hasEnd, addFrame, clearFrame, finishFrame } = useTypeWord();
