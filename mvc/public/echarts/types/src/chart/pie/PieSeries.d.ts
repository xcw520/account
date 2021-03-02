import SeriesModel from '../../model/Series';
import { SeriesOption, CallbackDataParams, CircleLayoutOptionMixin, LabelLineOption, ItemStyleOption, BoxLayoutOptionMixin, OptionDataValueNumeric, SeriesEncodeOptionMixin, OptionDataItemObject, StatesOptionMixin, DefaultExtraEmpasisState, SeriesLabelOption } from '../../util/types';
import List from '../../data/List';
interface PieItemStyleOption extends ItemStyleOption {
    borderRadius?: (number | string)[] | number | string;
}
export interface PieStateOption {
    itemStyle?: PieItemStyleOption;
    label?: PieLabelOption;
    labelLine?: PieLabelLineOption;
}
interface PieLabelOption extends Omit<SeriesLabelOption, 'rotate' | 'position'> {
    rotate?: number;
    alignTo?: 'none' | 'labelLine' | 'edge';
    edgeDistance?: string | number;
    bleedMargin?: number;
    distanceToLabelLine?: number;
    position?: SeriesLabelOption['position'] | 'outer' | 'inner' | 'center';
}
interface PieLabelLineOption extends LabelLineOption {
    maxSurfaceAngle?: number;
}
interface ExtraStateOption {
    emphasis?: {
        focus?: DefaultExtraEmpasisState['focus'];
        scale?: boolean;
        scaleSize?: number;
    };
}
export interface PieDataItemOption extends OptionDataItemObject<OptionDataValueNumeric>, PieStateOption, StatesOptionMixin<PieStateOption, ExtraStateOption> {
    cursor?: string;
}
export interface PieSeriesOption extends Omit<SeriesOption<PieStateOption, ExtraStateOption>, 'labelLine'>, PieStateOption, CircleLayoutOptionMixin, BoxLayoutOptionMixin, SeriesEncodeOptionMixin {
    type?: 'pie';
    roseType?: 'radius' | 'area';
    clockwise?: boolean;
    startAngle?: number;
    minAngle?: number;
    minShowLabelAngle?: number;
    selectedOffset?: number;
    avoidLabelOverlap?: boolean;
    percentPrecision?: number;
    stillShowZeroSum?: boolean;
    animationType?: 'expansion' | 'scale';
    animationTypeUpdate?: 'transition' | 'expansion';
    data?: OptionDataValueNumeric[] | OptionDataValueNumeric[][] | PieDataItemOption[];
}
declare class PieSeriesModel extends SeriesModel<PieSeriesOption> {
    static type: "series.pie";
    useColorPaletteOnData: boolean;
    init(option: PieSeriesOption): void;
    mergeOption(): void;
    getInitialData(this: PieSeriesModel): List;
    getDataParams(dataIndex: number): CallbackDataParams;
    private _defaultLabelLine;
    static defaultOption: Omit<PieSeriesOption, 'type'>;
}
export default PieSeriesModel;
