/**
 * Image protection utilities to prevent direct saving
 */

/**
 * Prevent context menu on images
 * @param {Event} e - Context menu event
 */
function preventContextMenu(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}

/**
 * Prevent drag start on images
 * @param {Event} e - Drag start event
 */
function preventDragStart(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}

/**
 * Prevent selection on images
 * @param {Event} e - Select start event
 */
function preventSelectStart(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}

/**
 * Prevent keyboard shortcuts for saving
 * @param {Event} e - Keyboard event
 */
function preventKeyboardShortcuts(e) {
    // Prevent Ctrl+S (Save), Ctrl+A (Select All), F12 (DevTools)
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'a')) {
        if (e.target.tagName === 'IMG' || e.target.closest('.photo-item') || e.target.closest('.modal')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
    
    // Prevent F12 (DevTools) when focused on images
    if (e.key === 'F12' && (e.target.tagName === 'IMG' || e.target.closest('.photo-item'))) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}

/**
 * Add image protection event listeners
 */
export function initImageProtection() {
    // Prevent right-click context menu
    document.addEventListener('contextmenu', preventContextMenu, true);
    
    // Prevent drag and drop
    document.addEventListener('dragstart', preventDragStart, true);
    
    // Prevent text selection
    document.addEventListener('selectstart', preventSelectStart, true);
    
    // Prevent keyboard shortcuts
    document.addEventListener('keydown', preventKeyboardShortcuts, true);
    
    // Prevent long press on mobile
    document.addEventListener('touchstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Prevent double-tap zoom on images
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300 && e.target.tagName === 'IMG') {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

/**
 * Additional protection for dynamically loaded images
 * @param {HTMLImageElement} img - Image element to protect
 */
export function protectImage(img) {
    if (img && img.tagName === 'IMG') {
        img.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
        
        img.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });
        
        img.addEventListener('selectstart', (e) => {
            e.preventDefault();
            return false;
        });
        
        // Prevent image loading in new tab
        img.addEventListener('click', (e) => {
            if (e.ctrlKey || e.metaKey || e.button === 1) {
                e.preventDefault();
                return false;
            }
        });
    }
}