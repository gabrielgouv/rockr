export class VariableParser {

    public prefix = '<%='
    public postfix = '=%>'

    private variables: Map<string, any> = new Map()
    private str: string

    public setVariables(variables: Map<string, any>): VariableParser {
        this.variables = variables
        return this
    }

    public setVariable(name: string, value: any): VariableParser {
        this.variables.set(name, value)
        return this
    }

    public onString(str: string): VariableParser {
        this.str = str
        return this
    }

    public parse(): string {
        if (!this.variables || this.variables.size === 0) {
            return this.str
        }
        for (let [key, value] of this.variables) {
            this.str = this.str.replace(new RegExp(this.putVariableOnPattern(key), 'g'), value)
        }
        return this.str
    }

    private putVariableOnPattern(variable: string): string {
        return `${this.prefix}${variable}${this.postfix}`
    }

}