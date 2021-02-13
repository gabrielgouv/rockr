import { EndpointScript } from "./endpoint-script";
import { TemplateParser } from "../parsers/template-parser";
import { readFileSync } from "fs";
import path from 'path'

export class VmScript {

    private readonly TEMPLATE_VM_SCRIPT = '../../templates/vm-script.template'
    private readonly endpointScripts: EndpointScript[]
    private headers: Map<string, any>

    constructor(private readonly port: number) {
        this.endpointScripts = []
        this.headers = new Map()
    }

    public addEndpointScript(endpointScript: EndpointScript) {
        this.endpointScripts.push(endpointScript)
    }

    private mergeEndpointScripts(): string {
        let mergedScripts = ''
        for (const script of this.endpointScripts) {
            mergedScripts += script.generate() + '\n\n'
        }
        return mergedScripts
    }

    public generate(): string {
        const variablesWrapper = new Map<string, any>()
        variablesWrapper.set('LIBRARIES', '//') // TODO: generate libraries
        variablesWrapper.set('ENDPOINTS_SCRIPTS', this.mergeEndpointScripts())
        variablesWrapper.set('SERVICE_PORT', this.port)

        const scriptWrapper = new TemplateParser(readFileSync(path.resolve(__dirname, this.TEMPLATE_VM_SCRIPT)).toString(), variablesWrapper)

        return scriptWrapper.parse()
    }

}