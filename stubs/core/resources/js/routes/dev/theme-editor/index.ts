import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
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

const themeEditor = {
    update: Object.assign(update, update),
}

export default themeEditor