import ComponentModel from '../model/Component';
import OrdinalMeta from '../data/OrdinalMeta';
import { DimensionName, OrdinalRawValue } from '../util/types';
import { AxisBaseOption } from './axisCommonTypes';
declare type Constructor<T> = new (...args: any[]) => T;
export interface AxisModelExtendedInCreator<Opt extends AxisBaseOption> {
    getCategories(rawData?: boolean): OrdinalRawValue[] | Opt['data'];
    getOrdinalMeta(): OrdinalMeta;
}
export default function axisModelCreator<AxisOptionT extends AxisBaseOption, AxisModelCtor extends Constructor<ComponentModel<AxisOptionT>>>(axisName: DimensionName, BaseAxisModelClass: AxisModelCtor, extraDefaultOption?: AxisOptionT): void;
export {};
