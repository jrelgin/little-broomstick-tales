export function isMobileDevice(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Check for actual mobile/tablet user agents
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    
    // Only consider it mobile if it's actually a mobile UA AND has touch AND is small screen
    // This prevents laptops with touchscreens from being detected as mobile
    if (isMobileUA) {
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth <= 768 && window.innerHeight <= 1024;
        return hasTouch && isSmallScreen;
    }
    
    return false;
}

export function hasHardwareInput(): boolean {
    // Check if we have keyboard (always available in browsers)
    const hasKeyboard = true;
    
    // Check for active gamepads more reliably
    let hasGamepad = false;
    if (navigator.getGamepads) {
        const gamepads = navigator.getGamepads();
        hasGamepad = Array.from(gamepads).some(pad => pad !== null && pad.connected);
    }
    
    return hasKeyboard || hasGamepad;
}

// Alternative function that's more conservative - only detects gamepads that are actually being used
export function hasActiveGamepad(): boolean {
    if (!navigator.getGamepads) return false;
    
    const gamepads = navigator.getGamepads();
    return Array.from(gamepads).some(pad => {
        if (!pad || !pad.connected) return false;
        
        // Check if any buttons are pressed or axes are moved
        const hasButtonInput = pad.buttons.some(button => button.pressed);
        const hasAxisInput = pad.axes.some(axis => Math.abs(axis) > 0.1);
        
        return hasButtonInput || hasAxisInput;
    });
}
