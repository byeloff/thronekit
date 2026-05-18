<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\NotificationActionRequest;
use App\Http\Resources\UserNotificationResource;
use App\Models\NotificationRecipient;
use App\Services\Notifications\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(
        private readonly NotificationService $service,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $data = $this->service->forUser($request->user());

        return response()->json([
            'data' => UserNotificationResource::collection($data['items']),
            'unread_count' => $data['unread_count'],
        ]);
    }

    public function read(Request $request, NotificationRecipient $notificationRecipient): JsonResponse
    {
        if ($notificationRecipient->user_id !== $request->user()->id) {
            abort(403);
        }

        $this->service->markAsRead($notificationRecipient);

        return response()->json(['ok' => true]);
    }

    public function action(NotificationActionRequest $request, NotificationRecipient $notificationRecipient): JsonResponse|RedirectResponse
    {
        if ($notificationRecipient->user_id !== $request->user()->id) {
            abort(403);
        }

        $this->service->takeAction($notificationRecipient, $request->validated('action'));

        return response()->json(['ok' => true]);
    }
}
