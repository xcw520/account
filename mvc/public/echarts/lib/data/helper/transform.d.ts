import { OptionSourceData, DimensionDefinitionLoose, SourceFormat, DimensionDefinition, OptionDataItem, DimensionIndex, OptionDataValue, DimensionLoose, ParsedValue } from '../../util/types';
import { Source } from '../Source';
export declare type PipedDataTransformOption = DataTransformOption[];
export declare type DataTransformType = string;
export declare type DataTransformConfig = unknown;
export interface DataTransformOption {
    type: DataTransformType;
    config: DataTransformConfig;
    print?: boolean;
}
export interface ExternalDataTransform<TO extends DataTransformOption = DataTransformOption> {
    type: string;
    __isBuiltIn?: boolean;
    transform: (param: ExternalDataTransformParam<TO>) => ExternalDataTransformResultItem | ExternalDataTransformResultItem[];
}
interface ExternalDataTransformParam<TO extends DataTransformOption = DataTransformOption> {
    upstream: ExternalSource;
    upstreamList: ExternalSource[];
    config: TO['config'];
}
export interface ExternalDataTransformResultItem {
    data: OptionSourceData;
    dimensions?: DimensionDefinitionLoose[];
}
export interface ExternalDimensionDefinition extends Partial<DimensionDefinition> {
    index: DimensionIndex;
}
export declare class ExternalSource {
    sourceFormat: SourceFormat;
    getRawData(): Source['data'];
    getRawDataItem(dataIndex: number): OptionDataItem;
    cloneRawData(): Source['data'];
    getDimensionInfo(dim: DimensionLoose): ExternalDimensionDefinition;
    cloneAllDimensionInfo(): ExternalDimensionDefinition[];
    count(): number;
    retrieveValue(dataIndex: number, dimIndex: DimensionIndex): OptionDataValue;
    retrieveValueFromItem(dataItem: OptionDataItem, dimIndex: DimensionIndex): OptionDataValue;
    convertValue(rawVal: unknown, dimInfo: ExternalDimensionDefinition): ParsedValue;
}
export declare function registerExternalTransform(externalTransform: ExternalDataTransform): void;
export declare function applyDataTransform(rawTransOption: DataTransformOption | PipedDataTransformOption, sourceList: Source[], infoForPrint: {
    datasetIndex: number;
}): Source[];
export {};
