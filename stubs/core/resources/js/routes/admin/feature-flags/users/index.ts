import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::update
* @see app/Http/Controllers/Admin/FeatureFlagController.php:51
* @route '/admin/feature-flags/{flag}/users/{user}'
*/
export const update = (args: { flag: string | number, user: string | number | { id: string | number } } | [flag: string | number, user: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/admin/feature-flags/{flag}/users/{user}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::update
* @see app/Http/Controllers/Admin/FeatureFlagController.php:51
* @route '/admin/feature-flags/{flag}/users/{user}'
*/
update.url = (args: { flag: string | number, user: string | number | { id: string | number } } | [flag: string | number, user: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{flag}', parsedArgs.flag.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::update
* @see app/Http/Controllers/Admin/FeatureFlagController.php:51
* @route '/admin/feature-flags/{flag}/users/{user}'
*/
update.patch = (args: { flag: string | number, user: string | number | { id: string | number } } | [flag: string | number, user: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\FeatureFlagController::update
* @see app/Http/Controllers/Admin/FeatureFlagController.php:51
* @route '/admin/feature-flags/{flag}/users/{user}'
*/
const updateForm = (args: { flag: string | number, user: string | number | { id: string | number } } | [flag: string | number, user: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/Admin/FeatureFlagController.php:51
* @route '/admin/feature-flags/{flag}/users/{user}'
*/
updateForm.patch = (args: { flag: string | number, user: string | number | { id: string | number } } | [flag: string | number, user: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const users = {
    update: Object.assign(update, update),
}

export default users