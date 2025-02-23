<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Favourite\StoreFavouriteRequest;
use App\Http\Requests\Favourite\UpdateFavouriteRequest;
use App\Models\Favourite;
use App\Http\Resources\V1\Favourite\FavouriteResource;
use App\Http\Resources\V1\Favourite\FavouriteCollection;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class FavouriteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $offset = $request->offset ?? 0;
        $limit = $request->limit ?? 100;
        $favourites = Favourite::skip($offset)->limit($limit)->get();

        return new FavouriteCollection($favourites);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFavouriteRequest $request)
    {
        return new FavouriteResource(Favourite::create($request->all()));
    }

    /**
     * Display the specified resource.
     */
    public function show(Favourite $favourite)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Favourite $favourite)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFavouriteRequest $request, Favourite $favourite)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Favourite $favourite)
    {
        $favourite->delete($request->all());
    }
}
