import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Dev\ThemeEditorController::index
* @see app/Http/Controllers/Dev/ThemeEditorController.php:26
* @route '/dev/theme-editor'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/dev/theme-editor',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dev\ThemeEditorController::index
* @see app/Http/Controllers/Dev/ThemeEditorController.php:26
* @route '/dev/theme-editor'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dev\ThemeEditorController::index
* @see app/Http/Controllers/Dev/ThemeEditorController.php:26
* @route '/dev/theme-editor'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dev\ThemeEditorController::index
* @see app/Http/Controllers/Dev/ThemeEditorController.php:26
* @route '/dev/theme-editor'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Dev\ThemeEditorController::index
* @see app/Http/Controllers/Dev/ThemeEditorController.php:26
* @route '/dev/theme-editor'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dev\ThemeEditorController::index
* @see app/Http/Controllers/Dev/ThemeEditorController.php:26
* @route '/dev/theme-editor'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dev\ThemeEditorController::index
* @see app/Http/Controllers/Dev/ThemeEditorController.php:26
* @route '/dev/theme-editor'
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
* @see \App\Http\Controllers\Dev\ThemeEditorController::update
* @see app/Http/Controllers/Dev/ThemeEditorController.php:37
* @route '/dev/theme-editor'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/dev/theme-editor',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Dev\ThemeEditorController::update
* @see app/Http/Controllers/Dev/ThemeEditorController.php:37
* @route '/dev/theme-editor'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dev\ThemeEditorController::update
* @see app/Http/Controllers/Dev/ThemeEditorController.php:37
* @route '/dev/theme-editor'
*/
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Dev\ThemeEditorController::update
* @see app/Http/Controllers/Dev/ThemeEditorController.php:37
* @route '/dev/theme-editor'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Dev\ThemeEditorController::update
* @see app/Http/Controllers/Dev/ThemeEditorController.php:37
* @route '/dev/theme-editor'
*/
updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

update.form = updateForm

const ThemeEditorController = { index, update }

export default ThemeEditorController