let cart = [];
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');

// Mở/Đóng giỏ hàng
document.getElementById('open-cart').onclick = () => cartSidebar.classList.add('active');
document.getElementById('close-cart').onclick = () => cartSidebar.classList.remove('active');

// Thêm vào giỏ
document.querySelectorAll('.btn-add').forEach(btn => {
    btn.onclick = () => {
        const card = btn.closest('.product-card');
        const name = card.querySelector('h3').innerText;
        const price = parseInt(card.querySelector('.price').dataset.price);
        
        cart.push({ name, price });
        updateUI();
        cartSidebar.classList.add('active');
    };
});

function updateUI() {
    cartCount.innerText = cart.length;
    let total = 0;
    cartItemsContainer.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `<div class="cart-item">
                    <span>${item.name}</span>
                    <span>${item.price.toLocaleString()}đ</span>
                </div>`;
    }).join('');
    cartTotal.innerText = total.toLocaleString() + 'đ';
}

// Modal Thanh Toán
function openModal() {
    if (cart.length === 0) return alert("Giỏ hàng của bạn đang trống!");
    document.getElementById('payment-modal').style.display = 'block';
}

document.querySelector('.close-modal').onclick = () => {
    document.getElementById('payment-modal').style.display = 'none';
};

document.getElementById('checkout-form').onsubmit = (e) => {
    e.preventDefault();
    alert("Hệ thống đã ghi nhận đơn hàng! Vui lòng chờ nhân viên gọi xác nhận.");
    cart = [];
    updateUI();
    document.getElementById('payment-modal').style.display = 'none';
};