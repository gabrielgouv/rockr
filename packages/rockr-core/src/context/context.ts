import { generateUniqueId, logger, Variable } from "..";
import { Response, Request } from "express";
import { ResponseAssembler } from "@rockr/rockr-generate-response";

export class Context {

    public readonly contextId: string
    public internal: Context.Internal
    private responseHeaders: Map<string, string>
    private readonly metadata: Map<string, any>

    constructor() {
        this.internal = new Context.Internal(this)
        this.contextId = 'Context::' + generateUniqueId()
        this.responseHeaders = new Map()
        this.metadata = new Map()
    }

    public setResponseHeaders(responseHeaders: Map<string, string>): void {
        this.responseHeaders = responseHeaders
        this.internal.wrappedLog(`Added ${this.responseHeaders.size} response headers`)
    }

    public setResponseHeader(key: string, value: string): void {
        this.responseHeaders.set(key, value)
    }

    public removeResponseHeader(key: string): void {
        this.responseHeaders.delete(key)
        this.internal.wrappedLog(`Removed response header: '${key}'`)
    }

    public setVariable(variableName: string, value: any): void {
        this.internal.wrappedLog(`Set variable '${variableName}' to '${value}'`)
        this.internal.variables.push({ name: variableName, value})
    }

    public getParameter(key: string) {
        return this.internal.req.query[key]
    }

    public setResponse(response: string): void {
        this.internal.setResponseValue(response)
        this.internal.wrappedLog('Set response via function')
    }

    public log(message: string): void {
        logger.log('vm', `[RECEIVED] (${this.getEndpointId()}) ${message}`)
    }

    public addMetadata(key: string, value: any): void {
        this.metadata.set(key, value)
    }

    public getMetadata(key: string): any {
        return this.metadata.get(key)
    }

    public getEndpointId(): string {
        return this.getMetadata('endpoint_id')
    }

    public reply(response?: any) {
        this.setupResponseHeaders()
        const res = response ? response : this.internal.responseValue
        const responseAssembler = new ResponseAssembler(res, this.internal.variables)
        this.internal.setState(Context.ContextState.REPLIED)
        return this.internal.res.send(responseAssembler.assembly())
    }

    private setupResponseHeaders() {
        for (const [key, value] of this.responseHeaders) {
            this.internal.res.set(key, value)
            this.internal.wrappedLog(`Using header for response: '${key}':'${value}'`)
        }
    }

}

export namespace Context {

    export enum ContextState {
        CREATING = 'creating',
        CREATED = 'created',
        REPLYING = 'replying',
        REPLIED = 'replied',
        ERROR = 'error'
    }

    export class Internal {

        public contextState: ContextState = ContextState.CREATING
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
            this.setState(ContextState.CREATED)
        }

        public updateContext(req: Request, res: Response) {
            this.req = req
            this.res = res
            //logger.info(`[INTERNAL] Updated context for '${this.endpointPath}' (${this.parent.contextId})`)
        }

        public setState(newState: ContextState | string) {
            if (typeof newState == 'string') {
                this.contextState = newState as ContextState
            } else {
                this.contextState = newState
            }
            this.wrappedLog(`Context state is: ${this.contextState.toString().toUpperCase()}`)
        }

        public setResponseValue(responseValue: string): void {
            this.responseValue = responseValue
        }

        public log(level: string, message: string) {
            logger.log(level, message)
        }

        public wrappedLog(message: string) {
            logger.info(`(${this.parent.getEndpointId()}) ${message}`)
        }

        public getParent() {
            return this.parent
        }

    }
}