import { _decorator, Component, error, instantiate, JsonAsset, Label, Node, Prefab, resources } from 'cc';
import { EachLevelData } from './EachLevelData';
import { Message } from './MessageManager';
import { GlobalManager } from './GlobalManager';
const { ccclass, property } = _decorator;

@ccclass('LevelManager')
export class LevelManager extends Component {

    // Game Node
    @property(Node)
    public GameNode = null;

    // Each level prefab
    @property(Prefab)
    public LevelPrefab = null;

    // Level UI
    @property(Node)
    public LevelGrid = null;

    // Level Selection Panel
    @property(Node)
    public Levels = null;

    // Total Level data
    public gameLevelsData = null;

    public currentLevel = 0;
    
    onEnable() {
        this.loadLevelData();
        Message.on('EnterGame', this.enableGameNode, this); // Listen message event
    }

    update(deltaTime: number) {
        
    }
    protected onDisable(): void {
        Message.off('EnterGame', this.enableGameNode, this);
    }

    enableGameNode(event, data) {
        this.GameNode.active = true;
        this.Levels.active = false;
        
        Message.dispatchEvent('GameInitate', data);
    }

    /**
     * Load Json Data which included total level Data.  Game Designer can change values manually.
     */
    loadLevelData() {
        resources.load('LevelData', JsonAsset, (err, jsonAsset) => {
            if (err) {
                error(err);
                return;
            }
           
            const jsonData = jsonAsset.json;
            this.gameLevelsData = jsonData.GameLevels;
            console.log('gameLevels' , this.gameLevelsData)
            this.setUpLevels();
        });
    }
    
    /**
     * Setting up all levels in level grid UI
     * @returns 
     */
    setUpLevels() {
        if(this.gameLevelsData == null) {
            return;
        }
        this.LevelGrid.destroyAllChildren();
        for(let i = 0; i < this.gameLevelsData.length; i ++) {
            const obj = instantiate(this.LevelPrefab);
            obj.getChildByName('Label').getComponent(Label).string = String(i+1);
            obj.getComponent(EachLevelData).GameData = this.gameLevelsData[i];
            const isUnlocked = GlobalManager.game.checkIfLevelIsUnlocked(this.gameLevelsData[i].LevelID);
            obj.getComponent(EachLevelData).unlocked = isUnlocked;
            obj.getComponent(EachLevelData).levelUnlockedOrNot();
        
            this.LevelGrid.addChild(obj);
        }
    }
}

