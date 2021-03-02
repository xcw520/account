import SingleAxis from './SingleAxis';
import { CoordinateSystem, CoordinateSystemMaster } from '../CoordinateSystem';
import GlobalModel from '../../model/Global';
import ExtensionAPI from '../../ExtensionAPI';
import BoundingRect from 'zrender/esm/core/BoundingRect';
import SingleAxisModel from './AxisModel';
import { ParsedModelFinder } from '../../util/model';
import { ScaleDataValue } from '../../util/types';
declare class Single implements CoordinateSystem, CoordinateSystemMaster {
    readonly type = "single";
    readonly dimension = "single";
    readonly dimensions: string[];
    name: string;
    axisPointerEnabled: boolean;
    model: SingleAxisModel;
    private _axis;
    private _rect;
    constructor(axisModel: SingleAxisModel, ecModel: GlobalModel, api: ExtensionAPI);
    _init(axisModel: SingleAxisModel, ecModel: GlobalModel, api: ExtensionAPI): void;
    update(ecModel: GlobalModel, api: ExtensionAPI): void;
    resize(axisModel: SingleAxisModel, api: ExtensionAPI): void;
    getRect(): BoundingRect;
    private _adjustAxis;
    private _updateAxisTransform;
    getAxis(): SingleAxis;
    getBaseAxis(): SingleAxis;
    getAxes(): SingleAxis[];
    getTooltipAxes(): {
        baseAxes: SingleAxis[];
        otherAxes: SingleAxis[];
    };
    containPoint(point: number[]): boolean;
    pointToData(point: number[]): number[];
    dataToPoint(val: ScaleDataValue | ScaleDataValue[]): number[];
    convertToPixel(ecModel: GlobalModel, finder: ParsedModelFinder, value: ScaleDataValue[]): number[];
    convertFromPixel(ecModel: GlobalModel, finder: ParsedModelFinder, pixel: number[]): number[];
}
export default Single;
