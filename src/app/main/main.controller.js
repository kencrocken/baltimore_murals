'use strict';

angular.module('baltimoreMurals')
  .controller('MainCtrl', function ($scope, $window, uiGmapGoogleMapApi, Murals, preloader) {
    $scope.data;
    $scope.percentLoaded = 0;
    $scope.markers = [];
    $scope.imageLocations = [];
    $scope.isLoading = true;
    $scope.isSuccessful = false;
    $scope.overlay = false;
    $scope.slidePanel = false;

    var murals = Murals.allMurals.query();
    murals.$promise.then(function(data){
        $scope.data = data;
        _.each($scope.data, function(item, index){
            $scope.markers.push($scope.createMural(item, index));
            if(item.image) {
                $scope.imageLocations.push("https://data.baltimorecity.gov/views/zqh4-9ud5/files/" + item.image.file_id + "?filename=" +item.image.filename);
            }
        });
        preloader.preloadImages( $scope.imageLocations ).then(
            function handleResolve( imageLocations ) {
                // Loading was successful.
                $scope.isLoading = false;
                $scope.isSuccessful = true;
                console.info( "Preload Successful" );
            },
            function handleReject( imageLocation ) {
                // Loading failed on at least one image.
                $scope.isLoading = false;
                $scope.isSuccessful = false;
                console.error( "Image Failed", imageLocation );
                console.info( "Preload Failure" );
            },
            function handleNotify( event ) {
                $scope.percentLoaded = event.percent;
                console.info( "Percent loaded:", event.percent );
            }
        );
    });

    // Preload the images; then, update display when returned.
    

    $scope.slideToggle = function(){
        $scope.slidePanel = !$scope.slidePanel;
        $scope.favorites = Murals.getFavorites();
    };
    $scope.createMural = function(mural, index){
        var mural = {
            id: index,
            latitude: mural.location_1.latitude,
            longitude: mural.location_1.longitude,
            address: mural.location,
            image: mural.image,
            title: mural.artistfirstname + ' ' + mural.artistlastname,
            isFavorite: false,
            icon: "assets/images/mural.png"
        }


        return mural;
    }   

    $scope.close = function() {
        $scope.overlay = !$scope.overlay;
    };

    $scope.addFavorite = function(mural) {
        mural.isFavorite = true;
        mural.icon = "assets/images/favoriteMural.png";
        Murals.addMural(mural)
        console.log(mural);

    };

    $scope.removeFavorite = function(mural) {
        mural.isFavorite = false;
        mural.icon = "assets/images/mural.png";
        Murals.removeMural(mural);
    };     
    $scope.showOverlay = function(model) {
        $scope.overlay = !$scope.overlay;
        $scope.map.window.model = model;

    }
    // $scope.favorites = Murals.getFavorites();

    uiGmapGoogleMapApi.then(function(maps) {

        $scope.map = { 
            center: { latitude: 39.29, longitude: -76.61 }, 
            zoom: 12,
            events: {
                bounds_changed: function(map) {
                    $scope.$apply(function () {
                        mapRef=map;
                    });
                }
            },
            markers: $scope.markers, // array of models to display
            markersEvents: {
                click: function(marker, eventName, model, args) {
                    console.log(model);
                    $scope.showOverlay(model);
                }
            },
            window: {
                marker: {},
                show: false,
                closeClick: function() {
                    this.show = false;
                },
                options: {} // define when map is ready
            },
            control: {},
        };

        $scope.options = {
            scrollwheel: false,
            mapTypeId: "roadmap",
            mapTypeControl: false,
            overviewMapControl: false,
            streetViewControl: false,
            maxZoom: 20,
            minZoom: 11,
            styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":60}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]}]
        };

        $scope.polygons = [
            {
                id: 1,
                path: [
                    {
                        latitude: 39.371957,
                        longitude: -76.711294
                    },
                    {
                        latitude: 39.371972,
                        longitude: -76.529674
                    },
                    {
                        latitude: 39.209623,
                        longitude: -76.529858
                    },
                    {
                        latitude: 39.197233,
                        longitude:  -76.549725
                    },
                    {
                        latitude: 39.208121,
                        longitude: -76.583673
                    },
                    {
                        latitude: 39.234395,
                        longitude: -76.611611
                    },
                    {
                        latitude: 39.277838,
                        longitude: -76.711161
                    },
                    {
                        latitude: 39.371957,
                        longitude: -76.711294
                    }
                ],
                stroke: {
                    color: '#FF0000',
                    weight: 3
                },
                editable: false,
                draggable: false,
                geodesic: false,
                visible: true,
                fill: {
                    color: '#000',
                    opacity: 0.1
                }
            }
        ];
        var w = angular.element($window);
        w.bind('resize', function () {
            google.maps.event.addDomListener(window, "resize", function() {
                var map = $scope.map.control.getGMap();
                var latLon = {lat: $scope.map.center.latitude, lng: $scope.map.center.longitude};

                map.panTo(latLon); 

            });
        });
        $scope.map.window.options.pixelOffset = new google.maps.Size(0, -35, 'px', 'px');

    });
  });
