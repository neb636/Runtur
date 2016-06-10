import {Page} from 'ionic-angular';
import { BarsStore } from '../../common/services/bars-store';
import { LocationService } from '../../common/services/location-service';

@Page({
  templateUrl: 'build/pages/page1/page1.html',
  providers: [BarsStore, LocationService]
})
export class Page1 {
  constructor(barsStore: BarsStore) {

    barsStore.setData();
  }
}
