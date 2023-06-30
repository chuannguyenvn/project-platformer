import {Scene} from "phaser"
import SpriteKey from "../constants/SpriteKey"
import FileLookUp from "../constants/FileLookUp"
import AudioKey from "../constants/AudioKey"

class PreloadHelper
{
    public static preloadSprite(scene: Scene, key: SpriteKey): void {
        scene.load.image(key, FileLookUp[key])
    }

    public static preloadSound(scene: Scene, key: AudioKey): void {
        scene.load.audio(key, FileLookUp[key])
    }
}

export default PreloadHelper

