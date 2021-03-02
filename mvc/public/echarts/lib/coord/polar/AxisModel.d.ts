import ComponentModel from '../../model/Component';
import { AxisModelExtendedInCreator } from '../axisModelCreator';
import { AxisModelCommonMixin } from '../axisModelCommonMixin';
import { AxisBaseOption } from '../axisCommonTypes';
import AngleAxis from './AngleAxis';
import RadiusAxis from './RadiusAxis';
import { AxisBaseModel } from '../AxisBaseModel';
export interface AngleAxisOption extends AxisBaseOption {
    polarIndex?: number;
    polarId?: string;
    startAngle?: number;
    clockwise?: boolean;
    splitNumber?: number;
    axisLabel?: Omit<AxisBaseOption['axisLabel'], 'rotate'> & {
        rotate?: AxisBaseOption['axisLabel']['rotate'];
    };
}
export interface RadiusAxisOption extends AxisBaseOption {
    polarIndex?: number;
    polarId?: string;
}
declare type PolarAxisOption = AngleAxisOption | RadiusAxisOption;
declare class PolarAxisModel<T extends PolarAxisOption = PolarAxisOption> extends ComponentModel<T> implements AxisBaseModel<T> {
    static type: string;
    axis: AngleAxis | RadiusAxis;
    getCoordSysModel(): ComponentModel;
}
interface PolarAxisModel<T extends PolarAxisOption = PolarAxisOption> extends AxisModelCommonMixin<T>, AxisModelExtendedInCreator<T> {
}
export { PolarAxisModel };
export declare class AngleAxisModel extends PolarAxisModel<AngleAxisOption> {
    static type: string;
    type: string;
    axis: AngleAxis;
}
export declare class RadiusAxisModel extends PolarAxisModel<RadiusAxisOption> {
    static type: string;
    type: string;
    axis: RadiusAxis;
}
