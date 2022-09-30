const {
  respondWith404NotFound,
} = require('./httpHelpers');
const { routerHandleResult } = require('./routerHandleResult');

const routers = [
  require('./contacts').contactsRouter,
  require('./ping').pingRouter,
  require('./contactDetails').contactDetailsRouter,
];

module.exports = function(request, response) {
  if (routers[0].handle(request, response) !== routerHandleResult.HANDLED) {
    respondWith404NotFound(response);
  };

  
  
};
