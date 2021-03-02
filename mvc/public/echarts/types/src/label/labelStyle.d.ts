import ZRText, { TextStyleProps } from 'zrender/esm/graphic/Text';
import Element, { ElementTextConfig } from 'zrender/esm/Element';
import Model from '../model/Model';
import { LabelOption, DisplayState, TextCommonOption, ParsedValue, CallbackDataParams, StatesOptionMixin, DisplayStateNonNormal, ColorString, ZRStyleProps } from '../util/types';
import GlobalModel from '../model/Global';
import List from '../data/List';
import SeriesModel from '../model/Series';
declare type TextCommonParams = {
    disableBox?: boolean;
    inheritColor?: ColorString;
    defaultOpacity?: number;
    defaultOutsidePosition?: LabelOption['position'];
    textStyle?: ZRStyleProps;
};
interface SetLabelStyleOpt<LDI> extends TextCommonParams {
    defaultText?: string | ((labelDataIndex: LDI, opt: SetLabelStyleOpt<LDI>, overrideValue?: ParsedValue | ParsedValue[]) => string);
    labelFetcher?: {
        getFormattedLabel: (labelDataIndex: LDI, status: DisplayState, dataType?: string, labelDimIndex?: number, formatter?: string | ((params: object) => string), extendParams?: Partial<CallbackDataParams>) => string;
    };
    labelDataIndex?: LDI;
    labelDimIndex?: number;
    enableTextSetter?: boolean;
}
declare type LabelModel = Model<LabelOption & {
    formatter?: string | ((params: any) => string);
    showDuringLabel?: boolean;
}>;
declare type LabelModelForText = Model<Omit<LabelOption, 'position' | 'rotate'> & {
    formatter?: string | ((params: any) => string);
}>;
declare type LabelStatesModels<LabelModel> = Partial<Record<DisplayStateNonNormal, LabelModel>> & {
    normal: LabelModel;
};
export declare function setLabelText(label: ZRText, labelTexts: Record<DisplayState, string>): void;
export declare function getLabelText<LDI>(opt: SetLabelStyleOpt<LDI>, stateModels?: LabelStatesModels<LabelModel>, overrideValue?: ParsedValue | ParsedValue[]): Record<DisplayState, string>;
declare function setLabelStyle<LDI>(targetEl: ZRText, labelStatesModels: LabelStatesModels<LabelModelForText>, opt?: SetLabelStyleOpt<LDI>, stateSpecified?: Partial<Record<DisplayState, TextStyleProps>>): void;
declare function setLabelStyle<LDI>(targetEl: Element, labelStatesModels: LabelStatesModels<LabelModel>, opt?: SetLabelStyleOpt<LDI>, stateSpecified?: Partial<Record<DisplayState, TextStyleProps>>): void;
export { setLabelStyle };
export declare function getLabelStatesModels<LabelName extends string = 'label'>(itemModel: Model<StatesOptionMixin<any> & Partial<Record<LabelName, any>>>, labelName?: LabelName): Record<DisplayState, LabelModel>;
export declare function createTextStyle(textStyleModel: Model, specifiedTextStyle?: TextStyleProps, opt?: Pick<TextCommonParams, 'inheritColor' | 'disableBox'>, isNotNormal?: boolean, isAttached?: boolean): TextStyleProps;
export declare function createTextConfig(textStyleModel: Model, opt?: Pick<TextCommonParams, 'defaultOutsidePosition' | 'inheritColor'>, isNotNormal?: boolean): ElementTextConfig;
export declare function getFont(opt: Pick<TextCommonOption, 'fontStyle' | 'fontWeight' | 'fontSize' | 'fontFamily'>, ecModel: GlobalModel): string;
export declare const labelInner: (hostObj: ZRText) => {
    prevValue?: string | number | (string | number)[];
    value?: string | number | (string | number)[];
    valueAnimation?: boolean;
    precision?: LineAndPositionSetting;
    statesModels?: LabelStatesModels<LabelModelForText>;
    defaultInterpolatedText?: (value: string | number | (string | number)[]) => string;
    setLabelText?(overrideValue?: string | number | (string | number)[]): void;
};
export declare function setLabelValueAnimation(label: ZRText, labelStatesModels: LabelStatesModels<LabelModelForText>, value: ParsedValue | ParsedValue[], getDefaultText: (value: ParsedValue[] | ParsedValue) => string): void;
export declare function animateLabelValue(textEl: ZRText, dataIndex: number, data: List, seriesModel: SeriesModel): void;
