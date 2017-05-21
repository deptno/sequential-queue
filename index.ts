import {EventEmitter} from 'events';
import * as uuid from 'uuid';

enum QueueState {
    IDLE,
    RUNNING
}
export default class SequentialQueue extends EventEmitter {
    public static Event = {
        Done: 'Done'
    };
    private static event = {
        Queued: 'Queued',
        Start: 'Start',
        End: 'End'
    };
    private queue = [];
    private state = QueueState.IDLE;

    constructor() {
        super();
        this.on(SequentialQueue.event.Queued, this.handleQueued);
        this.on(SequentialQueue.event.Start, this.handleStart);
        this.on(SequentialQueue.event.End, this.handleEnd);
        this.on(SequentialQueue.Event.Done, this.handleDone);
    }
    push(operation: () => Promise<any>): Promise<any> {
        const id = uuid();
        this.queue.push({id, operation});
        this.emit(SequentialQueue.event.Queued);
        return new Promise(resolve => this.on(id, resolve));
    }
    private async run() {
        const {id, operation} = this.queue.shift();
        let result = null;

        this.emit(SequentialQueue.event.Start);
        try {
            result = await operation();
        } catch(ex) {
            console.error(`[AsyncQueue] queue operation fail: `, ex);
        } finally {
            this.emit(SequentialQueue.event.End, id, result);
        }
    }
    private handleQueued() {
        // console.log('[AsyncQueue] queued');
        if (this.state !== QueueState.RUNNING) {
            this.run();
        }
    }
    private handleStart() {
        // console.log('[AsyncQueue] start');
        if (this.state !== QueueState.RUNNING) {
            this.state = QueueState.RUNNING;
        }
    }
    private handleEnd(id, result) {
        // console.log('[AsyncQueue] end');
        this.emit(id, result);
        if (this.queue.length > 0) {
            return this.run();
        }
        this.emit(SequentialQueue.Event.Done);
    }
    private handleDone() {
        // console.log('[AsyncQueue] done');
        this.state = QueueState.IDLE;
    }
}
