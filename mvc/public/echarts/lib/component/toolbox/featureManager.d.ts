import { Dictionary, DisplayState, ZRElementEvent, ItemStyleOption, LabelOption } from '../../util/types';
import Model from '../../model/Model';
import GlobalModel from '../../model/Global';
import ExtensionAPI from '../../ExtensionAPI';
import Displayable from 'zrender/lib/graphic/Displayable';
declare type IconStyle = ItemStyleOption & {
    textFill?: LabelOption['color'];
    textBackgroundColor?: LabelOption['backgroundColor'];
    textPosition?: LabelOption['position'];
    textAlign?: LabelOption['align'];
    textBorderRadius?: LabelOption['borderRadius'];
    textPadding?: LabelOption['padding'];
};
export interface ToolboxFeatureOption {
    show?: boolean;
    title?: string | Dictionary<string>;
    icon?: string | Dictionary<string>;
    iconStyle?: IconStyle;
    emphasis?: {
        iconStyle?: IconStyle;
    };
    iconStatus?: Dictionary<DisplayState>;
    onclick?: () => void;
}
export interface ToolboxFeatureModel<Opts extends ToolboxFeatureOption = ToolboxFeatureOption> extends Model<Opts> {
    iconPaths: Dictionary<Displayable>;
    setIconStatus(iconName: string, status: DisplayState): void;
}
interface ToolboxFeature<Opts extends ToolboxFeatureOption = ToolboxFeatureOption> {
    getIcons?(): Dictionary<string>;
    onclick(ecModel: GlobalModel, api: ExtensionAPI, type: string, event: ZRElementEvent): void;
    dispose?(ecModel: GlobalModel, api: ExtensionAPI): void;
    remove?(ecModel: GlobalModel, api: ExtensionAPI): void;
    render(featureModel: ToolboxFeatureModel, model: GlobalModel, api: ExtensionAPI, payload: unknown): void;
    updateView?(featureModel: ToolboxFeatureModel, model: GlobalModel, api: ExtensionAPI, payload: unknown): void;
}
declare abstract class ToolboxFeature<Opts extends ToolboxFeatureOption = ToolboxFeatureOption> {
    uid: string;
    model: ToolboxFeatureModel<Opts>;
    ecModel: GlobalModel;
    api: ExtensionAPI;
    unusable?: boolean;
}
export { ToolboxFeature };
export interface UserDefinedToolboxFeature {
    uid: string;
    model: ToolboxFeatureModel;
    ecModel: GlobalModel;
    api: ExtensionAPI;
    featureName?: string;
    onclick(): void;
}
declare type ToolboxFeatureCtor = {
    new (): ToolboxFeature;
    defaultOption?: ToolboxFeatureOption;
    getDefaultOption?: (ecModel: GlobalModel) => ToolboxFeatureOption;
};
export declare function registerFeature(name: string, ctor: ToolboxFeatureCtor): void;
export declare function getFeature(name: string): ToolboxFeatureCtor;
