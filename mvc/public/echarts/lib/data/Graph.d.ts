import { Dictionary } from 'zrender/lib/core/types';
import List from './List';
import Model from '../model/Model';
import Element from 'zrender/lib/Element';
declare class Graph {
    type: 'graph';
    readonly nodes: GraphNode[];
    readonly edges: GraphEdge[];
    data: List;
    edgeData: List;
    private _directed;
    private _nodesMap;
    private _edgesMap;
    constructor(directed?: boolean);
    isDirected(): boolean;
    addNode(id: string | number, dataIndex?: number): GraphNode;
    getNodeByIndex(dataIndex: number): GraphNode;
    getNodeById(id: string): GraphNode;
    addEdge(n1: GraphNode | number | string, n2: GraphNode | number | string, dataIndex?: number): GraphEdge;
    getEdgeByIndex(dataIndex: number): GraphEdge;
    getEdge(n1: string | GraphNode, n2: string | GraphNode): GraphEdge;
    eachNode<Ctx>(cb: (this: Ctx, node: GraphNode, idx: number) => void, context?: Ctx): void;
    eachEdge<Ctx>(cb: (this: Ctx, edge: GraphEdge, idx: number) => void, context?: Ctx): void;
    breadthFirstTraverse<Ctx>(cb: (this: Ctx, node: GraphNode, fromNode: GraphNode) => boolean | void, startNode: GraphNode | string, direction: 'none' | 'in' | 'out', context?: Ctx): void;
    update(): void;
    clone(): Graph;
}
declare class GraphNode {
    id: string;
    inEdges: GraphEdge[];
    outEdges: GraphEdge[];
    edges: GraphEdge[];
    hostGraph: Graph;
    dataIndex: number;
    __visited: boolean;
    constructor(id?: string, dataIndex?: number);
    degree(): number;
    inDegree(): number;
    outDegree(): number;
    getModel<T = unknown>(): Model<T>;
    getModel<T = unknown, S extends keyof T = keyof T>(path: S): Model<T[S]>;
    getAdjacentDataIndices(): {
        node: number[];
        edge: number[];
    };
}
declare class GraphEdge {
    node1: GraphNode;
    node2: GraphNode;
    dataIndex: number;
    hostGraph: Graph;
    constructor(n1: GraphNode, n2: GraphNode, dataIndex?: number);
    getModel<T = unknown>(): Model<T>;
    getModel<T = unknown, S extends keyof T = keyof T>(path: S): Model<T[S]>;
    getAdjacentDataIndices(): {
        node: number[];
        edge: number[];
    };
}
declare type GetDataName<Host> = Host extends GraphEdge ? 'edgeData' : 'data';
declare function createGraphDataProxyMixin<Host extends GraphEdge | GraphNode>(hostName: 'hostGraph', dataName: GetDataName<Host>): {
    getValue(this: Host, dimension?: string | number): string | number;
    setVisual(this: Host, key: string | Dictionary<any>, value?: any): void;
    getVisual(this: Host, key: string): any;
    setLayout(this: Host, layout: any, merge?: boolean): void;
    getLayout(this: Host): any;
    getGraphicEl(this: Host): Element<import("zrender/lib/Element").ElementProps>;
    getRawIndex(this: Host): number;
};
interface GraphEdge extends ReturnType<typeof createGraphDataProxyMixin> {
}
interface GraphNode extends ReturnType<typeof createGraphDataProxyMixin> {
}
export default Graph;
export { GraphNode, GraphEdge };
