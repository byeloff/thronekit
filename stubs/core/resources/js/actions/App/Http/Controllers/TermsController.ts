import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TermsController::show
* @see app/Http/Controllers/TermsController.php:19
* @route '/terms'
*/
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/terms',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TermsController::show
* @see app/Http/Controllers/TermsController.php:19
* @route '/terms'
*/
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TermsController::show
* @see app/Http/Controllers/TermsController.php:19
* @route '/terms'
*/
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TermsController::show
* @see app/Http/Controllers/TermsController.php:19
* @route '/terms'
*/
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TermsController::show
* @see app/Http/Controllers/TermsController.php:19
* @route '/terms'
*/
const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TermsController::show
* @see app/Http/Controllers/TermsController.php:19
* @route '/terms'
*/
showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TermsController::show
* @see app/Http/Controllers/TermsController.php:19
* @route '/terms'
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
* @see \App\Http\Controllers\TermsController::accept
* @see app/Http/Controllers/TermsController.php:53
* @route '/terms/accept'
*/
export const accept = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(options),
    method: 'post',
})

accept.definition = {
    methods: ["post"],
    url: '/terms/accept',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TermsController::accept
* @see app/Http/Controllers/TermsController.php:53
* @route '/terms/accept'
*/
accept.url = (options?: RouteQueryOptions) => {
    return accept.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TermsController::accept
* @see app/Http/Controllers/TermsController.php:53
* @route '/terms/accept'
*/
accept.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TermsController::accept
* @see app/Http/Controllers/TermsController.php:53
* @route '/terms/accept'
*/
const acceptForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: accept.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TermsController::accept
* @see app/Http/Controllers/TermsController.php:53
* @route '/terms/accept'
*/
acceptForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: accept.url(options),
    method: 'post',
})

accept.form = acceptForm

const TermsController = { show, accept }

export default TermsController