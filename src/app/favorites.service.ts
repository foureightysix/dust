import { Injectable, signal } from '@angular/core';
import PouchDB from 'pouchdb';
import { Favorites } from './models';

enum DbId {
  favorites = 'favorites'
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private db!: PouchDB.Database;

  private ready: Promise<void>;
  public changed = signal(1);

  private favorites: Favorites = { art: [], events: [], camps: [], friends: [] };

  constructor() {
    this.db = new PouchDB('favorites');
    this.ready = this.load();
  }

  public async getEvents(): Promise<string[]> {
    await this.ready;
    return this.favorites.events;
  }

  public async isFavEvent(id: string): Promise<boolean> {
    await this.ready;
    return this.favorites.events.includes(id);
  }

  public async starEvent(star: boolean, eventId: string) {
    this.favorites.events = this.include(star, eventId, this.favorites.events);
    const doc = await this.get(DbId.favorites, this.favorites);
    doc.data = this.favorites;
    await this.db.put(doc);
    const i = this.changed();
    this.changed.set(i + 1);
  }

  private async get(id: DbId, defaultValue: any): Promise<any> {
    try {
      return await this.db.get(DbId.favorites);
    } catch {
      return { _id: id, data: defaultValue };
    }
  }

  private async load() {
    const doc = await this.get(DbId.favorites, this.favorites);
    this.favorites = doc.data;
    console.log('load', this.favorites);
  }

  private include(add: boolean, value: string, items: string[]): string[] {
    if (add && !items.includes(value)) {
      items.push(value);
    }
    if (!add && items.includes(value)) {
      const i = items.indexOf(value);
      items.splice(i, 1);
    }
    return items;
  }
}