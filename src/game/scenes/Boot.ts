import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        // Create a temporary background
        const bgGraphics = this.make.graphics({ x: 0, y: 0 });
        bgGraphics.fillStyle(0x87CEEB);
        bgGraphics.fillRect(0, 0, 1, 1);
        bgGraphics.generateTexture('background', 1, 1);
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
