// import urllib.request
// import xmltodict
// import json
// import threading
// import time

// class ScraperThread(threading.Thread):
//     def __init__(self, method_to_call, timeout):
//         self.method_to_call = method_to_call
//         self.timeout = timeout
//         self.stopped = False
//         threading.Thread.__init__(self, daemon=True)
//     def run(self):
//         while not self.stopped:
//             self.method_to_call()
//             time.sleep(self.timeout)

// def get_as_dict():
//     response = urllib.request.urlopen("https://eyes.nasa.gov/dsn/data/dsn.xml")
//     return xmltodict.parse(response.read().decode('utf-8'))

// def main():
//     scraper_thread = ScraperThread(lambda: print(json.dumps(get_as_dict(), indent=4)), 1)
//     scraper_thread.start()
//     while True:
//         time.sleep(5)

// if __name__ == '__main__':
//     main()

import * as xml2js from 'xml2js';
import * as https from 'https';

https.get("https://eyes.nasa.gov/dsn/data/dsn.xml", (response) => {
    let body = ''
    response.on('data', (data) => {
        body += data;
    })
    response.on('end', () => {
        xml2js.parseString(body, (error, result) => {
            console.log(result);
        })
    })
})