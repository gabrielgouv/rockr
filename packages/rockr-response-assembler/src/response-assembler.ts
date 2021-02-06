import { Context, Variable } from '@rockr/rockr-core'

export class ResponseAssembler {

    private dynamicVars: Variable[] = []

    constructor(private context: Context, private jsonModel: string, private variables?: Variable[]) {}

    public isValid(): boolean {
        return this.context && this.jsonModel !== undefined
    }

    public assembly(): string {
        if (!this.variables || this.variables.length === 0) {
            return this.jsonModel
        }
        for (let variable of this.variables) {
            if (variable.dynamic) {
                this.dynamicVars.push(variable)
                continue
            }
            this.jsonModel = this.jsonModel.replace(new RegExp(`<%${variable.name}%>`, 'g'), variable.value)
        }
        this.updateContext()
        return this.jsonModel
    }

    public getDynamicVars(): Variable[] {
        return this.dynamicVars
    }

    private updateContext() {
        this.context.variables = this.dynamicVars
        this.context.responseValue = this.jsonModel
    }

}