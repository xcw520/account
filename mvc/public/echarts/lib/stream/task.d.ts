import SeriesModel from '../model/Series';
import { Pipeline } from './Scheduler';
import { Payload } from '../util/types';
import List from '../data/List';
export interface TaskContext {
    outputData?: List;
    data?: List;
    payload?: Payload;
    model?: SeriesModel;
}
export declare type TaskResetCallback<Ctx extends TaskContext> = (this: Task<Ctx>, context: Ctx) => TaskResetCallbackReturn<Ctx>;
export declare type TaskResetCallbackReturn<Ctx extends TaskContext> = void | (TaskProgressCallback<Ctx> | TaskProgressCallback<Ctx>[]) | {
    forceFirstProgress?: boolean;
    progress: TaskProgressCallback<Ctx> | TaskProgressCallback<Ctx>[];
};
export declare type TaskProgressCallback<Ctx extends TaskContext> = (this: Task<Ctx>, params: TaskProgressParams, context: Ctx) => void;
export declare type TaskProgressParams = {
    start: number;
    end: number;
    count: number;
    next?: TaskDataIteratorNext;
};
export declare type TaskPlanCallback<Ctx extends TaskContext> = (this: Task<Ctx>, context: Ctx) => TaskPlanCallbackReturn;
export declare type TaskPlanCallbackReturn = 'reset' | false | null | undefined;
export declare type TaskCountCallback<Ctx extends TaskContext> = (this: Task<Ctx>, context: Ctx) => number;
export declare type TaskOnDirtyCallback<Ctx extends TaskContext> = (this: Task<Ctx>, context: Ctx) => void;
declare type TaskDataIteratorNext = () => number;
declare type TaskDefineParam<Ctx extends TaskContext> = {
    reset?: TaskResetCallback<Ctx>;
    plan?: TaskPlanCallback<Ctx>;
    count?: TaskCountCallback<Ctx>;
    onDirty?: TaskOnDirtyCallback<Ctx>;
};
export declare type PerformArgs = {
    step?: number;
    skip?: boolean;
    modBy?: number;
    modDataCount?: number;
};
export declare function createTask<Ctx extends TaskContext>(define: TaskDefineParam<Ctx>): Task<Ctx>;
export declare class Task<Ctx extends TaskContext> {
    private _reset;
    private _plan;
    private _count;
    private _onDirty;
    private _progress;
    private _callingProgress;
    private _dirty;
    private _modBy;
    private _modDataCount;
    private _upstream;
    private _downstream;
    private _dueEnd;
    private _outputDueEnd;
    private _settedOutputEnd;
    private _dueIndex;
    private _disposed;
    __pipeline: Pipeline;
    __idxInPipeline: number;
    __block: boolean;
    context: Ctx;
    constructor(define: TaskDefineParam<Ctx>);
    perform(performArgs?: PerformArgs): boolean;
    dirty(): void;
    private _doProgress;
    private _doReset;
    unfinished(): boolean;
    pipe(downTask: Task<Ctx>): void;
    dispose(): void;
    getUpstream(): Task<Ctx>;
    getDownstream(): Task<Ctx>;
    setOutputEnd(end: number): void;
}
export {};
