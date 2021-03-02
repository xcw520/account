import ExtensionAPI from '../../ExtensionAPI';
import { ZRElementEvent } from '../../util/types';
declare type DispatchActionMethod = ExtensionAPI['dispatchAction'];
declare type Handler = (currTrigger: 'click' | 'mousemove' | 'leave', event: ZRElementEvent, dispatchAction: DispatchActionMethod) => void;
export declare function register(key: string, api: ExtensionAPI, handler?: Handler): void;
export declare function unregister(key: string, api: ExtensionAPI): void;
export {};
