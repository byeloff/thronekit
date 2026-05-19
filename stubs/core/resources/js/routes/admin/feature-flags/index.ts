import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import users from './users'
/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::index
* @see app/Http/Controllers/Admin/FeatureFlagController.php:22
* @route '/admin/feature-flags'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/feature-flags',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::index
* @see app/Http/Controllers/Admin/FeatureFlagController.php:22
* @route '/admin/feature-flags'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::index
* @see app/Http/Controllers/Admin/FeatureFlagController.php:22
* @route '/admin/feature-flags'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::index
* @see app/Http/Controllers/Admin/FeatureFlagController.php:22
* @route '/admin/feature-flags'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::index
* @see app/Http/Controllers/Admin/FeatureFlagController.php:22
* @route '/admin/feature-flags'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::index
* @see app/Http/Controllers/Admin/FeatureFlagController.php:22
* @route '/admin/feature-flags'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::index
* @see app/Http/Controllers/Admin/FeatureFlagController.php:22
* @route '/admin/feature-flags'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::update
* @see app/Http/Controllers/Admin/FeatureFlagController.php:38
* @route '/admin/feature-flags/{flag}'
*/
export const update = (args: { flag: string | number } | [flag: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/admin/feature-flags/{flag}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::update
* @see app/Http/Controllers/Admin/FeatureFlagController.php:38
* @route '/admin/feature-flags/{flag}'
*/
update.url = (args: { flag: string | number } | [flag: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { flag: args }
    }

    if (Array.isArray(args)) {
        args = {
            flag: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        flag: args.flag,
    }

    return update.definition.url
            .replace('{flag}', parsedArgs.flag.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::update
* @see app/Http/Controllers/Admin/FeatureFlagController.php:38
* @route '/admin/feature-flags/{flag}'
*/
update.patch = (args: { flag: string | number } | [flag: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::update
* @see app/Http/Controllers/Admin/FeatureFlagController.php:38
* @route '/admin/feature-flags/{flag}'
*/
const updateForm = (args: { flag: string | number } | [flag: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::update
* @see app/Http/Controllers/Admin/FeatureFlagController.php:38
* @route '/admin/feature-flags/{flag}'
*/
updateForm.patch = (args: { flag: string | number } | [flag: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const featureFlags = {
    index: Object.assign(index, index),
    update: Object.assign(update, update),
    users: Object.assign(users, users),
}

export default featureFlags