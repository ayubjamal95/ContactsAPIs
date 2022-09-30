const url = require('url');

module.exports = {
  urlPathOf: (request) => url.parse(request.url,true).pathname,
  urlQueryParam : (request) => url.parse(request.url,true).query,

  respondWith200OkText: (response, textBody) => {
    response.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    return response.end(textBody);
   
  },

  respondWith200OkJson: (response, jsonBody) => {
    response.writeHead(200, {
      'Content-Type': 'application/json',
    });
    return response.end(JSON.stringify(jsonBody));
    
  },

  respondWith404NotFound: (response) => {
    response.writeHead(400);
    return response.end();
  },
};
