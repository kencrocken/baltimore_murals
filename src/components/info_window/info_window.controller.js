'use strict';

angular.module('baltimoreMurals').controller('InfoWindowCtrl', function ($scope, uiGmapGoogleMapApi, Murals) {
    console.log("INFOWINDOW CONTROLLER!");
    var mural = function() {
        return Murals.getMural(); 
    };

    if (mural().length > 0 ){
        mural = mural();
        $scope.mural = mural[0];
        console.log($scope.mural);
    }

    $scope.addFavorite = function(x) {
        x.isFavorite = true;
        console.log(x.isFavorite);
    };

    $scope.removeFavorite = function(x) {
        x.isFavorite = false;
        console.log(x.isFavorite);
    };

});