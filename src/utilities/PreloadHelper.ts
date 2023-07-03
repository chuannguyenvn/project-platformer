import Phaser, { Scene } from 'phaser'
import FileLookUp = Assets.FileLookUp
import Assets from '../constants/Assets'

class PreloadHelper
{
    public static preloadSprite(scene: Scene, key: Assets.Key.Sprite): void {
        scene.load.image(key, FileLookUp[key])
    }

    public static preloadSound(scene: Scene, key: Assets.Key.Audio): void {
        scene.load.audio(key, FileLookUp[key])
    }
}

export default PreloadHelper

