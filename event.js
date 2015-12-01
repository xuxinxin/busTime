/**
 * Created by star on 15/11/30.
 */
(function(){
    function isArray(array){
        return Object.prototype.toString.call(array) === '[object Array]';
    }

    var Event = {};
    Event.e={};
    Event.hasEvent = function(eventName){
        return isArray(Event['e'][eventName]);
    };

    Event.add = function(eventName){
        if(!Event.hasEvent(eventName)){
           Event['e'][eventName] = [];
        }
    };

    Event.listen = function(eventName, callback){
        if(!Event.hasEvent(eventName)){
            Event.add(eventName)
        }
        Event['e'][eventName].push(callback);
    };

    Event.trigger = function(eventName){
       if(Event.hasEvent(eventName)){
           var eventArray = Event['e'][eventName];
           if(eventArray.length > 0){
               eventArray.forEach(function(item){
                   item();
               })
           }
       }
    };

    window.Event = Event;
})();