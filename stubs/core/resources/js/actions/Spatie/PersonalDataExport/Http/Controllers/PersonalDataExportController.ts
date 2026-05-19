import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \Spatie\PersonalDataExport\Http\Controllers\PersonalDataExportController::exportMethod
* @see vendor/spatie/laravel-personal-data-export/src/Http/Controllers/PersonalDataExportController.php:19
* @route '/personal-data-exports/{zipFilename}'
*/
export const exportMethod = (args: { zipFilename: string | number } | [zipFilename: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/personal-data-exports/{zipFilename}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Spatie\PersonalDataExport\Http\Controllers\PersonalDataExportController::exportMethod
* @see vendor/spatie/laravel-personal-data-export/src/Http/Controllers/PersonalDataExportController.php:19
* @route '/personal-data-exports/{zipFilename}'
*/
exportMethod.url = (args: { zipFilename: string | number } | [zipFilename: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { zipFilename: args }
    }

    if (Array.isArray(args)) {
        args = {
            zipFilename: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        zipFilename: args.zipFilename,
    }

    return exportMethod.definition.url
            .replace('{zipFilename}', parsedArgs.zipFilename.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \Spatie\PersonalDataExport\Http\Controllers\PersonalDataExportController::exportMethod
* @see vendor/spatie/laravel-personal-data-export/src/Http/Controllers/PersonalDataExportController.php:19
* @route '/personal-data-exports/{zipFilename}'
*/
exportMethod.get = (args: { zipFilename: string | number } | [zipFilename: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

/**
* @see \Spatie\PersonalDataExport\Http\Controllers\PersonalDataExportController::exportMethod
* @see vendor/spatie/laravel-personal-data-export/src/Http/Controllers/PersonalDataExportController.php:19
* @route '/personal-data-exports/{zipFilename}'
*/
exportMethod.head = (args: { zipFilename: string | number } | [zipFilename: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(args, options),
    method: 'head',
})

/**
* @see \Spatie\PersonalDataExport\Http\Controllers\PersonalDataExportController::exportMethod
* @see vendor/spatie/laravel-personal-data-export/src/Http/Controllers/PersonalDataExportController.php:19
* @route '/personal-data-exports/{zipFilename}'
*/
const exportMethodForm = (args: { zipFilename: string | number } | [zipFilename: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(args, options),
    method: 'get',
})

/**
* @see \Spatie\PersonalDataExport\Http\Controllers\PersonalDataExportController::exportMethod
* @see vendor/spatie/laravel-personal-data-export/src/Http/Controllers/PersonalDataExportController.php:19
* @route '/personal-data-exports/{zipFilename}'
*/
exportMethodForm.get = (args: { zipFilename: string | number } | [zipFilename: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(args, options),
    method: 'get',
})

/**
* @see \Spatie\PersonalDataExport\Http\Controllers\PersonalDataExportController::exportMethod
* @see vendor/spatie/laravel-personal-data-export/src/Http/Controllers/PersonalDataExportController.php:19
* @route '/personal-data-exports/{zipFilename}'
*/
exportMethodForm.head = (args: { zipFilename: string | number } | [zipFilename: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportMethod.form = exportMethodForm

const PersonalDataExportController = { exportMethod, export: exportMethod }

export default PersonalDataExportController