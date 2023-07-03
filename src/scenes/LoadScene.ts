import { Scene } from 'phaser'
import Assets from '../constants/Keys'


class LoadScene extends Scene
{
    constructor() {
        super({ key: Assets.Key.Scene.LOAD })
    }

    preload(): void {

    }
}

export default LoadScene