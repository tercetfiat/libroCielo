
function getBodyRequest(pageNo, pageSize, phrase,phraseEscape) {
    var elements = `{
                    "dataSource": "Cluster0",
                    "database": "book",
                    "collection": "pages",
                    "pipeline":  [
                {
                  "$match": { "area": { "$regex": "AAAS" } }
                }, {
                  "$addFields": { "position": { "$indexOfCP": ["$area", "AAA" ]}, 
                    "area": { "$substrCP": ["$area", {"$indexOfCP": ["$area", "AAA"]}, 
                            {"$add": [{"$indexOfCP": [ "$area", "AAA"]}, 100]}]
                    }
                  }
                }, {
                    "$facet": {
                    "metadata": [ { "$count": "total" } ],
                    "data": [ { "$skip": pageNo }, { "$limit": pageSize } ]
                }
                } , { "$project": {
                      "total": { "$arrayElemAt": [ "$metadata.total", 0 ] },
                      "data": 1
                  }
                }, { "$unset" : "data._id" }
              ]
              }`;

            elements = elements.replaceAll("AAAS", phraseEscape);  
            elements = elements.replaceAll("AAA", phrase);
            elements = elements.replaceAll("pageNo", pageNo);
            elements = elements.replaceAll("pageSize", pageSize);      
    return elements;
}

export default getBodyRequest;