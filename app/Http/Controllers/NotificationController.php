<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;

class NotificationController extends Controller
{
    // Get notifications for the current user
    public function index()
    {
        $user = auth()->user();

        $notifications = AppNotification::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($notifications);
    }

    // Mark a single notification as read
    public function markAsRead($id)
    {
        $notification = AppNotification::where('user_id', auth()->id())
            ->findOrFail($id);

        $notification->update(['is_read' => true]);

        return response()->json(['status' => 'read']);
    }

    // Mark all notifications as read
    public function markAllAsRead()
    {
        AppNotification::where('user_id', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['status' => 'all_read']);
    }

    // Delete a notification
    public function destroy($id)
    {
        $notification = AppNotification::where('user_id', auth()->id())
            ->findOrFail($id);

        $notification->delete();

        return response()->json(['status' => 'deleted']);
    }
}
