<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Order;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function index()
    {


        $orders = Order::with('production', 'latestapproved')->where('customer_id' , auth()->user()->id)->get();
        // dd($orders);
        return Inertia::render('Profile/Index', [
            'status' => session('status'),
            'orders' => $orders
        ]);
    }

    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }


    public function picture(Request $request)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB Max
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user1 = Auth::user();
        $user =  User::find($user1->id);// Get the currently authenticated user

        // dd($request->all());
        if ($request->hasFile('picture')) {
            // Handle the file upload
            $file = $request->file('picture');
            $fileName = time() . '-' . $file->getClientOriginalName();
            // $filePath = $file->storeAs('public/images/customers/profile/', $fileName);
            $path = $file->store('images/customers/profile/', 'public');
            $path = $file->move('images/customers/profile/', $fileName);

            // Delete old profile picture if exists
            if ($user->image && Storage::exists('public/images/customers/profile/' . $user->image)) {
                Storage::delete('public/images/customers/profile/' . $user->image);
            }
            $user->image = $fileName;
            $user->save();
            // dd($user);
        }

        // Return a response indicating success
        return redirect()->back()->with('success', 'Profile picture updated successfully.');
    }
    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
