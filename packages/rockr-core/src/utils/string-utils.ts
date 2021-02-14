import * as _ from 'lodash'

export const parseToKebabCase = (text: string): string => {
    return _.kebabCase(text)
}

export const generateIdByName = (text: string): string => {
    return  _.uniqueId(_.kebabCase(text) + '-')
}