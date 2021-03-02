import { HashMap } from 'zrender/esm/core/util';
import { SourceFormat, SeriesLayoutBy, DimensionDefinition, OptionEncodeValue, OptionSourceData, DimensionName, OptionSourceHeader, DimensionDefinitionLoose, OptionEncode } from '../util/types';
export interface SourceMetaRawOption {
    seriesLayoutBy: SeriesLayoutBy;
    sourceHeader: OptionSourceHeader;
    dimensions: DimensionDefinitionLoose[];
}
export interface Source extends SourceImpl {
}
declare class SourceImpl {
    readonly data: OptionSourceData;
    readonly sourceFormat: SourceFormat;
    readonly seriesLayoutBy: SeriesLayoutBy;
    readonly dimensionsDefine: DimensionDefinition[];
    readonly encodeDefine: HashMap<OptionEncodeValue, DimensionName>;
    readonly startIndex: number;
    readonly dimensionsDetectedCount: number;
    readonly metaRawOption: SourceMetaRawOption;
    constructor(fields: {
        data: OptionSourceData;
        sourceFormat: SourceFormat;
        seriesLayoutBy?: SeriesLayoutBy;
        dimensionsDefine?: DimensionDefinition[];
        startIndex?: number;
        dimensionsDetectedCount?: number;
        metaRawOption?: SourceMetaRawOption;
        encodeDefine?: HashMap<OptionEncodeValue, DimensionName>;
    });
}
export declare function isSourceInstance(val: unknown): val is Source;
export declare function createSource(sourceData: OptionSourceData, thisMetaRawOption: SourceMetaRawOption, sourceFormat: SourceFormat, encodeDefine: OptionEncode): Source;
export declare function createSourceFromSeriesDataOption(data: OptionSourceData): Source;
export declare function cloneSourceShallow(source: Source): Source;
export {};
