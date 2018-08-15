# sequential-queue
[![npm](https://img.shields.io/npm/dt/sequential-queue.svg?style=for-the-badge)](https://www.npmjs.com/package/sequential-queue)

> simple sequential queue

## install

```bash
npm install --save sequential-queue
```

## usage

### api

#### push(job: Promise<any>): Promise<any>;

### event

### DONE
sequential queue is empty;

## example

```typescript
import SequentialQueue from 'sequential-queue';

const queue = new SequentialQueue();

queue.on(SequentialQueue.Event.Done, () => {
    // done: empty queue;
});

const somethingAsyncFunction = () => new Promise(resolve => setTimeout(resolve, 1000));

//push returns promise input arguments resolved
const result = queue
    .push(somethingAsyncFunction())
    .then(() => 'done!');

console.log(result);
// done!

```
## related
- https://github.com/deptno/class-zangsisi

## license
MIT
