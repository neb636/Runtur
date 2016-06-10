import { Injectable } from '@angular/core';
import { BaseDataStore } from './base-data-store';
import { LocationService } from './location-service';
declare var google: any;

@Injectable()
export class BarsStore extends BaseDataStore {
    placesApi: any;
    locationService: any;

    constructor(locationService: LocationService) {
        super();

        this.createSchema({
            nearbyBars: null,
            favoriteBars: null
        });

        let dummyElement = document.getElementById('dummy-element');
        this.locationService = locationService;
        this.placesApi = new google.maps.places.PlacesService(dummyElement);
    }


    setData() {
        let position;

        return this.locationService.getPosition()

            .then(currentPosition => {
                position = currentPosition;

                let coordinates = new google.maps.LatLng(position.latitude, position.longitude);

                return {
                    location: coordinates,
                    types: ['bar'],
                    openNow: true, // TODO: Change this to use database at later date
                    rankBy: google.maps.places.RankBy.DISTANCE
                };
            })

            .then(placesRequest => {

                this.placesApi.nearbySearch(placesRequest, (bars, status) => {

                    if (status === google.maps.places.PlacesServiceStatus.OK) {

                        this._calculateDistances(bars, position)



                            .then(bars => {
                                this.updateKeys.apply(this, { nearbyBars: bars });
                            });
                    }
                });
            });
    };

    getDetailedBar(barId) {
        let placesRequest = { placeId: barId };

        return new Promise((resolve, reject) => {

            this.placesApi.getDetails(placesRequest, (place, status) => {

                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(place);
                }
            }, error => {
                reject(error);
            });
        });
    }

    _calculateDistances(bars, current) {
        let distanceMatrixService = new google.maps.DistanceMatrixService();
        let currentLocation = new google.maps.LatLng(current.latitude, current.longitude);
        let barLocations = [];

        bars.forEach(bar => barLocations.push(bar.vicinity));

        let requestOptions = {
            origins: [currentLocation],
            destinations: barLocations,
            travelMode: google.maps.TravelMode.WALKING,
            unitSystem: google.maps.UnitSystem.IMPERIAL
        };


        return new Promise((resolve, reject) => {

            distanceMatrixService.getDistanceMatrix(requestOptions, (response, status) => {

                if (status === 'OK') {
                    let distanceResults = response.rows[0].elements;

                    // Match response up ith original bar object
                    let newBarsObject = bars.map((bar, index) => {
                        bar.distance = distanceResults[index].distance.text;
                        bar.walkingDuration = distanceResults[index].duration.text;

                        return bar;
                    });

                    resolve(newBarsObject);
                }
                else {
                    reject(response);
                }
            });
        });
    }
}
