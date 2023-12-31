import { ServerBoostrap } from './bootstraps/server.bootstrap';
import { Context, Runtime } from './common/context';

const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));

async function start() {
    await delay(5000);
    new ServerBoostrap().run(new Context(Runtime.Server));
}

start();
