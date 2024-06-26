import { log, warn } from "cc";

class EventData {
    public event!: string;
    public listener!: (event: string, args: any) => void;
    public obj: any;
}

export class MessageEventData {
    private events: any = {};

    on(event: string, listener: (event: string, args: any) => void, thisObj: object) {
        let list: Array<EventData> = this.events[event];
        if (list == null) {
            list = [];
            this.events[event] = list;
        }
        let data: EventData = new EventData();
        data.event = event;
        data.listener = listener;
        data.obj = thisObj;
        list.push(data);

        Message.on(event, listener, thisObj);
    }

    /**
     * Delete message event to prevent memory leak
     * @param event 
     * @returns 
     */
    off(event: string) {
        let ebs: Array<EventData> = this.events[event];
        if (!ebs) {
            return;
        }
        for (let eb of ebs) {
            Message.off(event, eb.listener, eb.obj);
        }
        delete this.events[event];
    }

    /**
     * Message emit
     * @param event 
     * @param arg 
     */
    dispatchEvent(event: string, arg: any = null) {
        Message.dispatchEvent(event, arg);
    }

    removes() {
        for (let event in this.events) {
            this.off(event);
        }
    }
}

class MessageManager {
    public static readonly Instance: MessageManager = new MessageManager();

    private events: any = {};

    /**
     * Register for global events
     * @param event(string)      event name
     * @param listener(function) listener function that handles events
     * @param thisObj(object)    Listens for the function-bound this object
     */
    on(event: string, listener: (event: string, args: any) => void, thisObj: object) {
        if (!event || !listener) {
            warn(`Register【${event}】event lister function is null`);
            return;
        }

        let list: Array<EventData> = this.events[event];
        if (list == null) {
            list = [];
            this.events[event] = list;
        }

        let length = list.length;
        for (let i = 0; i < length; i++) {
            let bin = list[i];
            if (bin.listener == listener && bin.obj == thisObj) {
                warn(`name:【${event}】event the registry listener is registered repeatedly`);
            }
        }


        let data: EventData = new EventData();
        data.event = event;
        data.listener = listener;
        data.obj = thisObj;
        list.push(data);
    }

    /**
     * 
     * Listen for an event once, and after the event is responded to, the listener is automatically removed
     * @param event 
     * @param listener 
     * @param thisObj 
     */
    once(event: string, listener: (event: string, args: any) => void, thisObj: object) {
        let _listener: any = ($event: string, $args: any) => {
            this.off(event, _listener, thisObj);
            _listener = null;
            listener.call(thisObj, $event, $args);
        }
        this.on(event, _listener, thisObj);
    }

    /**
     * Removes global events
     * @param event(string)      event name
     * @param listener(function) listener function that handles events
     * @param thisObj(object)    Listens for the function-bound this object
     */
    off(event: string, listener: Function, thisObj: object) {
        let list: Array<EventData> = this.events[event];

        if (!list) {
            log(`name:【${event}】Event does not exist`);
            return;
        }


        let length = list.length;
        for (let i = 0; i < length; i++) {
            let bin: EventData = list[i];
            if (bin.listener == listener && bin.obj == thisObj) {
                list.splice(i, 1);
                break;
            }
        }

        if (list.length == 0) {
            delete this.events[event];
        }
    }

    /** 
     * Trigger a global event 
     * @param event(string)      event name
     * @param arg(any)           Event parameters
     */
    dispatchEvent(event: string, arg: any = null) {
        let list: Array<EventData> = this.events[event];

        if (list != null) {
            let temp: Array<EventData> = list.concat();
            let length = temp.length;
            for (let i = 0; i < length; i++) {
                let eventBin = temp[i];
                eventBin.listener.call(eventBin.obj, event, arg);
            }
        }
    }
}

export const Message = MessageManager.Instance;