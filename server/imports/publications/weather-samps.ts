import { Meteor } from 'meteor/meteor';
import { WeatherSamps } from '../../../both/collections/weather-samps.collection';

Meteor.publish('weatherSamps', () => WeatherSamps.find({}));