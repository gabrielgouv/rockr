import {Service} from "./service";
import {Endpoint} from "./endpoint";
import {HttpMethod} from "@rockr/rockr-generate-script";

const service = new Service('my-service', 9098, '/api')

service.createEndpoint(new Endpoint('/test', HttpMethod.GET).setName('test-endpoint'))
service.createEndpoint(new Endpoint('/post', HttpMethod.POST))

service.run()
