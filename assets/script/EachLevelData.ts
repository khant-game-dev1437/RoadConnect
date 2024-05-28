import { _decorator, Button, Component, } from 'cc';
import { Message } from './MessageManager';
import { SoundManager } from './SoundManager';
const { ccclass, } = _decorator;

@ccclass('EachLevelData')
export class EachLevelData extends Component {

    public GameData = null;
    public unlocked = false;

    /**
     * Game Enter event
     */
    enterGame() {
        SoundManager.instance.playSong('default', 1);
        Message.dispatchEvent('EnterGame', this.GameData)
    }

    levelUnlockedOrNot() {
        if(!this.unlocked) {
            this.node.getComponent(Button).interactable = false;
        } else {
            this.node.getComponent(Button).interactable = true;
        }
    }
}

