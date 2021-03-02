import ExtensionAPI from '../ExtensionAPI';
import { OptionPreprocessor, ECUnitOption, ECOption } from '../util/types';
import GlobalModel, { InnerSetOptionOpts } from './Global';
declare class OptionManager {
    private _api;
    private _timelineOptions;
    private _mediaList;
    private _mediaDefault;
    private _currentMediaIndices;
    private _optionBackup;
    private _newBaseOption;
    constructor(api: ExtensionAPI);
    setOption(rawOption: ECOption, optionPreprocessorFuncs: OptionPreprocessor[], opt: InnerSetOptionOpts): void;
    mountOption(isRecreate: boolean): ECUnitOption;
    getTimelineOption(ecModel: GlobalModel): ECUnitOption;
    getMediaOption(ecModel: GlobalModel): ECUnitOption[];
}
export default OptionManager;
