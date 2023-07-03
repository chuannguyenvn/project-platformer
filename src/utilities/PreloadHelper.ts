import Phaser, { Scene } from 'phaser'
import { Constants } from '../index'

class PreloadHelper
{
    public static preloadSprite(scene: Scene, key: Constants.Key.Sprite): void {
        scene.load.image(key, Constants.FileLookUp[key])
    }

    public static preloadSound(scene: Scene, key: Constants.Key.Audio): void {
        scene.load.audio(key, Constants.FileLookUp[key])
    }
}

export default PreloadHelper

