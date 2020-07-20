<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\APIController;
use App\Http\Resources\ArticleCollection;
use App\Http\Resources\ArticleResource;
use App\Articles;

class ArticleController extends ApiController
{
  /**
   * Display a listing of the resource.
   *
   * @return Response
   */
  public function index(Request $request)
  {
    $collection = Articles::query()->orderBy('orders', 'desc');

    if ($status = $request->query('status')) {
      if ('active' === $status || 'closed' === $status) {
        $collection = $collection->where('status', $status);
      }
    }

    $collection = $collection->latest()->paginate();

    if ($status) {
      $collection = $collection->appends('status', $status);
    }
    return new ArticleCollection($collection);
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param Request $request
   * @return Response
   */

  public function store(Request $request)
  {

    if (!$user = auth()->setRequest($request)->user()) {
      return $this->responseUnauthorized();
    }

    $validator = Validator::make($request->all(), [
      'value' => 'required',
      'description' => 'required',
      'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
    ]);

    if ($validator->fails()) {
      return $this->responseUnprocessable($validator->errors());
    }
    $imageRequest = request('image');
    $imageName = $imageRequest . time() . '.' . $imageRequest->extension();
    $imageName = mb_substr($imageName, 5);
    $imageRequest->move(public_path('images'), $imageName);
    try {
      $article = Articles::create([
        'user_id' => $user->id,
        'value' => request('value'),
        'image' => $imageName,
        'description' => request('description'),
      ]);
      $articlequery = Articles::where('id', $article->id)->firstOrFail();
      $articlequery->orders = $todo->id;
      $articlequery->save();

      return response()->json([
        'status' => 201,
        'message' => 'Element created.',
        'id' => $article->id
      ], 201);
    } catch (Exception $e) {
      return $this->responseServerError('Error creating resource.');
    }

  }

  /**
   * Display the specified resource.
   *
   * @param int $id
   * @return Response
//   */

  /**
   * Update the specified resource in storage.
   *
   * @param Request $request
   * @param int $id
   * @return Response
   */
  public function update(Request $request, $id)
  {

    if (!$user = auth()->setRequest($request)->user()) {
      return $this->responseUnauthorized();
    }
    if ($user->role != 1) {
      return $this->responseUnauthorized();
    }
    $validator = Validator::make($request->all(), [
      'value' => 'string',
      'status' => 'in:closed,active',
    ]);

    if ($validator->fails()) {
      return $this->responseUnprocessable($validator->errors());
    }

    try {
      $articlequery = Articles::where('id', $id)->firstOrFail();
      if ($user->role === 1) {
        if (request('orders')) {
          $articlequery->orders = request('orders');
        }
        if (request('status')) {
          $articlequery->status = request('status');
        }

        $articlequery->save();
        return $this->responseResourceUpdated();
      } else {
        return $this->responseUnauthorized();
      }
    } catch (Exception $e) {
      return $this->responseServerError('Error updating resource.');
    }
  }

}
