import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

export const TestValues = new MongoObservable.Collection('testValues');