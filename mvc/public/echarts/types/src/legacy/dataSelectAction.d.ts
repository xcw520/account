import GlobalModel from '../model/Global';
import Eventful from 'zrender/esm/core/Eventful';
import type { EChartsType, registerAction } from '../echarts';
export declare function createLegacyDataSelectAction(seriesType: string, ecRegisterAction: typeof registerAction): void;
export declare function handleLegacySelectEvents(messageCenter: Eventful, ecIns: EChartsType, ecModel: GlobalModel): void;
