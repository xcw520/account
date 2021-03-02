import GlobalModel from './model/Global';
import ExtensionAPI from './ExtensionAPI';
import { CoordinateSystemCreator, CoordinateSystemMaster } from './coord/CoordinateSystem';
declare class CoordinateSystemManager {
    private _coordinateSystems;
    create(ecModel: GlobalModel, api: ExtensionAPI): void;
    update(ecModel: GlobalModel, api: ExtensionAPI): void;
    getCoordinateSystems(): CoordinateSystemMaster[];
    static register: (type: string, creator: CoordinateSystemCreator) => void;
    static get: (type: string) => CoordinateSystemCreator;
}
export default CoordinateSystemManager;
