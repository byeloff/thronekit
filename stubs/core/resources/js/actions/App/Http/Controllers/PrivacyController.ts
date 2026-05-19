import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\PrivacyController::exportData
* @see app/Http/Controllers/PrivacyController.php:30
* @route '/settings/privacy/export'
*/
export const exportData = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportData.url(options),
    method: 'post',
})

exportData.definition = {
    methods: ["post"],
    url: '/settings/privacy/export',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrivacyController::exportData
* @see app/Http/Controllers/PrivacyController.php:30
* @route '/settings/privacy/export'
*/
exportData.url = (options?: RouteQueryOptions) => {
    return exportData.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrivacyController::exportData
* @see app/Http/Controllers/PrivacyController.php:30
* @route '/settings/privacy/export'
*/
exportData.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportData.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrivacyController::exportData
* @see app/Http/Controllers/PrivacyController.php:30
* @route '/settings/privacy/export'
*/
const exportDataForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: exportData.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrivacyController::exportData
* @see app/Http/Controllers/PrivacyController.php:30
* @route '/settings/privacy/export'
*/
exportDataForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: exportData.url(options),
    method: 'post',
})

exportData.form = exportDataForm

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

const PrivacyController = { show, exportData, destroy }

export default PrivacyController