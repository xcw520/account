import BaseAxisPointer, { AxisPointerElementOptions } from './BaseAxisPointer';
import CartesianAxisModel from '../../coord/cartesian/AxisModel';
import ExtensionAPI from '../../ExtensionAPI';
import { ScaleDataValue, CommonAxisPointerOption } from '../../util/types';
import Model from '../../model/Model';
declare type AxisPointerModel = Model<CommonAxisPointerOption>;
declare class CartesianAxisPointer extends BaseAxisPointer {
    makeElOption(elOption: AxisPointerElementOptions, value: ScaleDataValue, axisModel: CartesianAxisModel, axisPointerModel: AxisPointerModel, api: ExtensionAPI): void;
    getHandleTransform(value: ScaleDataValue, axisModel: CartesianAxisModel, axisPointerModel: AxisPointerModel): {
        x: number;
        y: number;
        rotation: number;
    };
    updateHandleTransform(transform: {
        x: number;
        y: number;
        rotation: number;
    }, delta: number[], axisModel: CartesianAxisModel, axisPointerModel: AxisPointerModel): {
        x: number;
        y: number;
        rotation: number;
        cursorPoint: number[];
        tooltipOption: {
            verticalAlign?: import("zrender/lib/core/types").TextVerticalAlign;
            align?: import("zrender/lib/core/types").TextAlign;
        };
    };
}
export default CartesianAxisPointer;
