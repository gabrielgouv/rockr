import { TemplateParser } from "../parsers/template-parser";
import { readFileSync } from "fs";
import { generateUniqueId } from "@rockr/rockr-core";
import path from "path";

export enum HttpMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    PATCH = 'patch'
}

export class EndpointScript {

    private readonly TEMPLATE_CUSTOM_SCRIPT = '../../templates/custom-script.template'
    private readonly TEMPLATE_ENDPOINT_SCRIPT = '../../templates/endpoint-script.template'

    constructor(private path: string, private httpMethod: HttpMethod = HttpMethod.GET, private customScript?: string) {
    }

    public withMethod(httpMethod: HttpMethod): EndpointScript {
        this.httpMethod = httpMethod
        return this
    }

    public useCustomScript(customScript: string): EndpointScript {
        this.customScript = customScript
        return this
    }

    public generate(): string {

        const customScriptTemplate = this.customScript ? this.customScript : readFileSync(path.resolve(__dirname, this.TEMPLATE_CUSTOM_SCRIPT)).toString()

        const customScriptParser = new TemplateParser(customScriptTemplate)
        const customScript = customScriptParser.parse()

        const variables: Map<string, any> = new Map()
        variables.set('CUSTOM_SCRIPT', customScript)
        variables.set('HTTP_METHOD', this.httpMethod)
        variables.set('ENDPOINT_UUID', generateUniqueId())
        variables.set('ENDPOINT_PATH', this.path)
        variables.set('REQ', generateUniqueId())
        variables.set('RES', generateUniqueId())

        const scriptParser = new TemplateParser(readFileSync(path.resolve(__dirname, this.TEMPLATE_ENDPOINT_SCRIPT)).toString(), variables)

        return scriptParser.parse()
    }

}