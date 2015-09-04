'use strict';

angular.module('baltimoreMurals', ['ngResource', 'ui.router', 'uiGmapgoogle-maps'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/');
  })
;
