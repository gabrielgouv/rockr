import { Variable } from '@rockr/rockr-core'

export class ResponseAssembler {

    constructor(private jsonModel: string, private variables?: Variable[]) {}

    public assembly(): string {
        if (!this.variables || this.variables.length === 0) {
            return this.jsonModel
        }
        for (let variable of this.variables) {
            this.jsonModel = this.jsonModel.replace(new RegExp(`<%${variable.name}%>`, 'g'), variable.value)
        }
        return this.jsonModel
    }


}