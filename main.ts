import { DSNScraper } from './DSNScraper';
import * as Autobahn from 'autobahn';

var connection = new Autobahn.Connection({
    url: "ws://crossbar:8080/ws",
    realm: "realm1"
});

connection.onopen = (session, details) => {
    setInterval(async function() {
        session.publish("dsn-status", [await DSNScraper.getStatus()])
    }, 1000)
    session.publish("topic", ["connected!"]);
    console.log("connected!");
}
connection.onclose = (reason, details) => {
    console.log(reason);
    return true;
}
connection.open();