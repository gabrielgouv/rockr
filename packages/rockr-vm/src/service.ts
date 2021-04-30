import { Endpoint } from "./endpoint";
import {Context, generateIdByName, logger, parseToKebabCase} from "@rockr/rockr-core";
import { VmScript } from "@rockr/rockr-generate-script";
import {VirtualMachine} from "./virtual-machine";

export class Service {

    private readonly serviceId: string
    private readonly endpoints: Endpoint[]
    private virtualMachine: VirtualMachine

    constructor(private readonly name: string, private port: number, private rootPath?: string) {
        this.name = parseToKebabCase(this.name)
        this.serviceId = 'Service::' + generateIdByName(this.name)
        this.endpoints = []
        logger.info(`Created ${this.serviceId}`)
    }

    public createEndpoint(endpoint: Endpoint) {
        if (this.rootPath) {
            endpoint.setRootPath(this.rootPath)
        }
        this.endpoints.push(endpoint)
        logger.info(`Attached '${endpoint.getEndpointPath()}' (${endpoint.getEndpointId()}) to ${this.serviceId}`)
    }

    public addEndpoints(endpoints: Endpoint[]) {
        this.endpoints.push(...endpoints)
    }

    public getServiceId() {
        return this.serviceId
    }

    public run() {
        new VirtualMachine(this.getScript()).run()(require, Context)
        logger.info(`Running ${this.serviceId} on http://localhost:${this.port}/`)
    }

    private getScript() {
        const vmScript = new VmScript(this.port)

        for (const endpoint of this.endpoints) {
            vmScript.addEndpointScript(endpoint.getScript())
        }

        return vmScript.generate()
    }

}