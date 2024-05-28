import { _decorator, Button, Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, tween, UITransform, v3, Vec2, Vec3, Vec4 } from 'cc';
import { Message } from './MessageManager';
import { PuzzlePiece } from './PuzzlePiece';
import { LevelManager } from './LevelManager';
import { GlobalManager } from './GlobalManager';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('PuzzleManager')
export class PuzzleManager extends Component {
    
    // Puzzle pieces position limit
    public PUZZLE_SIZE_X = 0;
    public PUZZLE_SIZE_Y = 0;

    // Starting position of puzzle pieces
    private startPos = new Vec2(-60 , 60);

    // Puzzle Pieces Game Objects
    public AllPieces = [];
    // Puzzle level Data
    public AllLevelData = [];

    @property(Prefab)
    piecePefab = null;

    // Total sprites
    @property(SpriteFrame)
    public AllSprites = [];

    @property(Node)
    public LevelManager = null;

    @property(Label)
    public LblLvl = null;

    onLoad() {
        // localStorage.setItem(`LEVEL_KEY${0}`, '0');
        // localStorage.setItem(`LEVEL_KEY${1}`, '0');
        // localStorage.setItem(`LEVEL_KEY${2}`, '0');
        // localStorage.setItem(`LEVEL_KEY${3}`, '0');

        Message.on('GameInitate', this.populateLevel, this);
        Message.on('PieceMove', this.pieceMove, this);
        this.AllLevelData = this.LevelManager.getComponent(LevelManager).gameLevelsData;
    }

    protected onDestroy(): void {
        Message.off('GameInitate', this.populateLevel, this);
        Message.off('PieceMove', this.pieceMove, this);
    }

    /**
     * Clear level data and game objects after finish current level
     */
    clearLevel() {
        this.AllPieces.forEach(e => {
            e.destroy();
        })
        this.AllPieces = [];
    }

    /**
     * Bind Game Data
     * @param event 
     * @param data 
     */
    public populateLevel(event, data) {
        this.clearLevel();  
        
        GlobalManager.levelManager.currentLevel = data.LevelID;

        this.LblLvl.string = 'Level: ' + (GlobalManager.levelManager.currentLevel + 1);
        
        const gameData = data;
        this.PUZZLE_SIZE_X = gameData.xCount;
        this.PUZZLE_SIZE_Y = gameData.yCount;

        let hCount = 0;
        let vCount = 0;

        console.log('gameData: ', gameData);

        for(let i = 0; i < gameData.AllPieces.length; i ++) {
            let obj = null;
            if (gameData.AllPieces[i].PieceID != -1) {
                 obj = instantiate(this.piecePefab);   
                obj.setPosition(this.startPos.x + hCount, this.startPos.y - vCount, 0);
                obj.name = "Piece " + hCount + vCount;
                console.log('gameData.AllPieces[i].startingRotation', gameData.AllPieces[i].startRotation);
                obj.getComponent(PuzzlePiece).init(gameData.AllPieces[i].startRotation,gameData.AllPieces[i].targetRotation, this.AllSprites[gameData.AllPieces[i].PieceID]);
                
                this.node.addChild(obj);
                this.AllPieces.push(obj)
                
            }
                if(obj != null) {
                    hCount = hCount + obj.getComponent(UITransform).width;
                    if (hCount >= this.PUZZLE_SIZE_X * 60) {
                        hCount = 0;
                        vCount = vCount + obj.getComponent(UITransform).width;
                    }
                }
        }
    }

    pieceMove() {
        console.log('PieceMoved ');
        this.checkForLevelComplete();
    }

    public checkForLevelComplete() {
        // for(let i = 0; i < this.AllPieces.length; i++) {
        //    console.log('targetandleeeepl ', Math.abs(this.AllPieces[i].eulerAngles.z % 360), this.AllPieces[i].getComponent(PuzzlePiece).targetRotation);   
        // }
        
        for(let i = 0; i < this.AllPieces.length; i++) {
            if(!this.AllPieces[i].getComponent(PuzzlePiece).isOnTargetPosition()) {
                return;
            }
        }
        this.levelComplete();
    }

    levelComplete() {
        for (let i = 0; i < this.AllPieces.length; i++) {
            this.deletePieces(this.AllPieces[i]);
        }
        this.AllPieces = [];
        SoundManager.instance.playSong('levelComplete', 1);
        setTimeout(() => {
            const checkLevels = this.AllLevelData.length - 1;
            let currentLevel = GlobalManager.levelManager.currentLevel;

            if(checkLevels == currentLevel) { // Reach to final level
                console.log('Game Over', GlobalManager.levelManager.currentLevel);
                
                GlobalManager.game.saveProgress(GlobalManager.levelManager.currentLevel);
                return;
            } else { 
                console.log('GlobalManager.levelManager.currentLevel', GlobalManager.levelManager);
                GlobalManager.levelManager.currentLevel++;
                GlobalManager.game.saveProgress(GlobalManager.levelManager.currentLevel);
                Message.dispatchEvent('GameInitate', this.AllLevelData[GlobalManager.levelManager.currentLevel]);
            }    
            
        }, 1000);
    }

    deletePieces(currentNode) {
        currentNode.getComponent(Button).interactable = false;
        tween(currentNode)
        .to(1, { scale: v3(0, 0, 0) }, {
            easing: 'quadInOut', onComplete: () => {
                currentNode.destroy();
            }
        })
        .start();
    }
}

