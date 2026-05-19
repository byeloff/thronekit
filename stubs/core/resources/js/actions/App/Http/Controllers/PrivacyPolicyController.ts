import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrivacyPolicyController::show
* @see app/Http/Controllers/PrivacyPolicyController.php:12
* @route '/privacy-policy'
*/
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/privacy-policy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrivacyPolicyController::show
* @see app/Http/Controllers/PrivacyPolicyController.php:12
* @route '/privacy-policy'
*/
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrivacyPolicyController::show
* @see app/Http/Controllers/PrivacyPolicyController.php:12
* @route '/privacy-policy'
*/
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PrivacyPolicyController::show
* @see app/Http/Controllers/PrivacyPolicyController.php:12
* @route '/privacy-policy'
*/
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrivacyPolicyController::show
* @see app/Http/Controllers/PrivacyPolicyController.php:12
* @route '/privacy-policy'
*/
const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PrivacyPolicyController::show
* @see app/Http/Controllers/PrivacyPolicyController.php:12
* @route '/privacy-policy'
*/
showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PrivacyPolicyController::show
* @see app/Http/Controllers/PrivacyPolicyController.php:12
* @route '/privacy-policy'
*/
showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const PrivacyPolicyController = { show }

export default PrivacyPolicyController