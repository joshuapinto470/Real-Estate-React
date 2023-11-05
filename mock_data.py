import requests as rq;
import csv

url = 'http://localhost:3000/api/listing/create'

files = {'gallery': open('E:\Downloads\digital-marketing-agency-ntwrk-g39p1kDjvSY-unsplash.jpg', 'rb')}

with open('MOCK_DATA.csv', mode='r', encoding="utf-8") as file:
    csvFile = csv.reader(file)

    for lines in csvFile:
        data = {
            "name" : lines[0],
            "description" : lines[1],
            "address": lines[2],
            "regularPrice" : lines[3],
            "discountPrice" : lines[4],
            "bathrooms": lines[5],
            "bedrooms": lines[6],
            "furnished": lines[7],
            "parking": lines[8],
            "type": "rent" if lines[9] else "sell",
            "offer": lines[10],
            "userRef": lines[11],
        }

        r = rq.post(url, data=data, files=files)
        print(r.json())

        # print(data["name"], data["description"])