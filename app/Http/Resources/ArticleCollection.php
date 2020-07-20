<?php

namespace App\Http\Resources;

use App\Articles;
use App\Http\Resources\ApiResourceCollection;
use App\Http\Resources\ArticleResource;
use Illuminate\Http\Request;

class ArticleCollection extends ApiResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $this->collection->transform(function (Articles $todo) {
            return (new ArticleResource($todo));
        });

        return parent::toArray($request);
    }
}
