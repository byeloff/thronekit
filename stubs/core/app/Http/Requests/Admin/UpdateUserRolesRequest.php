<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRolesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole(Role::SuperAdmin) ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        $validRoles = array_column(Role::cases(), 'value');

        return [
            'roles' => ['present', 'array'],
            'roles.*' => ['string', Rule::in($validRoles)],
        ];
    }
}
