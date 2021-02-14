import { generateUniqueId, Variable } from "@rockr/rockr-core";

export class Response {

    private readonly responseId: string

    constructor(private content?: string, private readonly variables?: Variable[]) {
        this.responseId = 'Response::' + generateUniqueId()
        this.variables = variables ? variables : []
    }

    public getResponseId(): string {
        return this.responseId
    }

    public setContent(value: string): void {
        this.content = value
    }

    public getContent(): string {
        return this.content
    }

    public addVariable(variable: Variable) {
        this.variables.push(variable)
    }

    public addVariables(variables: Variable[]) {
        this.variables.push(...variables)
    }

    public getVariables(): Variable[] {
        return this.variables
    }

}