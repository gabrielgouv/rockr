import { generateUniqueId, logger, Variable } from "..";
import { Response, Request } from "express";
import { ResponseAssembler } from "@rockr/rockr-generate-response";

export class Context {

    public readonly contextId: string
    public internal: Context.Internal
    private responseHeaders: Map<string, string>

    constructor() {
        this.internal = new Context.Internal(this)
        this.contextId = 'Context::' + generateUniqueId()
        this.responseHeaders = new Map()
    }

    public setResponseHeaders(responseHeaders: Map<string, string>): void {
        this.responseHeaders = responseHeaders
        logger.info(`Added ${this.responseHeaders.size} response headers'`)
    }

    public setResponseHeader(key: string, value: string): void {
        this.responseHeaders.set(key, value)
    }

    public removeResponseHeader(key: string): void {
        this.responseHeaders.delete(key)
        logger.info(`Removed response header: '${key}'`)
    }

    public setVariable(variableName: string, value: any): boolean {
        logger.info(`Request to set value '${value}' to variable '${variableName}'`)
        for (const variable of this.internal.variables) {
            if (variable.name === variableName) {
                variable.value = value
                logger.info(`Successfully set value '${value}' to variable '${variable.name}'`)
                return true
            }
        }
        logger.warn(`Cannot set value '${value}' to variable '${variableName}'. Variable not found.`)
        return false
    }

    public setResponse(response: string): void {
        this.internal.setResponseValue(response)
        logger.info(`Set response via function'`)
    }

    public reply(response?: any) {
        this.setupResponseHeaders()
        const res = response ? response : this.internal.responseValue
        const responseAssembler = new ResponseAssembler(res, this.internal.variables)
        return this.internal.res.send(responseAssembler.assembly())
    }

    private setupResponseHeaders() {
        for (const [key, value] of this.responseHeaders) {
            this.internal.res.set(key, value)
            logger.info(`Added response header: '${key}' -> '${value}'`)
        }
    }

}

export namespace Context {
    export class Internal {

        public endpointPath: string
        public variables: Variable[]
        public responseValue: string
        public req: Request
        public res: Response

        constructor(private parent: Context) {
        }

        public setupContext(responseValue: string, endpointPath: string, variables: Variable[]) {
            this.responseValue = responseValue
            this.endpointPath = endpointPath
            this.variables = variables ? variables : []
        }

        public updateContext(req: Request, res: Response) {
            this.req = req
            this.res = res
            logger.info(`[INTERNAL] Updated context for '${this.endpointPath}' (${this.parent.contextId})`)
        }

        public setResponseValue(responseValue: string): void {
            this.responseValue = responseValue
        }

        public getParent() {
            return this.parent
        }

    }
}