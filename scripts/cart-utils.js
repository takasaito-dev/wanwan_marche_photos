/**
 * Cart utility functions for managing localStorage cart operations
 */

const CART_KEY = 'cart';

/**
 * Get cart items from localStorage
 * @returns {Array} Array of cart items
 */
export function getCartItems() {
    try {
        const cart = localStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Error parsing cart data:', error);
        return [];
    }
}

/**
 * Save cart items to localStorage
 * @param {Array} items - Array of cart items to save
 */
export function saveCartItems(items) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
        updateCartBadge();
    } catch (error) {
        console.error('Error saving cart data:', error);
    }
}

/**
 * Add items to cart
 * @param {Array} newItems - Array of items to add
 */
export function addToCart(newItems) {
    const currentItems = getCartItems();
    const filteredNewItems = newItems.filter(newItem => {
        // Check if item already exists in cart
        return !currentItems.some(existingItem => 
            existingItem.eventId === newItem.eventId && 
            existingItem.photoName === newItem.photoName
        );
    });
    
    const updatedItems = [...currentItems, ...filteredNewItems];
    saveCartItems(updatedItems);
    
    // Return info about duplicates
    const duplicateCount = newItems.length - filteredNewItems.length;
    return {
        added: filteredNewItems.length,
        duplicates: duplicateCount,
        total: updatedItems.length
    };
}

/**
 * Remove item from cart by index
 * @param {number} index - Index of item to remove
 */
export function removeFromCart(index) {
    const items = getCartItems();
    items.splice(index, 1);
    saveCartItems(items);
}

/**
 * Clear all items from cart
 */
export function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
    
    // Clear all selection states when cart is cleared
    clearAllSelectionStates();
}

/**
 * Clear all photo selection states
 */
function clearAllSelectionStates() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('photo-selection-')) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
}

/**
 * Get cart item count
 * @returns {number} Number of items in cart
 */
export function getCartCount() {
    return getCartItems().length;
}

/**
 * Update cart badge in navbar
 */
export function updateCartBadge() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = getCartCount();
    }
}

/**
 * Check if item is already in cart
 * @param {string} eventId - Event ID
 * @param {string} photoName - Photo name
 * @returns {boolean} True if item exists in cart
 */
export function isInCart(eventId, photoName) {
    const currentItems = getCartItems();
    return currentItems.some(item => 
        item.eventId === eventId && item.photoName === photoName
    );
}

/**
 * Initialize cart badge on page load
 */
export function initCartBadge() {
    updateCartBadge();
}