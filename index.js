"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var uuid = require("uuid");
var QueueState;
(function (QueueState) {
    QueueState[QueueState["IDLE"] = 0] = "IDLE";
    QueueState[QueueState["RUNNING"] = 1] = "RUNNING";
})(QueueState || (QueueState = {}));
var SequentialQueue = (function (_super) {
    __extends(SequentialQueue, _super);
    function SequentialQueue() {
        var _this = _super.call(this) || this;
        _this.queue = [];
        _this.state = QueueState.IDLE;
        _this.on(SequentialQueue.event.Queued, _this.handleQueued);
        _this.on(SequentialQueue.event.Start, _this.handleStart);
        _this.on(SequentialQueue.event.End, _this.handleEnd);
        _this.on(SequentialQueue.Event.Done, _this.handleDone);
        return _this;
    }
    SequentialQueue.prototype.push = function (operation) {
        var _this = this;
        var id = uuid();
        this.queue.push({ id: id, operation: operation });
        this.emit(SequentialQueue.event.Queued);
        return new Promise(function (resolve) { return _this.on(id, resolve); });
    };
    SequentialQueue.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, operation, result, ex_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.queue.shift(), id = _a.id, operation = _a.operation;
                        result = null;
                        this.emit(SequentialQueue.event.Start);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, operation()];
                    case 2:
                        result = _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        ex_1 = _b.sent();
                        console.error("[AsyncQueue] queue operation fail: ", ex_1);
                        return [3 /*break*/, 5];
                    case 4:
                        this.emit(SequentialQueue.event.End, id, result);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SequentialQueue.prototype.handleQueued = function () {
        // console.log('[AsyncQueue] queued');
        if (this.state !== QueueState.RUNNING) {
            this.run();
        }
    };
    SequentialQueue.prototype.handleStart = function () {
        // console.log('[AsyncQueue] start');
        if (this.state !== QueueState.RUNNING) {
            this.state = QueueState.RUNNING;
        }
    };
    SequentialQueue.prototype.handleEnd = function (id, result) {
        // console.log('[AsyncQueue] end');
        this.emit(id, result);
        if (this.queue.length > 0) {
            return this.run();
        }
        this.emit(SequentialQueue.Event.Done);
    };
    SequentialQueue.prototype.handleDone = function () {
        // console.log('[AsyncQueue] done');
        this.state = QueueState.IDLE;
    };
    return SequentialQueue;
}(events_1.EventEmitter));
SequentialQueue.Event = {
    Done: 'Done'
};
SequentialQueue.event = {
    Queued: 'Queued',
    Start: 'Start',
    End: 'End'
};
exports.default = SequentialQueue;
