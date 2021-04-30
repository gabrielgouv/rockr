import * as vm from "vm";

export class VirtualMachine {

    constructor(private script: string) {
    }

    public run(): any {
        const script = new vm.Script(this.script);
        return script.runInNewContext({})
    }

}