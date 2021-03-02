import ComponentModel from '../../model/Component';
import Parallel from './Parallel';
import { DimensionName, ComponentOption, BoxLayoutOptionMixin } from '../../util/types';
import ParallelAxisModel, { ParallelAxisOption } from './AxisModel';
import GlobalModel from '../../model/Global';
import SeriesModel from '../../model/Series';
export declare type ParallelLayoutDirection = 'horizontal' | 'vertical';
export interface ParallelCoordinateSystemOption extends ComponentOption, BoxLayoutOptionMixin {
    layout?: ParallelLayoutDirection;
    axisExpandable?: boolean;
    axisExpandCenter?: number;
    axisExpandCount?: number;
    axisExpandWidth?: number;
    axisExpandTriggerOn?: 'click' | 'mousemove';
    axisExpandRate?: number;
    axisExpandDebounce?: number;
    axisExpandSlideTriggerArea?: [number, number, number];
    axisExpandWindow?: number[];
    parallelAxisDefault?: ParallelAxisOption;
}
declare class ParallelModel extends ComponentModel<ParallelCoordinateSystemOption> {
    static type: string;
    readonly type: string;
    static dependencies: string[];
    coordinateSystem: Parallel;
    dimensions: DimensionName[];
    parallelAxisIndex: number[];
    static layoutMode: "box";
    static defaultOption: ParallelCoordinateSystemOption;
    init(): void;
    mergeOption(newOption: ParallelCoordinateSystemOption): void;
    contains(model: SeriesModel | ParallelAxisModel, ecModel: GlobalModel): boolean;
    setAxisExpand(opt: {
        axisExpandable?: boolean;
        axisExpandCenter?: number;
        axisExpandCount?: number;
        axisExpandWidth?: number;
        axisExpandWindow?: number[];
    }): void;
    private _initDimensions;
}
export default ParallelModel;
