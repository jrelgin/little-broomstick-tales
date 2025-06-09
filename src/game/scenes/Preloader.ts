import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        console.log('Preloader scene initialized');
        
        // Use the game's base resolution for positioning
        const gameWidth = 1024;
        const gameHeight = 768;
        const centerX = gameWidth / 2;
        const centerY = gameHeight / 2;
        
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(centerX, centerY, 'background');

        //  A simple progress bar. This is the outline of the bar.
        const barWidth = 400;
        const barHeight = 24;
        this.add.rectangle(centerX, centerY, barWidth, barHeight).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(centerX - barWidth/2, centerY, 4, barHeight - 4, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {
            console.log('Loading progress:', progress);
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + ((barWidth - 8) * progress);
        });
    }

    preload ()
    {
        console.log('Preloader scene preload started');
        
        //  Load the assets for the game
        this.load.setPath('assets');

        // Load Calico Kitty walk spritesheet only
        this.load.spritesheet('calico_walk', 'characters/calicoKitty_walk.png', {
            frameWidth: 64,
            frameHeight: 64
        });
        // Load Calico Kitty curious idle spritesheet
        this.load.spritesheet('curious_idle', 'characters/calicoKitty_curiousIdleBreaker.png', {
            frameWidth: 64,
            frameHeight: 64
        });
        // Load Calico Kitty sleepy idle spritesheet
        this.load.spritesheet('sleepy_idle', 'characters/calicoKitty_sleepyIdleBreaker.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        // Load tilemap and tileset
        this.load.tilemapTiledJSON('forest-map', 'maps/forest-map..tmj');
        this.load.image('forest-tileset', 'tilesets/grasstileset-premium.png');

        // Load other game assets
        this.load.image('platform', 'platform.png');
        this.load.image('background', 'background.png');
    }

    create ()
    {
        console.log('Preloader scene create started');
        
        // Create temporary assets if they don't exist
        this.createTemporaryAssets();

        // Create animations for Calico Kitty
        this.createAnimations();

        //  Move to the MainMenu
        console.log('Starting MainMenu scene');
        this.scene.start('MainMenu');
    }

    private createTemporaryAssets() {
        console.log('Creating temporary assets');
        
        // Create a temporary platform sprite (128x32 soft red rectangle)
        const platformGraphics = this.make.graphics({ x: 0, y: 0 });
        platformGraphics.fillStyle(0xFF6F61); // Soft red
        platformGraphics.fillRect(0, 0, 128, 32);
        platformGraphics.generateTexture('platform', 128, 32);

        // Create a temporary background (1x1 blue pixel)
        const bgGraphics = this.make.graphics({ x: 0, y: 0 });
        bgGraphics.fillStyle(0x87CEEB);
        bgGraphics.fillRect(0, 0, 1, 1);
        bgGraphics.generateTexture('background', 1, 1);
        
        console.log('Temporary assets created');
    }

    private createAnimations() {
        // Create walk-down animation
        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('calico_walk', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        
        // Create walk-up animation
        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('calico_walk', { start: 4, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
        
        // Create walk-left animation
        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('calico_walk', { start: 8, end: 11 }),
            frameRate: 8,
            repeat: -1
        });
        
        // Create walk-right animation
        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('calico_walk', { start: 12, end: 15 }),
            frameRate: 8,
            repeat: -1
        });

        // Create curious idle animation
        this.anims.create({
            key: 'curious-idle',
            frames: this.anims.generateFrameNumbers('curious_idle', { start: 0, end: 9 }),
            frameRate: 8,
            repeat: -1
        });

        // Create sleepy idle animation
        this.anims.create({
            key: 'sleepy-idle',
            frames: this.anims.generateFrameNumbers('sleepy_idle', { start: 0, end: 12 }),
            frameRate: 8,
            repeat: -1
        });
    }
}
