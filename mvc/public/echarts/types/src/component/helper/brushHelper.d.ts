import { RectLike } from 'zrender/esm/core/BoundingRect';
import ExtensionAPI from '../../ExtensionAPI';
import { ElementEvent } from 'zrender/esm/Element';
import ComponentModel from '../../model/Component';
export declare function makeRectPanelClipPath(rect: RectLike): (localPoints: number[][]) => number[][];
export declare function makeLinearBrushOtherExtent(rect: RectLike, specifiedXYIndex?: 0 | 1): (xyIndex: 0 | 1) => number[];
export declare function makeRectIsTargetByCursor(rect: RectLike, api: ExtensionAPI, targetModel: ComponentModel): (e: ElementEvent, localCursorPoint: number[]) => boolean;
