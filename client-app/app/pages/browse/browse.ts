import { Page } from 'ionic-angular';
import { BarsStore } from '../../common/services/bars-store';
import { LocationService } from '../../common/services/location-service';



@Page({
    templateUrl: 'build/pages/browse/browse.html',
    providers: [BarsStore, LocationService]
})



export class Browse {
    bars: any[];

    constructor(barsStore: BarsStore) {

        barsStore.subscribe(data => {
            this.bars = data.nearbyBars;
        });
    }

    updateBars() {

    }
}
