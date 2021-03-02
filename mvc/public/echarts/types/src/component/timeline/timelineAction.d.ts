import { Payload } from '../../util/types';
export interface TimelineChangePayload extends Payload {
    type: 'timelineChange';
    currentIndex: number;
}
export interface TimelinePlayChangePayload extends Payload {
    type: 'timelinePlayChange';
    playState: boolean;
}
