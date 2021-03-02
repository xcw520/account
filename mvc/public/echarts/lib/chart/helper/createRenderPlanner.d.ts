import SeriesModel from '../../model/Series';
export default function createRenderPlanner(): (seriesModel: SeriesModel<import("../../util/types").SeriesOption<any, import("../../util/types").DefaultExtraStateOpts>>) => import("../../stream/task").TaskPlanCallbackReturn;
