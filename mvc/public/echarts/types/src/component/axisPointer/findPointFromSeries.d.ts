import GlobalModel from '../../model/Global';
import Element from 'zrender/esm/Element';
export default function findPointFromSeries(finder: {
    seriesIndex?: number;
    dataIndex?: number | number[];
    dataIndexInside?: number | number[];
    name?: string | string[];
    isStacked?: boolean;
}, ecModel: GlobalModel): {
    point: number[];
    el?: Element;
};
