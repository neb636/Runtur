import {Page} from 'ionic-angular';
import {Page1} from '../page1/page1';
import {Browse} from '../browse/browse';
import {Page3} from '../page3/page3';
import {Settings} from '../settings/settings';

@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})

export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  map: any = Page1;
  browse: any = Browse;
  favoriteBars: any = Page3;
  settings: any = Settings;
}
