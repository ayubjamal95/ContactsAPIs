const { respondWith200OkJson, respondWith404NotFound, respondWith200OkText} = require('../httpHelpers');
const { urlPathOf, urlQueryParam } = require('../httpHelpers');
const { fakeDatabase } = require('../database/fakeDatabase');
const { routerHandleResult } = require('../routerHandleResult');
const { getEventListeners } = require('events');

function handle(request, response) {
 
  // //logic begins from here
  let contacts = fakeDatabase.selectAllFromContacts();
  if (urlQueryParam(request) != null && Object.keys(urlQueryParam(request)).length != 0 ) {
    const query = urlQueryParam(request);

    // get call for phrase
    if ( query['phrase'].toString() != ''  && !('limit' in query)){
      let queryValue = query['phrase'];
      let filteredContacts = contacts.filter(function(a) 
        {
          if (a.name.toUpperCase().match(queryValue.toUpperCase()) != null){
            return a;
          }
        });
      respondWith200OkJson(response,filteredContacts);
    }
    
    // get call with phrase and limit
    if ( query['phrase'].toString() != '' && 'limit' in query){

      let queryValue = query['phrase'];
      let filteredContact = contacts.filter(function(a)
        {
          if (a.name.toUpperCase().match(queryValue.toString().toUpperCase()) != null ){
            return a;
          }
        });
      const item = filteredContact.slice(0,Number(query['limit']));
      respondWith200OkJson(response,item);
    }

    // empty phrase get call
    if (query['phrase'].toString() === '' && 'phrase' in query ){
      respondWith404NotFound(response);
    }
    return routerHandleResult.HANDLED;
  }

  // delete request 
  if (request.method == 'DELETE' && urlPathOf(request) == "/contacts/"+ urlPathOf(request).split('/').pop()){ 
    const contactId = urlPathOf(request).split('/').pop(); 
    const contactDetails = contacts.filter(function(a){
      if (a.id != contactId )
      {
        return a;
      }
    });
    contacts = contactDetails;
    respondWith200OkText(response,"deleted");
    return routerHandleResult.HANDLED;
  }

  // get call against contact id
  if (request.method == 'GET' && urlPathOf(request) == "/contacts/"+ urlPathOf(request).split('/').pop())
  { 
    const contactId = urlPathOf(request).split('/').pop(); 
    const contactDetails = contacts.filter(function(a){
      if (a.id == contactId ){
        return a;
      }
    });
    if (contactDetails.length == 0){ 
      respondWith404NotFound(response);
    }
    else{

      const alreadyDeleted = contacts.filter(function(a){
        if (a.id == contactDetails){
          return a;
        }        
      });    
      if (alreadyDeleted.length != 0){
        respondWith200OkText(response,"already Deleted")
      }
      else{
        respondWith200OkJson(response,contactDetails);
      }
    } 
    return routerHandleResult.HANDLED;
  }
  // all sorted contacts
  if (urlPathOf(request) == "/contacts"){
    contacts.sort(sortByName("name"));
    respondWith200OkJson(response,contacts);
    return routerHandleResult.HANDLED;
  }
  
}
  
function sortByName(name){  
  return function(a,b){  
     if(a[name] > b[name])  
        return 1;  
     else if(a[name] < b[name])  
        return -1;  
     return 0;  
  }  
}
module.exports = {
  handle,
};
