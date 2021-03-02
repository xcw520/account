import { DataHost, DisplayState, CallbackDataParams, OptionDataValue, SeriesDataType } from '../../util/types';
import GlobalModel from '../Global';
import { TooltipMarkupBlockFragment } from '../../component/tooltip/tooltipMarkup';
export interface DataFormatMixin extends DataHost {
    ecModel: GlobalModel;
    mainType: string;
    subType: string;
    componentIndex: number;
    id: string;
    name: string;
    animatedValue: OptionDataValue[];
}
export declare class DataFormatMixin {
    getDataParams(dataIndex: number, dataType?: SeriesDataType): CallbackDataParams;
    getFormattedLabel(dataIndex: number, status?: DisplayState, dataType?: SeriesDataType, labelDimIndex?: number, formatter?: string | ((params: object) => string), extendParams?: Partial<CallbackDataParams>): string;
    getRawValue(idx: number, dataType?: SeriesDataType): unknown;
    formatTooltip(dataIndex: number, multipleSeries?: boolean, dataType?: string): TooltipFormatResult;
}
declare type TooltipFormatResult = string | TooltipMarkupBlockFragment;
export declare function normalizeTooltipFormatResult(result: TooltipFormatResult): {
    markupFragment: TooltipMarkupBlockFragment;
    markupText: string;
};
export {};
