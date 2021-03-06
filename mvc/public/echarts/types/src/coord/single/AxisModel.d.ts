import ComponentModel from '../../model/Component';
import { AxisModelExtendedInCreator } from '../axisModelCreator';
import { AxisModelCommonMixin } from '../axisModelCommonMixin';
import Single from './Single';
import SingleAxis from './SingleAxis';
import { AxisBaseOption } from '../axisCommonTypes';
import { BoxLayoutOptionMixin, LayoutOrient } from '../../util/types';
import { AxisBaseModel } from '../AxisBaseModel';
export declare type SingleAxisPosition = 'top' | 'bottom' | 'left' | 'right';
export interface SingleAxisOption extends AxisBaseOption, BoxLayoutOptionMixin {
    position?: SingleAxisPosition;
    orient?: LayoutOrient;
}
declare class SingleAxisModel extends ComponentModel<SingleAxisOption> implements AxisBaseModel<SingleAxisOption> {
    static type: string;
    type: string;
    static readonly layoutMode = "box";
    axis: SingleAxis;
    coordinateSystem: Single;
    getCoordSysModel(): this;
    static defaultOption: SingleAxisOption;
}
interface SingleAxisModel extends AxisModelCommonMixin<SingleAxisOption>, AxisModelExtendedInCreator<SingleAxisOption> {
}
export default SingleAxisModel;
