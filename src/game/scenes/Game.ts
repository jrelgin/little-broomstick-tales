import { Scene } from 'phaser';

export class Game extends Scene
{
    private player!: Phaser.Physics.Arcade.Sprite;
    private decorLayer!: Phaser.Tilemaps.TilemapLayer;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private moveSpeed: number = 200; // Flying speed
    private camera!: Phaser.Cameras.Scene2D.Camera;
    private idleTimer: number = 0;
    private readonly SLEEPY_THRESHOLD: number = 15000; // 15 seconds in ms

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        console.log('Game scene created');
        
        // Create sky background
        const camera = this.cameras.main;
        if (!camera) {
            console.error('Camera not found');
            return;
        }
        this.camera = camera;

        // Create tilemap first
        const map = this.make.tilemap({ key: 'forest-map' });
        
        // Set world bounds to match the scaled map size for full exploration
        const mapScale = 6;
        const worldWidth = map.widthInPixels * mapScale;   // 6048px
        const worldHeight = map.heightInPixels * mapScale;  // 3744px
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        
        // Draw brown background for the entire world
        this.add.rectangle(0, 0, worldWidth, worldHeight, 0x8B4513)
            .setOrigin(0, 0);
        const tileset = map.addTilesetImage('Forest16', 'forest-tileset');
        
        // Scale the tilemap to 6x for much bigger trees and more detailed environment
        const border = 32;
        
        // Position the map to fill the entire world (no borders needed)
        const scaledMapWidth = map.widthInPixels * mapScale;   // 1008 * 6 = 6048px
        const scaledMapHeight = map.heightInPixels * mapScale; // 624 * 6 = 3744px
        
        // Create layers positioned at world origin for full exploration
        const undergroundLayer = map.createLayer('underground', tileset!, 0, 0);
        const groundLayer = map.createLayer('ground', tileset!, 0, 0);
        this.decorLayer = map.createLayer('decor', tileset!, 0, 0)!;
        
        // Scale all layers to 6x original size
        undergroundLayer?.setScale(mapScale, mapScale);
        groundLayer?.setScale(mapScale, mapScale);
        this.decorLayer?.setScale(mapScale, mapScale);
        
        // Set up collision on decor layer (trees and obstacles)
        // Set collision for all the tree and decorative tile IDs from your tilemap
        const treeTileIds = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,           // Tree tops and foliage
            29, 30, 31, 32, 33, 34, 35, 36, 37,  // Tree trunks and branches  
            57, 58, 59, 60, 61, 62, 63, 64, 65,  // More tree parts
            85, 86, 87, 88, 89, 90, 91, 92, 93   // Decorative elements
        ];
        this.decorLayer?.setCollision(treeTileIds);
        
        console.log('Tilemap scaled:', `${map.widthInPixels}x${map.heightInPixels}`, '→', `${scaledMapWidth}x${scaledMapHeight}`, `(scale: ${mapScale}x)`);

        // Create player (flying witch) - start in center of expanded world
        this.player = this.physics.add.sprite(worldWidth * 0.5, worldHeight * 0.5, 'curious_idle')
            .setScale(1.5);
        this.player.setBounce(0.1);  // Softer bounce for gentler collisions
        this.player.setCollideWorldBounds(true); // Now uses the expanded world bounds
        
        // Make collision body much smaller to account for 6x scaled tilemap
        // With 96x96 pixel tiles, we need a much smaller collision box for precision
        this.player.body?.setSize(16, 16);  // Very small collision box for 6x scaled tiles
        this.player.body?.setOffset(24, 24); // Center the collision box (48-16)/2 = 24
        
        console.log('Flying witch created at:', this.player.x, this.player.y, 'Scale:', this.player.scaleX, 'Collision size:', this.player.body?.width, 'x', this.player.body?.height);

        // Set up collisions with trees and decorative elements
        this.physics.add.collider(this.player, this.decorLayer, () => {
            console.log('Witch collided with tree/obstacle at:', this.player.x, this.player.y);
        });

        // Set up camera to follow player across the entire expanded world
        camera.setBounds(0, 0, worldWidth, worldHeight);
        camera.startFollow(this.player);
        camera.setBackgroundColor('#8B4513');

        // Set up keyboard controls
        this.cursors = this.input.keyboard!.createCursorKeys();
        
        // Start with idle animation
        this.player.play('curious-idle', true);
        this.idleTimer = 0;
        
        console.log('Flying witch game setup complete');
    }

    update(time: number, delta: number) {
        if (!this.player.body) {
            console.error('Player body not found');
            return;
        }

        // Handle four-directional flying movement
        const left = this.cursors.left.isDown;
        const right = this.cursors.right.isDown;
        const up = this.cursors.up.isDown;
        const down = this.cursors.down.isDown;

        // Reset velocity
        this.player.setVelocity(0);

        // Handle movement and play correct animation
        let isMoving = false;
        if (left) {
            this.player.setVelocityX(-this.moveSpeed);
            this.player.play('walk-left', true);
            isMoving = true;
        } else if (right) {
            this.player.setVelocityX(this.moveSpeed);
            this.player.play('walk-right', true);
            isMoving = true;
        } else if (up) {
            this.player.setVelocityY(-this.moveSpeed);
            this.player.play('walk-up', true);
            isMoving = true;
        } else if (down) {
            this.player.setVelocityY(this.moveSpeed);
            this.player.play('walk-down', true);
            isMoving = true;
        }
        if (isMoving) {
            this.idleTimer = 0;
        } else {
            this.idleTimer += delta;
            if (this.idleTimer >= this.SLEEPY_THRESHOLD) {
                this.player.play('sleepy-idle', true);
            } else {
                this.player.play('curious-idle', true);
            }
        }
    }
}
