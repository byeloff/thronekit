import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::updateUser
* @see app/Http/Controllers/Admin/FeatureFlagController.php:51
* @route '/admin/feature-flags/{flag}/users/{user}'
*/
export const updateUser = (args: { flag: string | number, user: string | number | { id: string | number } } | [flag: string | number, user: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateUser.url(args, options),
    method: 'patch',
})

updateUser.definition = {
    methods: ["patch"],
    url: '/admin/feature-flags/{flag}/users/{user}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::updateUser
* @see app/Http/Controllers/Admin/FeatureFlagController.php:51
* @route '/admin/feature-flags/{flag}/users/{user}'
*/
updateUser.url = (args: { flag: string | number, user: string | number | { id: string | number } } | [flag: string | number, user: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            flag: args[0],
            user: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        flag: args.flag,
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return updateUser.definition.url
            .replace('{flag}', parsedArgs.flag.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::updateUser
* @see app/Http/Controllers/Admin/FeatureFlagController.php:51
* @route '/admin/feature-flags/{flag}/users/{user}'
*/
updateUser.patch = (args: { flag: string | number, user: string | number | { id: string | number } } | [flag: string | number, user: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateUser.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::updateUser
* @see app/Http/Controllers/Admin/FeatureFlagController.php:51
* @route '/admin/feature-flags/{flag}/users/{user}'
*/
const updateUserForm = (args: { flag: string | number, user: string | number | { id: string | number } } | [flag: string | number, user: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateUser.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::updateUser
* @see app/Http/Controllers/Admin/FeatureFlagController.php:51
* @route '/admin/feature-flags/{flag}/users/{user}'
*/
updateUserForm.patch = (args: { flag: string | number, user: string | number | { id: string | number } } | [flag: string | number, user: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateUser.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateUser.form = updateUserForm

const FeatureFlagController = { index, update, updateUser }

export default FeatureFlagController