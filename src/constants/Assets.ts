namespace Assets
{
    export namespace Key
    {
        export enum Audio
        {
            DEFAULT = 'key.audio.default'
        }

        export enum Sprite
        {
            CIRCLE = 'key.sprite.circle',
            SQUARE = 'key.sprite.square',
            GRADIENT_TOP_TO_BOTTOM = 'key.sprite.gradient-top-to-bottom',
            KENNEY_DEFAULT_TILESET = 'key.sprite.kenney-default-tileset',
        }
    }

    export const FileLookUp = {
        [Assets.Key.Audio.DEFAULT]: '',
        [Assets.Key.Sprite.CIRCLE]: './assets/circle.png',
        [Assets.Key.Sprite.SQUARE]: './assets/square.png',
        [Assets.Key.Sprite.GRADIENT_TOP_TO_BOTTOM]: './assets/gradient-top-to-bottom.png',
        [Assets.Key.Sprite.KENNEY_DEFAULT_TILESET]: './assets/kenney-pixel-platformer.png',
    }
}

export default Assets