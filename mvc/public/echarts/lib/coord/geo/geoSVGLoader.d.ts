import Group from 'zrender/lib/graphic/Group';
import BoundingRect from 'zrender/lib/core/BoundingRect';
import { SVGMapRecord } from './mapDataStorage';
declare const _default: {
    load(mapName: string, mapRecord: SVGMapRecord): {
        root: Group;
        boundingRect: BoundingRect;
    };
    makeGraphic(mapName: string, mapRecord: SVGMapRecord, hostKey: string): Group;
    removeGraphic(mapName: string, mapRecord: SVGMapRecord, hostKey: string): void;
};
export default _default;
