# Ends unite!

### A demo for the Web Dev & Sausages meetup on 7.3.2019

The idea of this demo is to show how we can create datatypes with similar behaviours both on the frontend (Typescript) and backend (Kotlin), making for consistent internal apis for an `Event` and `Participant`.

The frontend uses the [unionize](https://github.com/pelotom/unionize) library for this purpose, while in Kotlin we can use in-built sealed classes to create a solid datatype. In this demo, the front- and backends shares a `tag` property used internally to match the type of the data sent back and forth.

### [Presentation slides](https://5c7d2b4e94ddec418c8dccf3--sharp-lichterman-fbd20f.netlify.com/#0)
