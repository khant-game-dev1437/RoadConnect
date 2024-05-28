import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {

    public static instance: SoundManager = null;

    @property(AudioClip)
    public m_defaultClick = null;

    @property(AudioClip)
    public m_ShapeRotate = null;

    @property(AudioClip)
    public m_ShapeAppear = null;

    @property(AudioClip)
    public m_LevelComplete = null;

    protected onLoad(): void {
        SoundManager.instance = this;
    }

    playSong(soundName, volume) {
        // Play one shot to prevent audio conflicts.
        switch(soundName) {
            case SFX.default:
                this.m_defaultClick.playOneShot(volume);
            break;
            case SFX.shapeRotate:
                this.m_ShapeRotate.playOneShot(volume);
            break;
            case SFX.shapeAppear:
                this.m_ShapeAppear.playOneShot(volume);
            break;
            case SFX.levelComplete:
                this.m_LevelComplete.playOneShot(volume);
            break;
        }
    }
}

enum SFX {
    default = 'default',
    shapeRotate = 'shapeRotate',
    shapeAppear = 'shapeAppear',
    levelComplete = 'levelComplete',
}

