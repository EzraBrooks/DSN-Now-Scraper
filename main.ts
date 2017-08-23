import * as xml2js from 'xml2js';
import * as request from 'request-promise-native';
import * as util from 'util';

let configUpdated = 0;
let config: any;

async function getStatus() {
    var response = await request("https://eyes.nasa.gov/dsn/data/dsn.xml");
    // console.log(response);
    return await toStatusMessage(response);
}

async function getConfig() {
    // If config was updated more than 10 seconds ago, update it
    if (Date.now() - configUpdated > 10000) {
        var response = await request("https://eyes.nasa.gov/dsn/config.xml");
        xml2js.parseString(response, {mergeAttrs: true, explicitRoot: false, explicitArray: false}, (error, result) => {
            if (error) {
                throw error;
            } else {
                config = result;
            }
        })
        configUpdated = Date.now();
    }
    return config;
}

async function toStatusMessage(xmlString: string) {
    let dishes: any;
    xml2js.parseString(xmlString, {mergeAttrs: true, explicitRoot: false, explicitArray: false}, (error, result) => {
        if (error) {
            throw error;
        } else {
            dishes = result;
        }
    });
    let config = await getConfig();
    // config.config.sites[0].site.forEach((site: any) => {
    //     console.log(site);
    // });
    // delete stations from the data.xml since we have that in config
    delete dishes.station;
    let parsedMessage: any = {};
    config.sites.site.forEach((site: any) => {
        site.antennas = [];
        parsedMessage[site.name] = site;
    })
    dishes.dish.forEach((dish: any) => {
        Object.keys(parsedMessage).forEach((siteName: string) => {
            // console.log(parsedMessage[siteName])
            // console.log(parsedMessage[siteName]["dish"]);
            parsedMessage[siteName].dish.forEach((siteDish: any) => {
                if (siteDish.name === dish.name) {
                    parsedMessage[siteName].antennas.push(dish);
                }
            })
        })
    });
    return parsedMessage;
}

(async function() {
    console.log(util.inspect(await getConfig(), false, null));
    console.log(util.inspect(await getStatus(), false, null));
    // await getStatus();
})();