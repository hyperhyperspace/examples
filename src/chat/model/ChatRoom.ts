import { HashedObject, HashedLiteral } from '@hyper-hyper-space/core';
import { MutableSet, MutableReference } from '@hyper-hyper-space/core';
import { Identity } from '@hyper-hyper-space/core';
import { SpaceEntryPoint } from '@hyper-hyper-space/core';
import { PeerNode } from '@hyper-hyper-space/core';

import { Message } from './Message';

// A simple, unmoderated chat room implemented as an H.H.S. object.


// This chat run will automatically synchronize its local state with
// any remote instances when the method "startSync" is called.

// The ChatRoom itself inherits from HashedObject, therefore it can
// be persisted to an HHS Store, but it is immutable.

// The topic and the sets of messages and chat participants are mutable.

// HHS' native Identity class is used to represent participants, and a simple
// Message object is defined in Message.ts.

// Sync uses some implicit parameters configured via the setResources method,
// inherited from HashedObject: a local store and an intance of HHS' mesh,
// used for discovering and communicating with peers.

class ChatRoom extends HashedObject implements SpaceEntryPoint {

    static className = 'hhs/v0/exampes/ChatRoom';

    topic?: MutableReference<HashedLiteral>
    participants?: MutableSet<Identity>;
    messages?: MutableSet<Message>;

    _node?: PeerNode;

    constructor(topic?: string) {
        super();
        if (topic !== undefined) {

            // When we create a chat room, we always want a new one.
            // We accomplish this by giving the newly created room a random id.
            this.setRandomId();

            // By using addDerivedField, all the mutable members of
            // the class are derived deterministically from its id.
            this.addDerivedField('topic', new MutableReference());
            this.addDerivedField('participants', new MutableSet());
            this.addDerivedField('messages', new MutableSet());
            // This is not necessary in this case, but it is nice and helps to
            // catch errors.

            // We set the received topic.
            this.topic?.setValue(new HashedLiteral(topic));
        }
    }

    init(): void {
        
    }

    // Upon receiving a chat room, we check that it follows the structure defined 
    // above before accepting it into our store. That is done by implementing a 
    // validate() method.

    validate(_references: Map<string, HashedObject>): boolean {
        return  this.getId() !== undefined &&
                this.checkDerivedField('topic') &&
                this.checkDerivedField('participants') &&
                this.checkDerivedField('messages');
    }

    async join(id: Identity): Promise<void> {
        await this.participants?.add(id);
        await this.participants?.saveQueuedOps();
        //this.getStore().save(this.participants as HashedObject);
        //this.participants?.saveQueuedOps();
    }

    async leave(id: Identity): Promise<void> {
        await this.participants?.delete(id);
        await this.participants?.saveQueuedOps();
    }

    async say(author: Identity, text: string): Promise<void>{
        let message = new Message(author, text);
        await this.messages?.add(message);
        await this.messages?.saveQueuedOps();
    }

    getParticipants() : MutableSet<Identity> {
        if (this.participants === undefined) {
            throw new Error('The chat room has not been initialized, participants are unavailable.');
        }

        return this.participants;
    }

    getMessages() : MutableSet<Message> {
        if (this.messages === undefined) {
            throw new Error('The chat room has not been initialized, messages are unavailable.');
        }

        return this.messages;
    }

    // The following method will do two things:

    // - it will broadcast this chat room over the network, helping other peers that
    //   know its 3-word code discover it.
    // - it will start exchanging operations and syncrhonizing the state in the local
    //   store with the group of peers that is also synchronizing the chat room.

    // Any other client that opens this chat room on the local store will see its
    // state updated as new data is fetched, and conversely any changes that are
    // persisted on the local state will be sent over to peers automatically.

    async startSync(): Promise<void> {

        let resources = this.getResources();

        if (resources === undefined) {
            throw new Error('Cannot start sync: resources not configured.');
        }

        this._node = new PeerNode(resources);
        
        this._node.broadcast(this);
        this._node.sync(this);
    }
    
    // Stop the broadcast / sync processes described above.

    async stopSync(): Promise<void> {

        this._node?.stopBroadcast(this);
        this._node?.stopSync(this);
    }

    // The class name used to register this object with the HHS library.

    getClassName(): string {
        return ChatRoom.className;
    }

}


// Registering the ChatRoom class with HHS is necessary so the library will know it has
// to use this class when a chat room object is received:
HashedObject.registerClass(ChatRoom.className, ChatRoom);

export { ChatRoom };