import { HashedObject } from '@hyper-hyper-space/core';
import { Identity } from '@hyper-hyper-space/core';

// A message to be used within a chat room.

// The author field, inherited from HashedObject, is used to tie
// the message to an HHS' Identity object.

class Message extends HashedObject {

    static className = 'hhs/v0/examples/Message';

    constructor(author?: Identity, text?: string) {
        super();
    
        if (author !== undefined) {
            this.setAuthor(author);
            this.text = text;
            this.timestamp = Date.now();
        }
    }

    text?: string;
    timestamp?: number;

    getClassName(): string {
        return Message.className;
    }

    init(): void {
        
    }

    validate(_references: Map<string, HashedObject>): boolean {
        return this.text !== undefined && this.getAuthor() !== undefined && this.timestamp !== undefined;
    }

}

HashedObject.registerClass(Message.className, Message);

export { Message }