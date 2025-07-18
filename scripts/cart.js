import { initCartBadge, getCartItems, removeFromCart, clearCart } from './cart-utils.js';
import { initImageProtection, protectImage } from './image-protection.js';

// 写真の価格設定（1枚あたり）
const PHOTO_PRICE = 300;

/**
 * Load and display cart items
 */
function loadCartItems() {
    const cartItems = getCartItems();
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartEl = document.getElementById('empty-cart');
    const orderFormSection = document.getElementById('order-form-section');
    const cartSummary = document.getElementById('cart-summary');
    
    if (cartItems.length === 0) {
        cartItemsContainer.style.display = 'none';
        orderFormSection.style.display = 'none';
        cartSummary.style.display = 'none';
        emptyCartEl.style.display = 'block';
        return;
    }
    
    emptyCartEl.style.display = 'none';
    cartItemsContainer.style.display = 'block';
    orderFormSection.style.display = 'block';
    cartSummary.style.display = 'block';
    
    displayCartItems(cartItems);
    updateCartSummary(cartItems);
}

/**
 * Display cart items in the UI
 * @param {Array} items - Array of cart items
 */
function displayCartItems(items) {
    const cartItemsContainer = document.getElementById('cart-items');
    
    cartItemsContainer.innerHTML = `
        <div class="cart-summary">
            <h3>選択した写真 (${items.length}枚)</h3>
        </div>
        <div class="cart-items-grid">
            ${items.map((item, index) => `
                <div class="cart-item" data-index="${index}">
                    <div class="cart-item-image">
                        <img src="${item.thumbPath}" 
                             alt="${item.photoName}"
                             loading="lazy"
                             onerror="this.src='data:image/svg+xml,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;100&quot; height=&quot;75&quot; viewBox=&quot;0 0 100 75&quot;><rect width=&quot;100&quot; height=&quot;75&quot; fill=&quot;%23f0f0f0&quot;/><text x=&quot;50&quot; y=&quot;37&quot; text-anchor=&quot;middle&quot; fill=&quot;%23999&quot; font-size=&quot;10&quot;>No Image</text></svg>'"
                             >
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.photoName}</div>
                        <div class="cart-item-event">${item.eventId}</div>
                    </div>
                    <button class="cart-item-remove" 
                            onclick="removeItem(${index})"
                            aria-label="写真 ${item.photoName} を削除">
                        ×
                    </button>
                </div>
            `).join('')}
        </div>
    `;
    
    // Apply protection to cart images
    const images = cartItemsContainer.querySelectorAll('img');
    images.forEach(img => protectImage(img));
}

/**
 * Update cart summary with total count and price
 * @param {Array} items - Array of cart items
 */
function updateCartSummary(items) {
    const totalCount = items.length;
    const totalAmount = totalCount * PHOTO_PRICE;
    
    document.getElementById('total-count').textContent = totalCount;
    document.getElementById('total-amount').textContent = totalAmount.toLocaleString();
}

/**
 * Remove item from cart
 * @param {number} index - Index of item to remove
 */
window.removeItem = function(index) {
    removeFromCart(index);
    loadCartItems();
};

/**
 * Clear entire cart
 */
function clearEntireCart() {
    if (confirm('カートの中身をすべて削除しますか？')) {
        clearCart();
        loadCartItems();
    }
}

/**
 * Handle order form submission
 * @param {Event} e - Form submit event
 */
async function handleOrderSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const cartItems = getCartItems();
    
    const orderData = {
        customer: {
            lastName: formData.get('lastName'),
            firstName: formData.get('firstName'),
            fullName: `${formData.get('lastName')} ${formData.get('firstName')}`,
            email: formData.get('email'),
            phone: formData.get('phone'),
            paymentMethod: formData.get('paymentMethod')
        },
        items: cartItems,
        orderDate: new Date().toISOString(),
        totalItems: cartItems.length,
        totalAmount: cartItems.length * PHOTO_PRICE
    };
    
    // Log order data for testing
    console.log('Order submitted:', orderData);
    
    // Create mailto link
    const subject = encodeURIComponent('写真注文');
    const body = encodeURIComponent(`
写真注文の詳細:

お客様情報:
- お名前: ${orderData.customer.fullName}
- メールアドレス: ${orderData.customer.email}
- 電話番号: ${orderData.customer.phone}
- お支払い方法: ${orderData.customer.paymentMethod}

注文内容:
- 写真枚数: ${orderData.totalItems}枚
- 単価: ¥${PHOTO_PRICE.toLocaleString()}
- 合計金額: ¥${orderData.totalAmount.toLocaleString()}

写真詳細:
${orderData.items.map((item, index) => `${index + 1}. ${item.photoName} (${item.eventId})`).join('\n')}

注文日時: ${new Date(orderData.orderDate).toLocaleString('ja-JP')}

---
このメールは写真販売サイトから自動生成されました。
    `.trim());
    
    const mailtoLink = `mailto:takaaki.saito0223@gmail.com?subject=${subject}&body=${body}`;
    
    try {
        // Ask user if they want to open email app
        const openEmail = confirm('メールアプリを開いて注文内容を送信しますか？\n\n※メールアプリが開いたら、そちらから送信ボタンを押してください。');
        
        if (openEmail) {
            // Open mailto link
            window.location.href = mailtoLink;
            
            // Clear cart and show thank you message
            clearCart();
            showThankYouMessage();
        }
        
    } catch (error) {
        console.error('Error sending email:', error);
        alert('メール送信に失敗しました。お手数ですが、直接お問い合わせください。');
    }
}

/**
 * Show thank you message
 */
function showThankYouMessage() {
    document.getElementById('cart-content').style.display = 'none';
    document.getElementById('thank-you-section').style.display = 'block';
}

/**
 * Validate form inputs
 */
function validateForm() {
    const form = document.getElementById('order-form');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

/**
 * Handle input changes for validation
 * @param {Event} e - Input change event
 */
function handleInputChange(e) {
    const input = e.target;
    if (input.value.trim()) {
        input.classList.remove('error');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initCartBadge();
    initImageProtection();
    loadCartItems();
    
    // Event listeners
    document.getElementById('order-form').addEventListener('submit', handleOrderSubmit);
    document.getElementById('clear-cart-btn').addEventListener('click', clearEntireCart);
    
    // Form validation
    const formInputs = document.querySelectorAll('#order-form input, #order-form select');
    formInputs.forEach(input => {
        input.addEventListener('input', handleInputChange);
        input.addEventListener('change', handleInputChange);
    });
});