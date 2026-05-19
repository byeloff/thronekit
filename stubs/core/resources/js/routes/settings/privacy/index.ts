import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PrivacyController::show
* @see app/Http/Controllers/PrivacyController.php:16
* @route '/settings/privacy'
*/
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/settings/privacy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrivacyController::show
* @see app/Http/Controllers/PrivacyController.php:16
* @route '/settings/privacy'
*/
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrivacyController::show
* @see app/Http/Controllers/PrivacyController.php:16
* @route '/settings/privacy'
*/
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PrivacyController::show
* @see app/Http/Controllers/PrivacyController.php:16
* @route '/settings/privacy'
*/
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrivacyController::show
* @see app/Http/Controllers/PrivacyController.php:16
* @route '/settings/privacy'
*/
const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PrivacyController::show
* @see app/Http/Controllers/PrivacyController.php:16
* @route '/settings/privacy'
*/
showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PrivacyController::show
* @see app/Http/Controllers/PrivacyController.php:16
* @route '/settings/privacy'
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

/**
* @see \App\Http\Controllers\PrivacyController::exportMethod
* @see app/Http/Controllers/PrivacyController.php:30
* @route '/settings/privacy/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportMethod.url(options),
    method: 'post',
})

exportMethod.definition = {
    methods: ["post"],
    url: '/settings/privacy/export',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrivacyController::exportMethod
* @see app/Http/Controllers/PrivacyController.php:30
* @route '/settings/privacy/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrivacyController::exportMethod
* @see app/Http/Controllers/PrivacyController.php:30
* @route '/settings/privacy/export'
*/
exportMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportMethod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrivacyController::exportMethod
* @see app/Http/Controllers/PrivacyController.php:30
* @route '/settings/privacy/export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: exportMethod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrivacyController::exportMethod
* @see app/Http/Controllers/PrivacyController.php:30
* @route '/settings/privacy/export'
*/
exportMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: exportMethod.url(options),
    method: 'post',
})

exportMethod.form = exportMethodForm

/**
* @see \App\Http\Controllers\PrivacyController::destroy
* @see app/Http/Controllers/PrivacyController.php:54
* @route '/settings/privacy'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/privacy',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PrivacyController::destroy
* @see app/Http/Controllers/PrivacyController.php:54
* @route '/settings/privacy'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrivacyController::destroy
* @see app/Http/Controllers/PrivacyController.php:54
* @route '/settings/privacy'
*/
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PrivacyController::destroy
* @see app/Http/Controllers/PrivacyController.php:54
* @route '/settings/privacy'
*/
const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrivacyController::destroy
* @see app/Http/Controllers/PrivacyController.php:54
* @route '/settings/privacy'
*/
destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const privacy = {
    show: Object.assign(show, show),
    export: Object.assign(exportMethod, exportMethod),
    destroy: Object.assign(destroy, destroy),
}

export default privacy