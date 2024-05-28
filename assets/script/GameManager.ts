import { _decorator, Component, Node } from 'cc';
import { GlobalManager } from './GlobalManager';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Node)
    public TitleScreen = null;

    @property(Node)
    public PuzzleGame = null;

    @property(Node)
    public Levels = null;
    
    start() {
        this.TitleScreen.active = true;
    }

    /**
     * Enter level selection
     */
    enterLevels() {
        SoundManager.instance.playSong('default', 1);
        this.TitleScreen.active = false;
        this.Levels.active = true;
        this.PuzzleGame.active = false;
    }

    /**
     * Enter Game
     */
    enterGame() {
        this.TitleScreen.active = false;
        this.Levels.active = false;
        this.PuzzleGame.active = true;
    }

    /**
     * Check if current level is unlocked
     * @param levelID - levelID.
     * @returns 
     */
    checkIfLevelIsUnlocked(levelID) {
        let isUnlocked = false;

        if(levelID === 0) {
            isUnlocked = true;
        } else {
            const levelInStorage = localStorage.getItem(`LEVEL_KEY${levelID}`);
            if(Number(levelInStorage) === 1) {
                isUnlocked = true;
            }
        }
        return isUnlocked;
    }

    /**
     * Save levelID in localStorage everytime player pass level.
     * @param levelID - levelID
     */
    saveProgress(levelID) {
        localStorage.setItem(`LEVEL_KEY${levelID}`, '1');
    }
}

