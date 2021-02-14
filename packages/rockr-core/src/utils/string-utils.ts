import * as _ from 'lodash'

export const parseToKebabCase = (text: string): string => {
    return _.kebabCase(text)
}

export const parseToSnakeCase = (text: string): string => {
    return _.snakeCase(text)
}

export const generateIdByName = (text: string): string => {
    return  _.uniqueId(_.snakeCase(text) + '_')
}