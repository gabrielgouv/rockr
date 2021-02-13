import { generateUniqueId, Variable} from "..";
import { Response, Request } from "express";

export class Context {

    public readonly contextId: string
    public internal: Context.Internal
    public endpointPath: string
    public variables: Variable[]
    private response: any
    private responseHeaders: Map<string, string>

    constructor(endpointPath: string) {
        this.endpointPath = endpointPath
        this.contextId = 'Context::' + generateUniqueId()
        this.internal = new Context.Internal(this)
        this.responseHeaders = new Map()
    }

    public setResponseHeaders(responseHeaders: Map<string, string>): void {
        this.responseHeaders = responseHeaders
        console.log(`Added ${this.responseHeaders.size} response headers'`)
    }

    public setResponseHeader(key: string, value: string): void {
        this.responseHeaders.set(key, value)
        console.log(`Added response header: '${key}' -> '${value}'`)
    }

    public removeResponseHeader(key: string): void {
        this.responseHeaders.delete(key)
        console.log(`Removed response header: '${key}'`)
    }

    public setVariable(variableName: string, value: any): boolean {
        console.log(`Request to set value '${value}' to variable '${variableName}'`)
        for (const variable of this.variables) {
            if (variable.name === variableName && variable.dynamic) {
                variable.value = value
                console.log(`Successfully set value '${value}' to variable '${variable.name}'`)
                return true
            }
        }
        console.log(`Cannot set value '${value}' to variable '${variableName}'. Dynamic variable not found.`)
        return false
    }

    public setResponse(response: any): void {
        this.response = response
        console.log(`Set response via function'`)
    }

    public reply(response?: any) {
        this.setupResponseHeaders()
        return this.internal.res.send(response ? response : this.response)
    }

    private setupResponseHeaders() {
        for (const [key, value] of this.responseHeaders) {
            this.internal.res.header(key, value)
        }
    }

}

export namespace Context {
    export class Internal {

        public req: Request
        public res: Response

        constructor(private parent: Context) {
        }

        public updateContext(req: Request, res: Response, endpointPath: string) {
            this.req = req
            this.res = res
            this.parent.endpointPath = endpointPath
            console.log(`[INTERNAL] Updated context for '${this.parent.endpointPath}' (${this.parent.contextId})`)
        }

        public getParent() {
            return this.parent
        }

    }
}