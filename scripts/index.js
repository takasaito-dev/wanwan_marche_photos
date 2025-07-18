import { initCartBadge } from './cart-utils.js';
import { initImageProtection } from './image-protection.js';

/**
 * Fetch and display events from events.json
 */
async function loadEvents() {
    try {
        const response = await fetch('events.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const events = await response.json();
        displayEvents(events);
    } catch (error) {
        console.error('Error loading events:', error);
        displayError('イベント情報の読み込みに失敗しました');
    }
}

/**
 * Display events as cards in the grid
 * @param {Array} events - Array of event objects
 */
function displayEvents(events) {
    const eventsGrid = document.getElementById('events-grid');
    
    if (events.length === 0) {
        eventsGrid.innerHTML = '<p class="no-events">イベントがありません</p>';
        return;
    }

    eventsGrid.innerHTML = events.map(event => `
        <article class="event-card" ${event.salesEnded ? '' : `onclick="window.location.href='event.html?eventId=${event.id}'"`}>
            ${event.flyerImage ? `
            <div class="event-card-image">
                <img src="${event.flyerImage}" 
                     alt="${event.name}のチラシ" 
                     class="event-flyer"
                     loading="lazy"
                     onerror="this.parentElement.style.display='none'">
            </div>
            ` : ''}
            <div class="event-card-content">
                <div class="event-card-header">
                    <h3>${event.name}</h3>
                    <time datetime="${event.date}">${formatDate(event.date)}</time>
                </div>
                <div class="event-card-body">
                    <p>${event.description}</p>
                </div>
                <div class="event-card-footer">
                    ${event.salesEnded ? `
                        <button class="btn disabled" disabled onclick="event.stopPropagation()">
                            販売終了
                        </button>
                    ` : `
                        <a href="event.html?eventId=${event.id}" class="btn primary" onclick="event.stopPropagation()">
                            写真を見る
                        </a>
                    `}
                </div>
            </div>
        </article>
    `).join('');
}

/**
 * Format date string for display
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Display error message
 * @param {string} message - Error message to display
 */
function displayError(message) {
    const eventsGrid = document.getElementById('events-grid');
    eventsGrid.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            <button onclick="location.reload()" class="btn secondary">再読み込み</button>
        </div>
    `;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initCartBadge();
    initImageProtection();
    loadEvents();
});