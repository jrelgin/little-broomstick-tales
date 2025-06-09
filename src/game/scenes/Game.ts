import { Scene } from 'phaser';

export class Game extends Scene
{
    private player!: Phaser.Physics.Arcade.Sprite;
    private decorLayer!: Phaser.Tilemaps.TilemapLayer;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private moveSpeed: number = 200; // Flying speed
    private idleTimer: number = 0;
    private readonly SLEEPY_THRESHOLD: number = 15000; // 15 seconds in ms
    
    // Touch control properties
    private touchControls!: Phaser.GameObjects.Container;
    private touchZone!: Phaser.GameObjects.Zone;
    private readonly DEAD_ZONE_SIZE: number = 40; // Dead zone in the center
    private isTouching: boolean = false;
    private touchDirection: { x: number, y: number } = { x: 0, y: 0 };

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        console.log('Game scene created');
        
        // Hide cursor when over game canvas
        this.input.setDefaultCursor('none');
        
        // Create sky background
        const camera = this.cameras.main;
        if (!camera) {
            console.error('Camera not found');
            return;
        }

        // Create tilemap with appropriate scaling for 1024x768 resolution
        const map = this.make.tilemap({ key: 'forest-map' });
        
        // Set world bounds to be larger than screen for exploration but more reasonable
        const mapScale = 3; // Reduced from 6x to 3x for better performance and sizing
        const worldWidth = map.widthInPixels * mapScale;   // Approximately 3024px
        const worldHeight = map.heightInPixels * mapScale;  // Approximately 1872px
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        
        // Draw brown background for the entire world
        this.add.rectangle(0, 0, worldWidth, worldHeight, 0x8B4513)
            .setOrigin(0, 0);
        const tileset = map.addTilesetImage('Forest16', 'forest-tileset');
        
        // Create layers positioned at world origin
        const undergroundLayer = map.createLayer('underground', tileset!, 0, 0);
        const groundLayer = map.createLayer('ground', tileset!, 0, 0);
        this.decorLayer = map.createLayer('decor', tileset!, 0, 0)!;
        
        // Scale all layers to 3x original size
        undergroundLayer?.setScale(mapScale, mapScale);
        groundLayer?.setScale(mapScale, mapScale);
        this.decorLayer?.setScale(mapScale, mapScale);
        
        // Set up collision on decor layer (trees and obstacles)
        const treeTileIds = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,           // Tree tops and foliage
            29, 30, 31, 32, 33, 34, 35, 36, 37,  // Tree trunks and branches  
            57, 58, 59, 60, 61, 62, 63, 64, 65,  // More tree parts
            85, 86, 87, 88, 89, 90, 91, 92, 93   // Decorative elements
        ];
        this.decorLayer?.setCollision(treeTileIds);
        
        console.log('Tilemap scaled:', `${map.widthInPixels}x${map.heightInPixels}`, '→', `${worldWidth}x${worldHeight}`, `(scale: ${mapScale}x)`);

        // Create player (flying witch) - start in center of world
        this.player = this.physics.add.sprite(worldWidth * 0.5, worldHeight * 0.5, 'curious_idle')
            .setScale(1.5);
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        
        // Adjust collision body for 3x scaled tilemap
        this.player.body?.setSize(16, 16);
        this.player.body?.setOffset(24, 24);
        
        console.log('Flying witch created at:', this.player.x, this.player.y, 'Scale:', this.player.scaleX);

        // Set up collisions with trees and decorative elements
        this.physics.add.collider(this.player, this.decorLayer, () => {
            console.log('Witch collided with tree/obstacle at:', this.player.x, this.player.y);
        });

        // Set up camera to follow player across the world
        camera.setBounds(0, 0, worldWidth, worldHeight);
        camera.startFollow(this.player);
        camera.setBackgroundColor('#8B4513');

        // Set up keyboard controls
        this.cursors = this.input.keyboard!.createCursorKeys();
        
        // Create touch controls only on mobile devices
        if (this.isMobileDevice()) {
            console.log('Mobile device detected, creating functional touch controls');
            this.createTouchControls();
        } else {
            console.log('Desktop device detected, no touch controls needed');
        }
        
        // Start with idle animation
        this.player.play('curious-idle', true);
        this.idleTimer = 0;
        
        console.log('Flying witch game setup complete');
    }

    private createTouchControls() {
        // Create a container for touch controls
        this.touchControls = this.add.container(0, 0);
        
        // Position relative to base game resolution (1024x768)
        const touchZoneSize = 120; // Appropriate size for 1024x768
        const deadZoneSize = 30;
        const touchZoneX = touchZoneSize / 2 + 20; // From left edge
        const touchZoneY = 768 - touchZoneSize / 2 - 20; // From bottom edge (768 - offset)
        
        console.log('Creating touch controls in Game scene at:', touchZoneX, touchZoneY);
        
        // Create the touch zone
        this.touchZone = this.add.zone(touchZoneX, touchZoneY, touchZoneSize, touchZoneSize)
            .setInteractive()
            .setOrigin(0.5)
            .setScrollFactor(0); // Keep fixed on screen
            
        // Add visual indicators
        const touchZoneBg = this.add.circle(touchZoneX, touchZoneY, touchZoneSize / 2, 0x000000, 0.4)
            .setScrollFactor(0);
        const deadZoneBg = this.add.circle(touchZoneX, touchZoneY, deadZoneSize / 2, 0x000000, 0.7)
            .setScrollFactor(0);
        
        // Add to container
        this.touchControls.add([touchZoneBg, deadZoneBg, this.touchZone]);
        this.touchControls.setScrollFactor(0);
        
        // Set up touch events
        this.touchZone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            console.log('Touch started at:', pointer.x, pointer.y);
            this.isTouching = true;
            this.updateTouchDirection(pointer);
        });
        
        this.touchZone.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isTouching) {
                this.updateTouchDirection(pointer);
            }
        });
        
        this.touchZone.on('pointerup', () => {
            console.log('Touch ended');
            this.isTouching = false;
            this.touchDirection = { x: 0, y: 0 };
        });
        
        this.touchZone.on('pointerout', () => {
            console.log('Touch left zone');
            this.isTouching = false;
            this.touchDirection = { x: 0, y: 0 };
        });
    }
    
    private updateTouchDirection(pointer: Phaser.Input.Pointer) {
        const touchZoneX = this.touchZone.x;
        const touchZoneY = this.touchZone.y;
        
        // Calculate distance from center
        const dx = pointer.x - touchZoneX;
        const dy = pointer.y - touchZoneY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If within dead zone, no movement
        if (distance < this.DEAD_ZONE_SIZE / 2) {
            this.touchDirection = { x: 0, y: 0 };
            return;
        }
        
        // Normalize direction
        const normalizedX = dx / distance;
        const normalizedY = dy / distance;
        
        this.touchDirection = { x: normalizedX, y: normalizedY };
    }

    private isMobileDevice(): boolean {
        // Check for mobile devices using user agent and device characteristics
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        
        // Also check for touch and small screen size (typical mobile characteristics)
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth <= 768 || window.innerHeight <= 1024;
        
        // Consider it mobile if it matches mobile user agent OR (has touch AND small screen)
        const isMobile = isMobileUA || (hasTouch && isSmallScreen);
        
        console.log('Game scene device detection:', {
            userAgent: userAgent.substring(0, 50) + '...',
            isMobileUA,
            hasTouch,
            isSmallScreen,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            finalDecision: isMobile
        });
        
        return isMobile;
    }

    update(_time: number, delta: number) {
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
        
        // Handle touch controls (only if they exist on mobile devices)
        if (this.isTouching && this.touchDirection) {
            const { x, y } = this.touchDirection;
            if (Math.abs(x) > Math.abs(y)) {
                // Horizontal movement
                if (x < 0) {
                    this.player.setVelocityX(-this.moveSpeed);
                    this.player.play('walk-left', true);
                } else {
                    this.player.setVelocityX(this.moveSpeed);
                    this.player.play('walk-right', true);
                }
            } else {
                // Vertical movement
                if (y < 0) {
                    this.player.setVelocityY(-this.moveSpeed);
                    this.player.play('walk-up', true);
                } else {
                    this.player.setVelocityY(this.moveSpeed);
                    this.player.play('walk-down', true);
                }
            }
            isMoving = true;
        }
        // Handle keyboard controls
        else if (left) {
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
