import * as xml2js from 'xml2js';
import * as request from 'request-promise-native';
import * as util from 'util';


class DSNScraper {
    /** Stores the last time (in epoch time) config was updated. Starts at zero to ensure update. */
    static configUpdated = 0;
    /** Stores the contents of the config.xml file. */
    static config: any;
    /**
     * Gets /data/dsn.xml and sends it to be parsed by toStatusMessage.
     */
    static async getStatus() {
        var response = await request("https://eyes.nasa.gov/dsn/data/dsn.xml");
        // console.log(response);
        return await DSNScraper.toStatusMessage(response);
    }
    
    /**
     * If it hasn't been updated in 10 seconds, gets config.xml and parses it into the config global.
     */
    static async getConfig() {
        // If config was updated more than 10 seconds ago, update it
        if (Date.now() - DSNScraper.configUpdated > 10000) {
            var response = await request("https://eyes.nasa.gov/dsn/config.xml");
            xml2js.parseString(response, {mergeAttrs: true, explicitRoot: false, explicitArray: false}, (error, result) => {
                if (error) {
                    throw error;
                } else {
                    DSNScraper.config = result;
                }
            })
            DSNScraper.configUpdated = Date.now();
        }
        return DSNScraper.config;
    }
    
    /**
     * Uses dsn.xml and config.xml to create a reasonable JSON status package.
     * @param xmlString the XML content from dsn.xml
     */
    static async toStatusMessage(xmlString: string) {
        let dishes: any;
        xml2js.parseString(xmlString, {mergeAttrs: true, explicitRoot: false, explicitArray: false}, (error, result) => {
            if (error) {
                throw error;
            } else {
                dishes = result;
            }
        });
        let config = await DSNScraper.getConfig();
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
}