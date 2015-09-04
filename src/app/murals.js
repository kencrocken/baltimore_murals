'use strict';

angular.module('baltimoreMurals')
.factory('Murals', function ($resource) {
    var favoriteMurals = [];

    var addMural = function(mural) {
        favoriteMurals.push(mural);
    }

    var removeMural = function(mural){
        var index = favoriteMurals.indexOf(mural);
        favoriteMurals.splice(index, 1);  
    }

    var getFavorites = function() {
        return favoriteMurals;
    }

    return {

        allMurals: $resource('https://data.baltimorecity.gov/resource/zqh4-9ud5.json'),
        addMural: addMural,
        removeMural: removeMural,
        getFavorites: getFavorites

    }
});