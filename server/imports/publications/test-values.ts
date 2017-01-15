import { Meteor } from 'meteor/meteor';
import { TestValues } from '../../../both/collections/test-values.collection';

Meteor.publish('testValues', () => TestValues.find({}));