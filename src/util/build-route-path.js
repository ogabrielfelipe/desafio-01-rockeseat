// /user/:id
export function buildRoutePath(path){
    //Usar a extensão Regex Previewer para testar a regex
    const routeParametersRegex = /:([a-zA-Z]+)/g

    const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')


    const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)

    return pathRegex
}