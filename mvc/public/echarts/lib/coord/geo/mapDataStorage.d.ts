import { parseXML } from 'zrender/lib/tool/parseSVG';
import { GeoSpecialAreas, GeoJSON, GeoJSONCompressed } from './geoTypes';
declare type SVGMapSource = 'string' | Document | SVGElement;
declare type GeoJSONMapSource = 'string' | GeoJSON | GeoJSONCompressed;
declare type MapInputObject = {
    geoJSON?: GeoJSONMapSource;
    geoJson?: GeoJSONMapSource;
    svg?: SVGMapSource;
    specialAreas?: GeoSpecialAreas;
};
export declare type MapRecord = GeoJSONMapRecord | SVGMapRecord;
export interface GeoJSONMapRecord {
    type: 'geoJSON';
    source: GeoJSONMapSource;
    specialAreas: GeoSpecialAreas;
    geoJSON: GeoJSON | GeoJSONCompressed;
}
export interface SVGMapRecord {
    type: 'svg';
    source: SVGMapSource;
    specialAreas: GeoSpecialAreas;
    svgXML: ReturnType<typeof parseXML>;
}
declare const _default: {
    registerMap: (mapName: string, rawDef: "string" | GeoJSON | GeoJSONCompressed | MapInputObject | MapRecord[], rawSpecialAreas?: GeoSpecialAreas) => MapRecord[];
    retrieveMap: (mapName: string) => MapRecord[];
};
export default _default;
