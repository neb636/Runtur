

export class LocationService {

    getPosition() {
        const options = {
            maximumAge: 3000,
            timeout: 5000,
            enableHighAccuracy: true
        };

        return new Promise((resolve, reject) => {

            navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

            function onSuccess(current) {

                resolve({
                    'latitude': current.coords.latitude,
                    'longitude': current.coords.longitude
                });
            }

            function onError(error) {
                reject('Failed to Get Lat Long');
            }
        });
    };
}