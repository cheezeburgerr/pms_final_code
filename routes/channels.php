<?php

use App\Models\ChatRoom;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});



Broadcast::channel('notifications_channel.*', function ($user) {
    Auth::check();
    return true;
});

Broadcast::channel('errors_channel.*', function ($user) {
    Auth::check();
    return true;
});

Broadcast::channel('chat.{chatRoomId}', function ($user, $chatRoomId) {
    return ChatRoom::find($chatRoomId) !== null;
});
// Broadcast::channel('notifications_channel.{userId}', function ($user, $userId) {
//     return (int) $user->id === (int) $userId;
// });
