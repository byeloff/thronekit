import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \Spatie\Health\Http\Controllers\HealthCheckJsonResultsController::__invoke
* @see vendor/spatie/laravel-health/src/Http/Controllers/HealthCheckJsonResultsController.php:13
* @route '/health'
*/
const HealthCheckJsonResultsController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: HealthCheckJsonResultsController.url(options),
    method: 'get',
})

HealthCheckJsonResultsController.definition = {
    methods: ["get","head"],
    url: '/health',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Spatie\Health\Http\Controllers\HealthCheckJsonResultsController::__invoke
* @see vendor/spatie/laravel-health/src/Http/Controllers/HealthCheckJsonResultsController.php:13
* @route '/health'
*/
HealthCheckJsonResultsController.url = (options?: RouteQueryOptions) => {
    return HealthCheckJsonResultsController.definition.url + queryParams(options)
}

/**
* @see \Spatie\Health\Http\Controllers\HealthCheckJsonResultsController::__invoke
* @see vendor/spatie/laravel-health/src/Http/Controllers/HealthCheckJsonResultsController.php:13
* @route '/health'
*/
HealthCheckJsonResultsController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: HealthCheckJsonResultsController.url(options),
    method: 'get',
})

/**
* @see \Spatie\Health\Http\Controllers\HealthCheckJsonResultsController::__invoke
* @see vendor/spatie/laravel-health/src/Http/Controllers/HealthCheckJsonResultsController.php:13
* @route '/health'
*/
HealthCheckJsonResultsController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: HealthCheckJsonResultsController.url(options),
    method: 'head',
})

/**
* @see \Spatie\Health\Http\Controllers\HealthCheckJsonResultsController::__invoke
* @see vendor/spatie/laravel-health/src/Http/Controllers/HealthCheckJsonResultsController.php:13
* @route '/health'
*/
const HealthCheckJsonResultsControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HealthCheckJsonResultsController.url(options),
    method: 'get',
})

/**
* @see \Spatie\Health\Http\Controllers\HealthCheckJsonResultsController::__invoke
* @see vendor/spatie/laravel-health/src/Http/Controllers/HealthCheckJsonResultsController.php:13
* @route '/health'
*/
HealthCheckJsonResultsControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HealthCheckJsonResultsController.url(options),
    method: 'get',
})

/**
* @see \Spatie\Health\Http\Controllers\HealthCheckJsonResultsController::__invoke
* @see vendor/spatie/laravel-health/src/Http/Controllers/HealthCheckJsonResultsController.php:13
* @route '/health'
*/
HealthCheckJsonResultsControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HealthCheckJsonResultsController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

HealthCheckJsonResultsController.form = HealthCheckJsonResultsControllerForm

export default HealthCheckJsonResultsController