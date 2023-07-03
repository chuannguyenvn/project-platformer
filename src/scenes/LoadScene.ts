import { Scene } from 'phaser'
import { Constants } from '../index'


class LoadScene extends Scene
{
    constructor() {
        super({ key: Constants.Key.Scene.LOAD })
    }

    preload(): void {

    }
}

export default LoadScene