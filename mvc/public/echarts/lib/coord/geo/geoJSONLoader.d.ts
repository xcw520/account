import { GeoJSONMapRecord } from './mapDataStorage';
import BoundingRect from 'zrender/lib/core/BoundingRect';
import Region from './Region';
declare const _default: {
    load(mapName: string, mapRecord: GeoJSONMapRecord, nameProperty: string): {
        regions: Region[];
        boundingRect: BoundingRect;
    };
};
export default _default;
