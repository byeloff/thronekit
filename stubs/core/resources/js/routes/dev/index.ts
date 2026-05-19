import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import themeEditorC264ce from './theme-editor'
/**
* @see \App\Http\Controllers\Dev\ThemeEditorController::themeEditor
* @see app/Http/Controllers/Dev/ThemeEditorController.php:26
* @route '/dev/theme-editor'
*/
export const themeEditor = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: themeEditor.url(options),
    method: 'get',
})

themeEditor.definition = {
    methods: ["get","head"],
    url: '/dev/theme-editor',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dev\ThemeEditorController::themeEditor
* @see app/Http/Controllers/Dev/ThemeEditorController.php:26
* @route '/dev/theme-editor'
*/
themeEditor.url = (options?: RouteQueryOptions) => {
    return themeEditor.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dev\ThemeEditorController::themeEditor
* @see app/Http/Controllers/Dev/ThemeEditorController.php:26
* @route '/dev/theme-editor'
*/
themeEditor.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: themeEditor.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dev\ThemeEditorController::themeEditor
* @see app/Http/Controllers/Dev/ThemeEditorController.php:26
* @route '/dev/theme-editor'
*/
themeEditor.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: themeEditor.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Dev\ThemeEditorController::themeEditor
* @see app/Http/Controllers/Dev/ThemeEditorController.php:26
* @route '/dev/theme-editor'
*/
const themeEditorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: themeEditor.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dev\ThemeEditorController::themeEditor
* @see app/Http/Controllers/Dev/ThemeEditorController.php:26
* @route '/dev/theme-editor'
*/
themeEditorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: themeEditor.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dev\ThemeEditorController::themeEditor
* @see app/Http/Controllers/Dev/ThemeEditorController.php:26
* @route '/dev/theme-editor'
*/
themeEditorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: themeEditor.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

themeEditor.form = themeEditorForm

const dev = {
    themeEditor: Object.assign(themeEditor, themeEditorC264ce),
}

export default dev