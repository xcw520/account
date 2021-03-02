import Calendar from './Calendar';
export default function calendarPrepareCustom(coordSys: Calendar): {
    coordSys: {
        type: string;
        x: number;
        y: number;
        width: number;
        height: number;
        cellWidth: number;
        cellHeight: number;
        rangeInfo: {
            start: import("./Calendar").CalendarParsedDateInfo;
            end: import("./Calendar").CalendarParsedDateInfo;
            weeks: number;
            dayCount: number;
        };
    };
    api: {
        coord: (data: string | number | Date, clamp?: boolean) => number[];
    };
};
