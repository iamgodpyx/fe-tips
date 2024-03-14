import dayjs from 'dayjs';

import 'dayjs/locale/en';
import 'dayjs/locale/id';
import 'dayjs/locale/es';
import 'dayjs/locale/pt';

import utc from 'dayjs/plugin/utc';
import localeData from 'dayjs/plugin/localeData';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isToday from 'dayjs/plugin/isToday';

import { LangCode } from './i18n';

dayjs.extend(localizedFormat);
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(isToday);

dayjs.locale('en');

export const changeDayjsLocale = (lang: LangCode = LangCode.EN) => dayjs.locale(lang);

export { dayjs };

// 格式化成本地化的日月
const Formats: { [key: string]: string | undefined } = {
    [LangCode.EN]: 'MMM D',
    [LangCode.ID]: 'D MMM',
    [LangCode.ES]: 'D [de] MMM',
    [LangCode.PT]: 'D [de] MMM',
};

export function toDateString(...args: Parameters<typeof dayjs>) {
    const locale = dayjs.locale();
    const format: string = Formats[locale] || Formats[LangCode.EN]!;

    return dayjs(...args).format(format);
}

export const formatUTCTime = (time: number | string, format = 'YYYY.MM.DD') =>
    dayjs.utc(Number(time) * 1000).format(format);
export const formatTime = (time: number | string, format = 'YYYY.MM.DD') => dayjs(Number(time) * 1000).format(format);

export const getTime = (d?: Date | string, local = false) => {
    let _d;
    if (typeof d === 'string') {
        _d = new Date(Number(d) * 1000);
    } else {
        _d = d || new Date();
    }
    return {
        year: local ? _d.getFullYear() : _d.getUTCFullYear(),
        hour: local ? _d.getHours() : _d.getUTCHours(),
        min: local ? _d.getMinutes() : _d.getUTCMinutes(),
        mon: local ? _d.getMonth() : _d.getUTCMonth(),
        date: local ? _d.getDate() : _d.getUTCDate(),
        second: local ? _d.getSeconds() : _d.getUTCSeconds(),
    };
};

export const getLocalTimeStr = (timestamp: number) => dayjs(new Date(Number(timestamp) * 1000)).format('lll');
export function getDateText(date: Date) {
    const obj = {
        year: date.getFullYear(),
        month: `${date.getMonth() + 1}`.padStart(2, '0'),
        day: date.getDate(),
    };

    return `${obj.year}-${obj.month}-${obj.day}`;
}

/**
 * 获取最近有数据的日期【数据页 / 日历等模块】
 */
export const getLatestUtcDate = () => {
    let end = dayjs.utc();
    // @ts-ignore
    if (end.$H < 15) {
        end = end.subtract(1, 'days');
    }
    return end;
};

/**
 * 获取最近一段日期
 * @param range 天数
 * @param min 是否有最小可选日期
 * @returns [startDate, endDate]
 */
export const getRecentDates = (range = 31, min?: Date) => {
    const end = getLatestUtcDate();
    const start = end.subtract(range - 1, 'days');
    if (min && dayjs(min).isAfter(start)) {
        return [min, end.toDate()];
    }
    return [start.toDate(), end.toDate()];
};
