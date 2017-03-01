import { Meteor } from 'meteor/meteor';
import { Studio, Sala, Bagno, Cucina, Ingresso, ZonaNotte } from '../../../both/collections/zones.collection';

Meteor.publish('studio', () => Studio.find({}));
Meteor.publish('sala', () => Sala.find({}));
Meteor.publish('bagno', () => Bagno.find({}));
Meteor.publish('cucina', () => Cucina.find({}));
Meteor.publish('ingresso', () => Ingresso.find({}));
Meteor.publish('zonaNotte', () => ZonaNotte.find({}));