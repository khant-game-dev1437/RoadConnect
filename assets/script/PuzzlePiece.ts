import { _decorator, Component, Node, Sprite, SpriteFrame, tween, v3, Vec3 } from 'cc';
import { Message } from './MessageManager';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('PuzzlePiece')
export class PuzzlePiece extends Component {

    private m_Audio = null;
    private m_rotating = false;
    private m_locked;
    private m_isMirrored;
    private isBonus;

    public startingRotation;
    public targetRotation;
    
    public currentRotation = 0;


    protected onLoad(): void {
           
    }

    protected onEnable(): void {

        this.node.scale = v3(0, 0, 0);
        const delay = Math.random() * (0.75 - 0.25) + 0.25;

        tween(this.node)
            .delay(delay)
            .call(() => {
                SoundManager.instance.playSong('shapeAppear', 1);
            })
            .to(0.25, { scale: v3(1, 1, 1) }, { easing: 'quadInOut' })
            .start();
    }

    public init(startingRotation, targetRotation, spriteFrame: SpriteFrame) {
        this.node.getComponent(Sprite).spriteFrame = spriteFrame;
        this.startingRotation = startingRotation;
       
        this.targetRotation = targetRotation;
        this.node.eulerAngles = new Vec3(0, 0, this.startingRotation);
       
        if (spriteFrame.name.includes("MR180"))
            {
                console.log("phin khan " , spriteFrame.name);
                this.m_isMirrored = true;
            }
            else if
             (spriteFrame.name.includes("BN360"))
            {
                this.isBonus = true;
            }
    }

    public isOnTargetPosition() {
        if (this.isBonus) {
            return true;
        }
       
        let currentRotation = this.node.eulerAngles.z % 360;
        currentRotation = Math.abs(currentRotation);

        if (this.m_isMirrored) {
            if (!this.approximately(currentRotation, this.targetRotation)) {
                let newTarget = 0;
                switch (this.targetRotation) {
                    case 0:
                        newTarget = 180;
                        break;
                    case 90:
                        newTarget = 270;
                        break;
                    case 180:
                        newTarget = 0;
                        break;
                    case 270:
                        newTarget = 90;
                        break;
                }

                return this.approximately(currentRotation, newTarget);
            }
        }
     return this.approximately(currentRotation, this.targetRotation);
    }

    private approximately(a: number, b: number, tolerance: number = 0.1): boolean {
        return Math.abs(a - b) < tolerance;
    }

    public Rotate() {
        let rotateSpeed = 0.1;

        if (this.m_rotating)
            return;

        this.m_rotating = true;
        SoundManager.instance.playSong('shapeRotate', 1);
        tween(this.node)
            .by(rotateSpeed, { eulerAngles: v3(0, 0, -90) }) 
            .call(() => {
                this.m_rotating = false;
                
                Message.dispatchEvent('PieceMove');
            })
            .start();
    }
}

