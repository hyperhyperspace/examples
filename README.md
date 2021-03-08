# Examples for the Hyper Hyper Space core library  

This repo contains examples of distributed data structures creating using the Hyper Hyper Space p2p library.

When using a traditional database, the _at rest_ representation of the application state inside the database is usually fairly decoupled from the one used at runtime: e.g. objects may be serialized to JSON and saved in a key value store, or represented using tables and relationships in a relational database.

In a fully p2p application, state is modified remotely by untrusted parties and updates are sent over the network. HHS tries to make this as simple as possible by providing an object framework that helps the local store understand when updates are valid and whether they should be accepted or rejected. Incidentally, this brings the _at rest_ representaion of information much closer to the actual live version.

This is achieved by representing application state by objects that inherit from the `HashedObject` and `MutableObject` classes in HHS.

In this example you can see a [simple, unmoderated chat room](https://github.com/hyperhyperspace/examples/blob/master/src/chat/model/ChatRoom.ts) created using HHS, and a [CLI-based chat client built](https://github.com/hyperhyperspace/examples/blob/master/src/chat/index.ts) upon it.

To run the example app, clone the repo and do

`yarn build`

`yarn start`

if you're using windows, change the last to

`yarn winstart`

You'll be prompted to either create a new chat room, in which case you'll be given a 3-word code that you can use to share your chat room with others, or to enter such a code and join an existing room.

In this simple example, chat rooms exist until the last participant closes the session.

