<?php

namespace App\Http\Controllers\Api\V1;

use App\Filters\V1\CustomersFilter;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\V1\User\UserCollection;
use App\Http\Resources\V1\User\UserResource;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function index(Request $request)
    {
        $filter = new CustomersFilter();
        $filterItems = $filter->transform($request); // [['column', 'operator', 'value']]

        $includeBooks = $request->query("includeBooks");
        $includeFavourites = $request->query("includeFavourites");


        $users = User::where($filterItems);

        if ($includeBooks) {
            $users = $users->with("books");
        }

        if ($includeFavourites) {
            $users = $users->with("favourites");
        }

        return new UserCollection($users->paginate(10));

    }


    // Register API (POST, formdata)
    public function store(StoreUserRequest $request)
    {

        $user =  new UserResource(User::create($request->all()));

        // Response
        return response()->json([
            "message" => "Registered successfully!",
            "user" => $user,
        ]);

    }

    /**
     * Update the specified resource in storage.
     */

    public function update(UpdateUserRequest $request, User $user)
    {

        // $request->validate([
        //     "id" => "required"
        // ]);

        // $user = User::where('id', $request->id)->first();


        // $this->authorize('update', $user);



        $user->update($request->all());
    }


    // Login API (POST, formdata)
    public function login(Request $request)
    {
        // data validation
        $request->validate([
            "name" => "required",
            "password" => "required"
        ]);

        $credentials = request(['name', 'password']);

        if (!auth()-> attempt($credentials)) {
            return response()->json([
                "message" => "The given data was invalid.",
                "errors" => [
                    "password" => [
                        "Invalid credentials."
                    ],
                ]
                ], status: 422);
        }

        $user = User::where('name', $request->name)->first();
        $authToken = $user->createToken('auth-token')->plainTextToken;
        $userdata = auth()->user();

        return response()->json([
            "message" => "Logged in successfully!",
            "id" => $userdata->id,
            "userName" => $userdata->name,
            "accessToken" => $authToken,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $includeBooks = request()->query("includeBooks");
        $includeFavourites = request()->query("includeFavourites");

        if ($includeBooks) {
            return new UserResource($user->loadMissing("books"));
        }

        if ($includeFavourites) {
            return new UserResource($user->loadMissing("favourites"));
        }

        return new UserResource($user);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UpdateUserRequest $request, User $customer)
    {
        $customer->delete($request->all());
    }

    // Profile API (GET)
    public function profile()
    {
        $userdata = auth()->user();

        return response()->json([
            "status" => true,
            "message" => "Profile data.",
            "data" => $userdata
        ]);
    }

    // Refresh Token API (GET)
    // public function refreshToken()
    // {
    //     $newToken = auth()->refresh();

    //     return response()->json([
    //         "status" => true,
    //         "message" => "New access token generated.",
    //         "token" => $newToken
    //     ]);
    // }

    // Logout API (GET)
    public function logout()
    {
        auth()->logout();

        return response()->json([
            "status" => true,
            "message" => "User logged out successfully."
        ]);
    }

}
