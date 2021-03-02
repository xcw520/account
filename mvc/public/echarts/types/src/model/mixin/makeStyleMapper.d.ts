import { PathStyleProps } from 'zrender/esm/graphic/Path';
import Model from '../Model';
export default function makeStyleMapper(properties: readonly string[][], ignoreParent?: boolean): (model: Model<any>, excludes?: readonly string[], includes?: readonly string[]) => PathStyleProps;
