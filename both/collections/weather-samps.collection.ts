import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { WeatherSamp } from '../models/weather-samp.model';

export const WeatherSamps = new MongoObservable.Collection<WeatherSamp>('weatherSamps');