import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CookieConsentController::store
* @see app/Http/Controllers/CookieConsentController.php:24
* @route '/cookie-consent'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: store.url(options),
    method: 'put',
})

store.definition = {
    methods: ["put"],
    url: '/cookie-consent',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CookieConsentController::store
* @see app/Http/Controllers/CookieConsentController.php:24
* @route '/cookie-consent'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CookieConsentController::store
* @see app/Http/Controllers/CookieConsentController.php:24
* @route '/cookie-consent'
*/
store.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: store.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CookieConsentController::store
* @see app/Http/Controllers/CookieConsentController.php:24
* @route '/cookie-consent'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CookieConsentController::store
* @see app/Http/Controllers/CookieConsentController.php:24
* @route '/cookie-consent'
*/
storeForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

store.form = storeForm

const CookieConsentController = { store }

export default CookieConsentController