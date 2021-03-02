import ExtensionAPI from '../../ExtensionAPI';
import InsideZoomModel from './InsideZoomModel';
import { DataZoomGetRangeHandlers } from './InsideZoomView';
export declare function setViewInfoToCoordSysRecord(api: ExtensionAPI, dataZoomModel: InsideZoomModel, getRange: DataZoomGetRangeHandlers): void;
export declare function disposeCoordSysRecordIfNeeded(api: ExtensionAPI, dataZoomModel: InsideZoomModel): void;
