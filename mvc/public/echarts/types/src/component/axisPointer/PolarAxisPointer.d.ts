import BaseAxisPointer, { AxisPointerElementOptions } from './BaseAxisPointer';
import { OptionDataValue, CommonAxisPointerOption } from '../../util/types';
import { PolarAxisModel } from '../../coord/polar/AxisModel';
import ExtensionAPI from '../../ExtensionAPI';
import Model from '../../model/Model';
declare class PolarAxisPointer extends BaseAxisPointer {
    makeElOption(elOption: AxisPointerElementOptions, value: OptionDataValue, axisModel: PolarAxisModel, axisPointerModel: Model<CommonAxisPointerOption>, api: ExtensionAPI): void;
}
export default PolarAxisPointer;
