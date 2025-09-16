import {execSync} from "child_process"
class ContainersPool{
    constructor(language,image,size=3){
        this.language=language;
        this.image=image;
        this.size=size;
        this.pool=[];
        this.busy=new Set();
    }
    init(){
        for(const name of this.pool){
            execSync(`docker rm -f ${name}`)
        }
        for(let i=0;i<this.size;i++){
            const name=`${this.language}_worker${i}`
            execSync(
            `docker run -dit --name ${name} \
             -v ${process.cwd()}/public:/usr/src/myapp \
             -w /usr/src/myapp ${this.image} sleep infinity`
        );
            this.pool.push(name);
        }
    }
    acquire(){
        const free=this.pool.find(c=>!this.busy.has(c))
        if(!free) return null;
        this.busy.add(free);
        return free;
    }
    release(name){
        this.busy.delete(name)
    }
    cleanup(){
        for(const name of this.pool){
            execSync(`docker rm -f ${name}`)
        }
    }
}
export const cons={
    c: new ContainersPool("c","gcc-gnu",3),
    java: new ContainersPool("java","java-gnu",3),
    python: new ContainersPool("python","py-gnu",3),
    cpp: new ContainersPool("cpp","gcc-gnu",3),
    javascript: new ContainersPool("javascript","js-gnu",3)
};