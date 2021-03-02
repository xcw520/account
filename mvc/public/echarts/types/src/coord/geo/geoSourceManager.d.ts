import { HashMap } from 'zrender/esm/core/util';
import BoundingRect from 'zrender/esm/core/BoundingRect';
import { NameMap } from './geoTypes';
import Region from './Region';
import Group from 'zrender/esm/graphic/Group';
declare const _default: {
    load: (mapName: string, nameMap: NameMap, nameProperty?: string) => {
        regions: Region[];
        regionsMap: HashMap<Region, string | number>;
        nameCoordMap: HashMap<number[], string | number>;
        boundingRect: BoundingRect;
    };
    makeGraphic: (mapName: string, hostKey: string) => Group[];
    removeGraphic: (mapName: string, hostKey: string) => void;
};
export default _default;
