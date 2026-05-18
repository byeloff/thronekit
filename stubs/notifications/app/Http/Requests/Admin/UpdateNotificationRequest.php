<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\NotificationTarget;
use App\Enums\NotificationType;
use App\Enums\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateNotificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole([Role::SuperAdmin, Role::Admin]) ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:5000'],
            'type' => ['required', Rule::enum(NotificationType::class)],
            'data' => ['nullable', 'array'],
            'data.yes_label' => ['required_if:type,action', 'string', 'max:60'],
            'data.no_label' => ['required_if:type,action', 'string', 'max:60'],
            'data.url' => ['required_if:type,link', 'string', 'max:1000'],
            'data.label' => ['nullable', 'string', 'max:60'],
            'target_type' => ['required', Rule::enum(NotificationTarget::class)],
            'target_roles' => ['required_if:target_type,role', 'nullable', 'array'],
            'target_roles.*' => ['string', Rule::in(array_column(Role::cases(), 'value'))],
            'target_user_ids' => ['required_if:target_type,specific', 'nullable', 'array'],
            'target_user_ids.*' => ['integer', 'exists:users,id'],
            'dispatch_immediately' => ['sometimes', 'boolean'],
        ];
    }
}
