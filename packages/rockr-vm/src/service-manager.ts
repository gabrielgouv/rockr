import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { Service } from "./service";
import { logger } from "@rockr/rockr-core";

export class ServiceManager {

    private services: Map<string, Service>
    private serviceProcesses: Map<string, ChildProcessWithoutNullStreams>

    constructor() {
        this.services = new Map()
        this.serviceProcesses = new Map()
    }

    public registerService(service: Service): string {
        this.services.set(service.getServiceId(), service)
        logger.info(`ProcessManager: Registered service ${service.getServiceId()}`)
        return service.getServiceId()
    }

    public unregisterService(serviceId: string) {
        const service = this.services.get(serviceId)

        if (service) {
            console.log('Removing service...')
            this.services.delete(serviceId)
            const serviceProcess = this.serviceProcesses.get(serviceId)
            if (serviceProcess) {
                console.log('Found running service process...')
                console.log('Killing service process...')
                serviceProcess.kill('SIGINT')
                console.log('Removing service process...')
                this.serviceProcesses.delete(serviceId)
            }
        }
    }

    public startServiceProcess(serviceId: string) {
        console.log('Starting service process: ' + serviceId)

        this.services.get(serviceId).run()
        // const proc: ChildProcessWithoutNullStreams = spawn('node', ['dist/index.js'])
        //
        // if (!proc) {
        //     console.log('Cannot start process with ' + serviceId)
        //     return
        // }
        //
        // proc.stdout.on('data', (data) => {
        //     console.log(`${data}`);
        // });
        //
        // proc.stderr.on('data', (data) => {
        //     console.error(`error: ${data}`);
        // });

        this.serviceProcesses.set(serviceId, null)

        console.log('Started process for service: ' + serviceId)
    }

    public stopServiceProcess(serviceId: string) {
        const process = this.serviceProcesses.get(serviceId)

        if (!process) {
            console.log(`Service ${serviceId} is not running`)
            return
        }

        process.kill('SIGINT')
        this.serviceProcesses.delete(serviceId)
    }

}
//
//
// const proc: ChildProcessWithoutNullStreams = spawn('node', ['dist/index.js'])
//
// proc.stdout.on('data', (data) => {
//     console.log(`${data}`);
// });
//
// proc.stderr.on('data', (data) => {
//     console.error(`erro: ${data}`);
// });