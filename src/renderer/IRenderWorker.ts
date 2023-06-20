import { type Worker } from "worker_threads";

export interface IRenderWorker
{
	buffer: SharedArrayBuffer;
	worker: Worker;
}
