import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

export const Studio = new MongoObservable.Collection<Zone>('Studio');
export const Sala = new MongoObservable.Collection<Zone>('Sala');
export const Bagno = new MongoObservable.Collection<Zone>('Bagno');
export const Cucina = new MongoObservable.Collection<Zone>('Cucina');
export const Ingresso = new MongoObservable.Collection<Zone>('Ingresso');
export const ZonaNotte = new MongoObservable.Collection<Zone>('Zona Notte');