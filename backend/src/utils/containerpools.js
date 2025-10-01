import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

class ContainersPool {
    constructor(language, image, size = 3) {
        this.language = language;
        this.image = image;
        this.size = size;
        this.pool = [];
        this.busy = new Set();
        this.waitQueue = [];
    }

    async init() {
        for (const name of this.pool) {
            await execAsync(`docker rm -f ${name}`).catch(() => {});
        }
        this.pool = [];

        for (let i = 0; i < this.size; i++) {
            const name = `${this.language}_worker${i}`;
            await execAsync(
                `docker run -dit --name ${name} \
                 -v ${process.cwd()}/public:/usr/src/myapp \
                 -w /usr/src/myapp ${this.image} sleep infinity`
            );
            this.pool.push(name);
        }
    }

    async acquire() {
        const free = this.pool.find(c => !this.busy.has(c));
        if (free) {
            this.busy.add(free);
            return free;
        }

        return new Promise(resolve => {
            this.waitQueue.push(resolve);
        });
    }

    async release(name) {
        if (!this.busy.has(name)) return;

        this.busy.delete(name);

        if (this.waitQueue.length > 0) {
            const next = this.waitQueue.shift();
            this.busy.add(name);
            next(name);
        }
    }

    async cleanup() {
        for (const name of this.pool) {
            await execAsync(`docker rm -f ${name}`).catch(() => {});
        }
        this.pool = [];
        this.busy.clear();
        this.waitQueue = [];
    }
}

export const cons = {
    c: new ContainersPool("c", "gcc-gnu", 3),
    java: new ContainersPool("java", "java-gnu", 3),
    python: new ContainersPool("python", "py-gnu", 3),
    cpp: new ContainersPool("cpp", "gcc-gnu", 3),
    javascript: new ContainersPool("javascript", "js-gnu", 3)
};
