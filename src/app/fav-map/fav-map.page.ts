import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MapComponent } from '../map/map.component';
import { FavoritesService } from '../favs/favorites.service';
import { DbService } from '../data/db.service';
import { MapPoint } from '../data/models';

@Component({
  selector: 'app-fav-map',
  templateUrl: './fav-map.page.html',
  styleUrls: ['./fav-map.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MapComponent]
})
export class FavMapPage implements OnInit {
  isToastOpen = false;
  points: MapPoint[] = [];
  title = '';
  constructor(private fav: FavoritesService, private db: DbService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.title = this.fav.getMapPointsTitle();
    this.points = this.fav.getMapPoints();
    if (this.db.locationsHidden()) {
      this.isToastOpen = true;
    }
  }

}
