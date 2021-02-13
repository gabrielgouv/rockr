import { Context, Variable } from "@rockr/rockr-core";
import { ResponseAssembler } from "./response-assembler";

const context = new Context()

const jsonModel = `
[
    {
        "name": "John",
        "age": 15,
        "email": "<%randomEmail%>"
    },
    {
        "name": "Paul",
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
        dynamic: true
    }
]

console.log('Running assembler...')

const assembler = new ResponseAssembler(context, jsonModel, variables)

if (assembler.isValid()) {
    console.log(assembler.assembly())
    console.log(assembler.getDynamicVars())
} else {
    console.log('Assembler is invalid')
}

export default ResponseAssembler