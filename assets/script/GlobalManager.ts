import { GameManager } from "./GameManager";
import { LevelManager } from "./LevelManager";
import { PuzzleManager } from "./PuzzleManager";
import { SoundManager } from "./SoundManager";

export class GlobalManager {
    
    /** Game World Management */
    public static game: GameManager;
    public static puzzleManager: PuzzleManager;
    public static levelManager: LevelManager;
    public static soundManager: SoundManager;
}
