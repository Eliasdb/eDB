<?php

namespace App\Http\Controllers\Api\V1;

use App\Filters\V1\CustomersFilter;
use Illuminate\Http\Request;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Http\Resources\V1\Post\PostCollection;
use App\Http\Resources\V1\Post\PostResource;

use App\Models\Post;
use App\Http\Controllers\Controller;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $offset = $request->offset ?? 0;
        $limit = $request->limit ?? 100;

        $includeComments = $request->query("includeComments");

        $posts = Post::skip($offset)->limit($limit)->filter()->get();

        if ($includeComments) {
            $posts = Post::with("comments")->skip($offset)->limit($limit)->filter()->get();
        }

        return new PostCollection($posts);

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
    public function store(StorePostRequest $request)
    {
        return new PostResource(Post::create($request->all()));
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        $includeComments = request()->query("includeComments");

        if ($includeComments) {
            return new PostResource($post->loadMissing("comments"));
        }

        return new PostResource($post);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        $post->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Post $post)
    {
        $post->delete($request->all());
    }
}
