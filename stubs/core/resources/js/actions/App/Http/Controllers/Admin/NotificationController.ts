import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\NotificationController::index
* @see app/Http/Controllers/Admin/NotificationController.php:28
* @route '/admin/notifications'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NotificationController::index
* @see app/Http/Controllers/Admin/NotificationController.php:28
* @route '/admin/notifications'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificationController::index
* @see app/Http/Controllers/Admin/NotificationController.php:28
* @route '/admin/notifications'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::index
* @see app/Http/Controllers/Admin/NotificationController.php:28
* @route '/admin/notifications'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::index
* @see app/Http/Controllers/Admin/NotificationController.php:28
* @route '/admin/notifications'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::index
* @see app/Http/Controllers/Admin/NotificationController.php:28
* @route '/admin/notifications'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::index
* @see app/Http/Controllers/Admin/NotificationController.php:28
* @route '/admin/notifications'
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
* @see \App\Http\Controllers\Admin\NotificationController::create
* @see app/Http/Controllers/Admin/NotificationController.php:47
* @route '/admin/notifications/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/notifications/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NotificationController::create
* @see app/Http/Controllers/Admin/NotificationController.php:47
* @route '/admin/notifications/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificationController::create
* @see app/Http/Controllers/Admin/NotificationController.php:47
* @route '/admin/notifications/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::create
* @see app/Http/Controllers/Admin/NotificationController.php:47
* @route '/admin/notifications/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::create
* @see app/Http/Controllers/Admin/NotificationController.php:47
* @route '/admin/notifications/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::create
* @see app/Http/Controllers/Admin/NotificationController.php:47
* @route '/admin/notifications/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::create
* @see app/Http/Controllers/Admin/NotificationController.php:47
* @route '/admin/notifications/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\Admin\NotificationController::store
* @see app/Http/Controllers/Admin/NotificationController.php:52
* @route '/admin/notifications'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/notifications',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\NotificationController::store
* @see app/Http/Controllers/Admin/NotificationController.php:52
* @route '/admin/notifications'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificationController::store
* @see app/Http/Controllers/Admin/NotificationController.php:52
* @route '/admin/notifications'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::store
* @see app/Http/Controllers/Admin/NotificationController.php:52
* @route '/admin/notifications'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::store
* @see app/Http/Controllers/Admin/NotificationController.php:52
* @route '/admin/notifications'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\NotificationController::show
* @see app/Http/Controllers/Admin/NotificationController.php:67
* @route '/admin/notifications/{notification}'
*/
export const show = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/notifications/{notification}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NotificationController::show
* @see app/Http/Controllers/Admin/NotificationController.php:67
* @route '/admin/notifications/{notification}'
*/
show.url = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { notification: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            notification: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        notification: typeof args.notification === 'object'
        ? args.notification.id
        : args.notification,
    }

    return show.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificationController::show
* @see app/Http/Controllers/Admin/NotificationController.php:67
* @route '/admin/notifications/{notification}'
*/
show.get = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::show
* @see app/Http/Controllers/Admin/NotificationController.php:67
* @route '/admin/notifications/{notification}'
*/
show.head = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::show
* @see app/Http/Controllers/Admin/NotificationController.php:67
* @route '/admin/notifications/{notification}'
*/
const showForm = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::show
* @see app/Http/Controllers/Admin/NotificationController.php:67
* @route '/admin/notifications/{notification}'
*/
showForm.get = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::show
* @see app/Http/Controllers/Admin/NotificationController.php:67
* @route '/admin/notifications/{notification}'
*/
showForm.head = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Admin\NotificationController::edit
* @see app/Http/Controllers/Admin/NotificationController.php:87
* @route '/admin/notifications/{notification}/edit'
*/
export const edit = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/notifications/{notification}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NotificationController::edit
* @see app/Http/Controllers/Admin/NotificationController.php:87
* @route '/admin/notifications/{notification}/edit'
*/
edit.url = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { notification: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            notification: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        notification: typeof args.notification === 'object'
        ? args.notification.id
        : args.notification,
    }

    return edit.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificationController::edit
* @see app/Http/Controllers/Admin/NotificationController.php:87
* @route '/admin/notifications/{notification}/edit'
*/
edit.get = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::edit
* @see app/Http/Controllers/Admin/NotificationController.php:87
* @route '/admin/notifications/{notification}/edit'
*/
edit.head = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::edit
* @see app/Http/Controllers/Admin/NotificationController.php:87
* @route '/admin/notifications/{notification}/edit'
*/
const editForm = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::edit
* @see app/Http/Controllers/Admin/NotificationController.php:87
* @route '/admin/notifications/{notification}/edit'
*/
editForm.get = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::edit
* @see app/Http/Controllers/Admin/NotificationController.php:87
* @route '/admin/notifications/{notification}/edit'
*/
editForm.head = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Admin\NotificationController::update
* @see app/Http/Controllers/Admin/NotificationController.php:92
* @route '/admin/notifications/{notification}'
*/
export const update = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/notifications/{notification}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\NotificationController::update
* @see app/Http/Controllers/Admin/NotificationController.php:92
* @route '/admin/notifications/{notification}'
*/
update.url = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { notification: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            notification: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        notification: typeof args.notification === 'object'
        ? args.notification.id
        : args.notification,
    }

    return update.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificationController::update
* @see app/Http/Controllers/Admin/NotificationController.php:92
* @route '/admin/notifications/{notification}'
*/
update.put = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::update
* @see app/Http/Controllers/Admin/NotificationController.php:92
* @route '/admin/notifications/{notification}'
*/
const updateForm = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::update
* @see app/Http/Controllers/Admin/NotificationController.php:92
* @route '/admin/notifications/{notification}'
*/
updateForm.put = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Admin\NotificationController::dispatch
* @see app/Http/Controllers/Admin/NotificationController.php:108
* @route '/admin/notifications/{notification}/dispatch'
*/
export const dispatch = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: dispatch.url(args, options),
    method: 'post',
})

dispatch.definition = {
    methods: ["post"],
    url: '/admin/notifications/{notification}/dispatch',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\NotificationController::dispatch
* @see app/Http/Controllers/Admin/NotificationController.php:108
* @route '/admin/notifications/{notification}/dispatch'
*/
dispatch.url = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { notification: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            notification: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        notification: typeof args.notification === 'object'
        ? args.notification.id
        : args.notification,
    }

    return dispatch.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificationController::dispatch
* @see app/Http/Controllers/Admin/NotificationController.php:108
* @route '/admin/notifications/{notification}/dispatch'
*/
dispatch.post = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: dispatch.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::dispatch
* @see app/Http/Controllers/Admin/NotificationController.php:108
* @route '/admin/notifications/{notification}/dispatch'
*/
const dispatchForm = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: dispatch.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::dispatch
* @see app/Http/Controllers/Admin/NotificationController.php:108
* @route '/admin/notifications/{notification}/dispatch'
*/
dispatchForm.post = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: dispatch.url(args, options),
    method: 'post',
})

dispatch.form = dispatchForm

/**
* @see \App\Http\Controllers\Admin\NotificationController::destroy
* @see app/Http/Controllers/Admin/NotificationController.php:119
* @route '/admin/notifications/{notification}'
*/
export const destroy = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/notifications/{notification}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\NotificationController::destroy
* @see app/Http/Controllers/Admin/NotificationController.php:119
* @route '/admin/notifications/{notification}'
*/
destroy.url = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { notification: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            notification: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        notification: typeof args.notification === 'object'
        ? args.notification.id
        : args.notification,
    }

    return destroy.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificationController::destroy
* @see app/Http/Controllers/Admin/NotificationController.php:119
* @route '/admin/notifications/{notification}'
*/
destroy.delete = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::destroy
* @see app/Http/Controllers/Admin/NotificationController.php:119
* @route '/admin/notifications/{notification}'
*/
const destroyForm = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::destroy
* @see app/Http/Controllers/Admin/NotificationController.php:119
* @route '/admin/notifications/{notification}'
*/
destroyForm.delete = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const NotificationController = { index, create, store, show, edit, update, dispatch, destroy }

export default NotificationController