import AxisView from './AxisView';
import GlobalModel from '../../model/Global';
import ExtensionAPI from '../../ExtensionAPI';
import CartesianAxisModel from '../../coord/cartesian/AxisModel';
import { Payload } from '../../util/types';
declare class CartesianAxisView extends AxisView {
    static type: string;
    type: string;
    axisPointerClass: string;
    private _axisGroup;
    render(axisModel: CartesianAxisModel, ecModel: GlobalModel, api: ExtensionAPI, payload: Payload): void;
    remove(): void;
}
export default CartesianAxisView;
