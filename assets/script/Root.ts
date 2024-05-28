
import { Component, _decorator, setDisplayStats } from "cc";
import { GlobalManager } from "./GlobalManager";
import { GameManager } from "./GameManager";
import { LevelManager } from "./LevelManager";
import { PuzzleManager } from "./PuzzleManager";
import { SoundManager } from "./SoundManager";

const { ccclass, property } = _decorator;

@ccclass('Root')
export class Root extends Component {

    onLoad() {
        this.init();
    }

    protected init() {

        setDisplayStats(false);

        GlobalManager.game = new GameManager();
        GlobalManager.levelManager = new LevelManager();
        GlobalManager.puzzleManager = new PuzzleManager();
        GlobalManager.soundManager = new SoundManager();
    }
    
    change_console_log_function(){
        console.log = function log(...data: any[]){

        } 
    }
}
