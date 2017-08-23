import * as xml2js from 'xml2js';
import * as request from 'request-promise-native';
import * as util from 'util';

async function getStatus() {
    var response = await request("https://eyes.nasa.gov/dsn/data/dsn.xml");
    // console.log(response);
    let parsedMessage;
    xml2js.parseString(response, {mergeAttrs: true}, (error, result) => {
        if (error) {
            throw error;
        } else {
            parsedMessage = result;
        }
    });
    return parsedMessage;
}

getStatus();