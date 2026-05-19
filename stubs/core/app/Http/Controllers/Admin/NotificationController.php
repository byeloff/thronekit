<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\NotificationTarget;
use App\Enums\NotificationType;
use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DispatchNotificationRequest;
use App\Http\Requests\Admin\StoreNotificationRequest;
use App\Http\Requests\Admin\UpdateNotificationRequest;
use App\Http\Resources\Admin\NotificationResource;
use App\Models\Notification;
use App\Models\User;
use App\Services\Notifications\NotificationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function __construct(
        private readonly NotificationService $service,
    ) {}

    public function index(): Response
    {
        $filters = request()->only(['status']);

        return Inertia::render('admin/notifications/index', [
            'notifications' => NotificationResource::collection(
                $this->service->adminList($filters)
            ),
            'filters' => $filters,
            'types' => array_column(NotificationType::cases(), 'value'),
            'targets' => array_column(NotificationTarget::cases(), 'value'),
            'roles' => array_column(Role::cases(), 'value'),
            'users' => User::query()
                ->whereNull('anonymized_at')
                ->orderBy('name')
                ->get(['id', 'name', 'email']),
        ]);
    }

    public function create(): RedirectResponse
    {
        return redirect()->route('admin.notifications.index');
    }

    public function store(StoreNotificationRequest $request): RedirectResponse
    {
        $notification = $this->service->store(
            $request->safe()->except('dispatch_immediately'),
            $request->user(),
        );

        if ($request->boolean('dispatch_immediately')) {
            $this->service->dispatch($notification);
        }

        return redirect()->route('admin.notifications.index')
            ->with('success', __('admin.notifications.created'));
    }

    public function show(Notification $notification): Response
    {
        return Inertia::render('admin/notifications/show', [
            'notification' => new NotificationResource($notification->loadCount('recipients')),
            'recipients' => $notification->recipients()
                ->with('user:id,name,email')
                ->latest('created_at')
                ->paginate(50)
                ->withQueryString()
                ->through(fn ($r) => [
                    'id' => $r->id,
                    'user' => ['id' => $r->user?->id, 'name' => $r->user?->name, 'email' => $r->user?->email],
                    'read_at' => $r->read_at?->toIso8601String(),
                    'action' => $r->action,
                    'acted_at' => $r->acted_at?->toIso8601String(),
                    'created_at' => $r->created_at?->toIso8601String(),
                ]),
        ]);
    }

    public function edit(Notification $notification): RedirectResponse
    {
        return redirect()->route('admin.notifications.index');
    }

    public function update(UpdateNotificationRequest $request, Notification $notification): RedirectResponse
    {
        if (! $notification->isDraft()) {
            return back()->withErrors(['error' => __('admin.notifications.cannot_edit_sent')]);
        }

        $this->service->update($notification, $request->safe()->except('dispatch_immediately'));

        if ($request->boolean('dispatch_immediately')) {
            $this->service->dispatch($notification);
        }

        return redirect()->route('admin.notifications.index')
            ->with('success', __('admin.notifications.updated'));
    }

    public function dispatch(DispatchNotificationRequest $request, Notification $notification): RedirectResponse
    {
        if (! $notification->isDraft()) {
            return back()->withErrors(['error' => __('admin.notifications.already_dispatched')]);
        }

        $this->service->dispatch($notification);

        return back()->with('success', __('admin.notifications.dispatched'));
    }

    public function destroy(Notification $notification): RedirectResponse
    {
        if (! $notification->isDraft()) {
            return back()->withErrors(['error' => __('admin.notifications.cannot_delete_sent')]);
        }

        $this->service->delete($notification);

        return redirect()->route('admin.notifications.index')
            ->with('success', __('admin.notifications.deleted'));
    }
}
