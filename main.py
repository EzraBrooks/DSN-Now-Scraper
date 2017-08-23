import urllib.request
import xmltodict
import json

response = urllib.request.urlopen("https://eyes.nasa.gov/dsn/data/dsn.xml")
print(json.dumps(xmltodict.parse(response.read().decode('utf-8')), indent=4))