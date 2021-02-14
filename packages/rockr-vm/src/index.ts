import { Service } from "./service";
import { Endpoint } from "./endpoint";
import { HttpMethod } from "@rockr/rockr-generate-script";
import { Variable } from "@rockr/rockr-core";
import { Response } from "./response";

const service = new Service('my-service', 9098, '/api')

const customScript = `
function setup() {
    context.log('on create log')
    context.setVariable('name', 'john')
}

function onReply() {
    context.log('param name: ' + context.getParameter('name'))
    // context.setVariable('name', context.getParameter('name'))
    context.setResponseHeader('Content-Type', 'application/json')
    return context.reply();
}
`

const responseContent = `
[
    {
        "name": "John",
        "age": 15,
        "email": "<%randomEmail%>"
    },
    {
        "name": "<%name%>",
        "age": <%age%>,
        "email": "<%randomEmail%>"
    },
    {
        "name": "Mark",
        "age": 10,
        "email": "<%randomEmail%>"
    }
]
`

const variables: Variable[] = [
    {
        name: 'randomEmail',
        value: 'teste@mail.com'
    },
    {
        name: 'age',
        value: 10
    },
    {
        name: 'test',
        value: 10,
    }
]


const response = new Response(responseContent, variables)

service.createEndpoint(new Endpoint('/test', HttpMethod.GET)
    .setName('test-endpoint')
    .setResponse(response)
    .useCustomScript(customScript))
service.createEndpoint(new Endpoint('/post', HttpMethod.POST))

service.run()

const service2 = new Service('my-service-2', 9099, '/api')

service2.createEndpoint(new Endpoint('/test2', HttpMethod.GET).setName('test-endpoint2'))
service2.createEndpoint(new Endpoint('/post2', HttpMethod.POST))

service2.run()
