import { ElementEvent } from 'zrender/esm/Element';
import ExtensionAPI from '../../ExtensionAPI';
import { CoordinateSystem } from '../../coord/CoordinateSystem';
export declare function onIrrelevantElement(e: ElementEvent, api: ExtensionAPI, targetCoordSysModel: CoordinateSystem['model']): boolean;
