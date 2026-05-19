import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\NotificationController::index
* @see app/Http/Controllers/NotificationController.php:21
* @route '/notifications'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificationController::index
* @see app/Http/Controllers/NotificationController.php:21
* @route '/notifications'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::index
* @see app/Http/Controllers/NotificationController.php:21
* @route '/notifications'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\NotificationController::index
* @see app/Http/Controllers/NotificationController.php:21
* @route '/notifications'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\NotificationController::index
* @see app/Http/Controllers/NotificationController.php:21
* @route '/notifications'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\NotificationController::index
* @see app/Http/Controllers/NotificationController.php:21
* @route '/notifications'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\NotificationController::index
* @see app/Http/Controllers/NotificationController.php:21
* @route '/notifications'
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
* @see \App\Http\Controllers\NotificationController::read
* @see app/Http/Controllers/NotificationController.php:31
* @route '/notifications/{notificationRecipient}/read'
*/
export const read = (args: { notificationRecipient: string | number | { id: string | number } } | [notificationRecipient: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: read.url(args, options),
    method: 'post',
})

read.definition = {
    methods: ["post"],
    url: '/notifications/{notificationRecipient}/read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NotificationController::read
* @see app/Http/Controllers/NotificationController.php:31
* @route '/notifications/{notificationRecipient}/read'
*/
read.url = (args: { notificationRecipient: string | number | { id: string | number } } | [notificationRecipient: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notificationRecipient: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { notificationRecipient: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            notificationRecipient: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        notificationRecipient: typeof args.notificationRecipient === 'object'
        ? args.notificationRecipient.id
        : args.notificationRecipient,
    }

    return read.definition.url
            .replace('{notificationRecipient}', parsedArgs.notificationRecipient.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::read
* @see app/Http/Controllers/NotificationController.php:31
* @route '/notifications/{notificationRecipient}/read'
*/
read.post = (args: { notificationRecipient: string | number | { id: string | number } } | [notificationRecipient: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: read.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\NotificationController::read
* @see app/Http/Controllers/NotificationController.php:31
* @route '/notifications/{notificationRecipient}/read'
*/
const readForm = (args: { notificationRecipient: string | number | { id: string | number } } | [notificationRecipient: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: read.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\NotificationController::read
* @see app/Http/Controllers/NotificationController.php:31
* @route '/notifications/{notificationRecipient}/read'
*/
readForm.post = (args: { notificationRecipient: string | number | { id: string | number } } | [notificationRecipient: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: read.url(args, options),
    method: 'post',
})

read.form = readForm

/**
* @see \App\Http\Controllers\NotificationController::action
* @see app/Http/Controllers/NotificationController.php:42
* @route '/notifications/{notificationRecipient}/action'
*/
export const action = (args: { notificationRecipient: string | number | { id: string | number } } | [notificationRecipient: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: action.url(args, options),
    method: 'post',
})

action.definition = {
    methods: ["post"],
    url: '/notifications/{notificationRecipient}/action',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NotificationController::action
* @see app/Http/Controllers/NotificationController.php:42
* @route '/notifications/{notificationRecipient}/action'
*/
action.url = (args: { notificationRecipient: string | number | { id: string | number } } | [notificationRecipient: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notificationRecipient: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { notificationRecipient: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            notificationRecipient: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        notificationRecipient: typeof args.notificationRecipient === 'object'
        ? args.notificationRecipient.id
        : args.notificationRecipient,
    }

    return action.definition.url
            .replace('{notificationRecipient}', parsedArgs.notificationRecipient.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::action
* @see app/Http/Controllers/NotificationController.php:42
* @route '/notifications/{notificationRecipient}/action'
*/
action.post = (args: { notificationRecipient: string | number | { id: string | number } } | [notificationRecipient: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: action.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\NotificationController::action
* @see app/Http/Controllers/NotificationController.php:42
* @route '/notifications/{notificationRecipient}/action'
*/
const actionForm = (args: { notificationRecipient: string | number | { id: string | number } } | [notificationRecipient: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: action.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\NotificationController::action
* @see app/Http/Controllers/NotificationController.php:42
* @route '/notifications/{notificationRecipient}/action'
*/
actionForm.post = (args: { notificationRecipient: string | number | { id: string | number } } | [notificationRecipient: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: action.url(args, options),
    method: 'post',
})

action.form = actionForm

const NotificationController = { index, read, action }

export default NotificationController