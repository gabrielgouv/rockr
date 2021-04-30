import { Service } from "./service";
import { Endpoint } from "./endpoint";
import { Response } from "./response";
import * as fs from 'fs'
import { ArgumentParser } from 'argparse';
import * as yaml from 'js-yaml'
import { ServiceManager } from "./service-manager";

const parser = new ArgumentParser({
    description: 'Rockr'
});

parser.add_argument('-d', '--dir', { help: 'Directory containing service definition files' })
parser.add_argument('-f', '--file', { help: 'Service definition file' })

const args = parser.parse_args()

//const file = fs.readFileSync(args.folder, 'utf-8')

let services = []

const files = fs.readdirSync(args.folder);

for (const fileName of files) {
    const content = fs.readFileSync(args.folder + '/' + fileName, 'utf-8')
    console.log('Arquivo YAML:')
    console.log(yaml.load(content).services[0].endpoints)
    services = yaml.load(content).services
}

const serviceManager = new ServiceManager()

let serviceId = ''

for (const serviceProperties of services) {
    console.log('Properties YAML to JSON:')
    console.log(serviceProperties)
    const service = new Service(serviceProperties.name, serviceProperties.port, serviceProperties.rootPath)
    console.log('O ARRAY:')
    console.log(serviceProperties.endpoints)
    for (const endpointProperties of serviceProperties.endpoints) {
        const response = new Response(endpointProperties.response, endpointProperties.variables)
        const endpoint = new Endpoint(endpointProperties.name, endpointProperties.path, endpointProperties.method)
            .setResponse(response)
            .useCustomScript(endpointProperties.customScript)
        service.createEndpoint(endpoint)
    }
    serviceId = serviceManager.registerService(service)
}

serviceManager.startServiceProcess(serviceId)

// const service = new Service('My Service', 9098, '/api')
//
// const customScript = `
// function setup() {
//     context.log('on create log')
//     context.setVariable('name', 'john')
// }
//
// function onReply() {
//     context.log('param name: ' + context.getParameter('name'))
//     // context.setVariable('name', context.getParameter('name'))
//     context.setResponseHeader('Content-Type', 'application/json')
//     return context.reply();
// }
// `
//
// const responseContent = `
// [
//     {
//         "name": "John",
//         "age": 15,
//         "email": "<%randomEmail%>"
//     },
//     {
//         "name": "<%name%>",
//         "age": <%age%>,
//         "email": "<%randomEmail%>"
//     },
//     {
//         "name": "Mark",
//         "age": 10,
//         "email": "<%randomEmail%>"
//     }
// ]
// `
//
// const variables: Variable[] = [
//     {
//         name: 'randomEmail',
//         value: 'teste@mail.com'
//     },
//     {
//         name: 'age',
//         value: 10
//     },
//     {
//         name: 'test',
//         value: 10,
//     }
// ]
//
//
// const response = new Response(responseContent, variables)
//
// service.createEndpoint(new Endpoint('endpoint de test', '/test', HttpMethod.GET)
//     .setName('test-endpoint') // fixme
//     .setResponse(response)
//     .useCustomScript(customScript))
// service.createEndpoint(new Endpoint('', '/post', HttpMethod.POST))
//
// service.run()
//
// const service2 = new Service('my-service-2', 9099, '/api')
//
// service2.createEndpoint(new Endpoint('', '/test2', HttpMethod.GET).setName('test-endpoint2'))
// service2.createEndpoint(new Endpoint('', '/post2', HttpMethod.POST))
//
// service2.run()
