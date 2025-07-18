import { initCartBadge, addToCart, isInCart } from './cart-utils.js';
import { initImageProtection, protectImage } from './image-protection.js';

let currentEventId = '';
let photos = [];
let selectedPhotos = new Set();
let currentLightboxIndex = 0;

/**
 * Get selection state storage key for current event
 */
function getSelectionStorageKey() {
    return `photo-selection-${currentEventId}`;
}

/**
 * Save selection state to localStorage
 */
function saveSelectionState() {
    const selectionArray = Array.from(selectedPhotos);
    localStorage.setItem(getSelectionStorageKey(), JSON.stringify(selectionArray));
}

/**
 * Load selection state from localStorage
 */
function loadSelectionState() {
    const stored = localStorage.getItem(getSelectionStorageKey());
    if (stored) {
        try {
            const selectionArray = JSON.parse(stored);
            selectedPhotos = new Set(selectionArray);
        } catch (error) {
            console.error('Error loading selection state:', error);
            selectedPhotos = new Set();
        }
    }
}

/**
 * Remove photos that are already in cart from selection
 */
function removeCartItemsFromSelection() {
    const updatedSelection = new Set();
    
    selectedPhotos.forEach(index => {
        const photoName = photos[index];
        if (photoName && !isInCart(currentEventId, photoName)) {
            updatedSelection.add(index);
        }
    });
    
    selectedPhotos = updatedSelection;
    saveSelectionState();
}

/**
 * Get event ID from URL parameters
 * @returns {string} Event ID or empty string if not found
 */
function getEventIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('eventId') || '';
}

/**
 * Load event data and photos
 */
async function loadEventData() {
    currentEventId = getEventIdFromUrl();
    
    if (!currentEventId) {
        displayError('イベントIDが指定されていません');
        return;
    }

    try {
        // Load event info
        const eventsResponse = await fetch('events.json');
        const events = await eventsResponse.json();
        const eventInfo = events.find(e => e.id === currentEventId);
        
        if (eventInfo) {
            document.getElementById('event-title').textContent = eventInfo.name;
            document.title = `${eventInfo.name} - わんマル写真販売`;
        }

        // Load photos for this event
        const photosResponse = await fetch(`${currentEventId}.json`);
        if (!photosResponse.ok) {
            throw new Error(`HTTP error! status: ${photosResponse.status}`);
        }
        
        photos = await photosResponse.json();
        loadSelectionState();
        removeCartItemsFromSelection();
        displayPhotos();
        updateSelectionUI();
        
    } catch (error) {
        console.error('Error loading event data:', error);
        displayError('イベント情報の読み込みに失敗しました');
    }
}

/**
 * Display photos in grid layout
 */
function displayPhotos() {
    const photosGrid = document.getElementById('photos-grid');
    
    if (photos.length === 0) {
        photosGrid.innerHTML = '<p class="no-photos">写真がありません</p>';
        return;
    }

    photosGrid.innerHTML = photos.map((photo, index) => {
        const isInCartFlag = isInCart(currentEventId, photo);
        const isSelected = selectedPhotos.has(index);
        
        return `
        <div class="photo-item ${isSelected ? 'selected' : ''} ${isInCartFlag ? 'in-cart' : ''}" data-index="${index}">
            <div class="photo-container">
                <img src="photos/${currentEventId}/${photo}" 
                     alt="写真 ${photo}"
                     class="photo-thumbnail"
                     onclick="openLightbox(${index})"
                     loading="lazy"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;400&quot; height=&quot;300&quot; viewBox=&quot;0 0 400 300&quot;><rect width=&quot;400&quot; height=&quot;300&quot; fill=&quot;%23f0f0f0&quot;/><text x=&quot;200&quot; y=&quot;150&quot; text-anchor=&quot;middle&quot; fill=&quot;%23999&quot; font-size=&quot;16&quot;>No Image</text></svg>'"
                     >
                <div class="photo-checkbox">
                    <input type="checkbox" 
                           id="photo-${index}" 
                           ${isSelected ? 'checked' : ''}
                           ${isInCartFlag ? 'disabled' : ''}
                           onchange="togglePhotoSelection(${index})"
                           aria-label="写真 ${photo} を選択">
                </div>
                ${isInCartFlag ? '<div class="cart-badge">カート内</div>' : ''}
            </div>
            <div class="photo-info">
                <span class="photo-name">${photo}</span>
            </div>
        </div>
        `;
    }).join('');
    
    // Apply protection to all images
    const images = photosGrid.querySelectorAll('img');
    images.forEach(img => protectImage(img));
}

/**
 * Toggle photo selection
 * @param {number} index - Photo index
 */
window.togglePhotoSelection = function(index) {
    const checkbox = document.getElementById(`photo-${index}`);
    const photoItem = document.querySelector(`.photo-item[data-index="${index}"]`);
    
    if (checkbox.checked) {
        selectedPhotos.add(index);
        photoItem.classList.add('selected');
    } else {
        selectedPhotos.delete(index);
        photoItem.classList.remove('selected');
    }
    
    updateSelectionUI();
    saveSelectionState();
};

/**
 * Update selection UI elements
 */
function updateSelectionUI() {
    const selectedCount = selectedPhotos.size;
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const selectedCountEl = document.getElementById('selected-count');
    
    selectedCountEl.textContent = selectedCount;
    addToCartBtn.disabled = selectedCount === 0;
}

/**
 * Select all photos
 */
function selectAllPhotos() {
    photos.forEach((_, index) => {
        const checkbox = document.getElementById(`photo-${index}`);
        const photoItem = document.querySelector(`.photo-item[data-index="${index}"]`);
        
        if (!checkbox.checked) {
            checkbox.checked = true;
            selectedPhotos.add(index);
            photoItem.classList.add('selected');
        }
    });
    
    updateSelectionUI();
    saveSelectionState();
}

/**
 * Deselect all photos
 */
function deselectAllPhotos() {
    photos.forEach((_, index) => {
        const checkbox = document.getElementById(`photo-${index}`);
        const photoItem = document.querySelector(`.photo-item[data-index="${index}"]`);
        
        if (checkbox.checked) {
            checkbox.checked = false;
            selectedPhotos.delete(index);
            photoItem.classList.remove('selected');
        }
    });
    
    updateSelectionUI();
    saveSelectionState();
}

/**
 * Add selected photos to cart
 */
function addSelectedToCart() {
    const selectedItems = Array.from(selectedPhotos).map(index => ({
        eventId: currentEventId,
        photoName: photos[index],
        thumbPath: `photos/${currentEventId}/${photos[index]}`,
        fullPath: `photos/${currentEventId}/${photos[index]}`
    }));
    
    const result = addToCart(selectedItems);
    
    // Show appropriate message
    if (result.duplicates > 0) {
        if (result.added > 0) {
            alert(`${result.added}枚の写真をカートに追加しました。\n${result.duplicates}枚は既にカートに入っているためスキップされました。`);
        } else {
            alert('選択した写真は全て既にカートに入っています。');
        }
    } else {
        alert(`${result.added}枚の写真をカートに追加しました。`);
    }
    
    // Clear selection after adding to cart
    selectedPhotos.clear();
    saveSelectionState();
    displayPhotos();
    updateSelectionUI();
    
    // Navigate to cart page if any items were added
    if (result.added > 0) {
        window.location.href = 'cart.html';
    }
}

/**
 * Open lightbox modal
 * @param {number} index - Photo index
 */
window.openLightbox = function(index) {
    currentLightboxIndex = index;
    const modal = document.getElementById('lightbox-modal');
    const image = document.getElementById('lightbox-image');
    const counter = document.getElementById('photo-counter');
    
    image.src = `photos/${currentEventId}/${photos[index]}`;
    image.alt = `写真 ${photos[index]}`;
    counter.textContent = `${index + 1} / ${photos.length}`;
    
    // Apply protection to lightbox image
    protectImage(image);
    
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus the modal for keyboard navigation
    modal.focus();
};

/**
 * Close lightbox modal
 */
function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}

/**
 * Navigate to previous photo in lightbox
 */
function previousPhoto() {
    currentLightboxIndex = (currentLightboxIndex - 1 + photos.length) % photos.length;
    openLightbox(currentLightboxIndex);
}

/**
 * Navigate to next photo in lightbox
 */
function nextPhoto() {
    currentLightboxIndex = (currentLightboxIndex + 1) % photos.length;
    openLightbox(currentLightboxIndex);
}

/**
 * Display error message
 * @param {string} message - Error message to display
 */
function displayError(message) {
    const photosGrid = document.getElementById('photos-grid');
    photosGrid.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            <a href="index.html" class="btn secondary">イベント一覧に戻る</a>
        </div>
    `;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initCartBadge();
    initImageProtection();
    loadEventData();
    
    // Event listeners
    document.getElementById('select-all-btn').addEventListener('click', selectAllPhotos);
    document.getElementById('deselect-all-btn').addEventListener('click', deselectAllPhotos);
    document.getElementById('add-to-cart-btn').addEventListener('click', addSelectedToCart);
    
    // Lightbox controls
    document.querySelector('.modal-close').addEventListener('click', closeLightbox);
    document.getElementById('prev-btn').addEventListener('click', previousPhoto);
    document.getElementById('next-btn').addEventListener('click', nextPhoto);
    
    // Close lightbox when clicking outside
    document.getElementById('lightbox-modal').addEventListener('click', (e) => {
        if (e.target.id === 'lightbox-modal') {
            closeLightbox();
        }
    });
    
    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('lightbox-modal');
        if (modal.style.display === 'flex') {
            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    previousPhoto();
                    break;
                case 'ArrowRight':
                    nextPhoto();
                    break;
            }
        }
    });
});