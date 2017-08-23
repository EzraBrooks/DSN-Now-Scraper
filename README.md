DSN Now Scraper
===
This Python script scrapes Deep Space Network Now's data.xml file and parses it into more useful formats. Initially, it will just be outputting JSON. I plan to also support caching in MongoDB and pushing real-time<sup>[1](#footnote1)</sup> data to a [WAMP](wamp-proto.org) bus.

<a name="footnote1">1</a>: as real-time as it gets with the latency inherent in them pushing to XML, the application grabbing it, then parsing it