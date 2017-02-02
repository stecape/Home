import pymongo

from pymongo import MongoClient
client = MongoClient('127.0.0.1', 3001)

db = client.meteor

collection = db['weatherSamps']

print(collection.find_one({}))