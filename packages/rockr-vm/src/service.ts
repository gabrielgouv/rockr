import { Endpoint } from "./endpoint";
import * as vm from "vm";
import { Context, generateUniqueId, logger } from "@rockr/rockr-core";
import { VmScript } from "@rockr/rockr-generate-script";

export class Service {

    private readonly serviceId: string
    private readonly endpoints: Endpoint[]

    constructor(private name: string, private port: number, private rootPath?: string) {
        this.serviceId = 'Service::' + generateUniqueId()
        this.endpoints = []
        logger.info(`Created ${this.tryGetServiceName()}`)
    }

    public createEndpoint(endpoint: Endpoint) {
        if (this.rootPath) {
            endpoint.setRootPath(this.rootPath)
        }
        this.endpoints.push(endpoint)
        logger.info(`Attached '${endpoint.getEndpointPath()}' (${endpoint.tryGetEndpointName()}) to ${this.tryGetServiceName()}`)
    }

    public addEndpoints(endpoints: Endpoint[]) {
        this.endpoints.push(...endpoints)
    }

    public getServiceId() {
        return this.serviceId
    }

    public tryGetServiceName(): string {
        return this.name ? 'Service::' + this.name : this.serviceId
    }

    public run() {
        logger.info(`Running ${this.tryGetServiceName()} on port ${this.port}`)
        vm.runInThisContext(this.getScript())(require, Context)
    }

    private getScript() {
        const vmScript = new VmScript(this.port)

        for (const endpoint of this.endpoints) {
            vmScript.addEndpointScript(endpoint.getScript())
        }

        return vmScript.generate()
    }

}