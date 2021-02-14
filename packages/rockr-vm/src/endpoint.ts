import { EndpointScript, HttpMethod } from "@rockr/rockr-generate-script";
import { generateUniqueId } from "@rockr/rockr-core";
import { Response } from "./response";

export class Endpoint {

    private readonly endpointId: string
    private name: string
    private response: Response

    constructor(private path: string, private method: HttpMethod, private customScript?: string) {
        this.endpointId = 'Endpoint::' + generateUniqueId()
    }

    public setName(name: string): Endpoint {
        this.name = name
        return this
    }

    public setResponse(response: Response): Endpoint {
        this.response = response
        return this
    }

    public getResponse(): Response {
        return this.response
    }

    public setRootPath(rootPath: string): Endpoint {
        this.path = rootPath + this.path
        return this
    }

    public useCustomScript(customScript: string): Endpoint {
        this.customScript = customScript
        return this
    }

    public getEndpointId(): string {
        return this.endpointId
    }

    public getEndpointPath() : string {
        return this.path
    }

    public tryGetEndpointName(): string {
        return this.name ? 'Endpoint::' + this.name : this.endpointId
    }

    public getScript() {
        return new EndpointScript(this.path, this.method, this.customScript, this.response?.getContent(), this.response?.getVariables())
    }

}