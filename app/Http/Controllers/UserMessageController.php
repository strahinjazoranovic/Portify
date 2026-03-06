<?php
namespace App\Http\Controllers;

use App\Models\UserMessage;
use Illuminate\Http\Request;

class UserMessageController extends Controller
{
    public function index()
    {
        $messages = UserMessage::all();
        return response()->json($messages);
    }
}
