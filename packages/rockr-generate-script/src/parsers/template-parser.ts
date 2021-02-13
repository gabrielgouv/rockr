import { VariableParser } from "./variable-parser";

export class TemplateParser {

    constructor(private templateString: string, private variables?: Map<string, any>) {}

    public parse(): string {
        return new VariableParser()
            .setVariables(this.variables)
            .onString(this.templateString)
            .parse()
    }

}