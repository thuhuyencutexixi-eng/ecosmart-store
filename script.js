// 1. Khởi tạo giỏ hàng
let cart = [];
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');
const API_URL = "https://sheetdb.io/api/v1/hwf1i22sinqn0";

// 2. Điều khiển đóng/mở Giỏ hàng
document.getElementById('open-cart').onclick = () => cartSidebar.classList.add('active');
document.getElementById('close-cart').onclick = () => cartSidebar.classList.remove('active');

// 3. Xử lý thêm sản phẩm vào giỏ
document.querySelectorAll('.btn-add').forEach(btn => {
    btn.onclick = () => {
        const card = btn.closest('.product-card');
        const name = card.querySelector('h3').innerText;
        const priceText = card.querySelector('.price').innerText;
        const price = parseInt(card.querySelector('.price').dataset.price);
        
        cart.push({ name, price });
        updateUI();
        
        // Hiệu ứng mở giỏ hàng nhanh để khách biết đã thêm thành công
        cartSidebar.classList.add('active');
    };
});

// 4. Cập nhật giao diện Giỏ hàng
function updateUI() {
    cartCount.innerText = cart.length;
    let total = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:#888;">Giỏ hàng trống</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map((item, index) => {
            total += item.price;
            return `<div class="cart-item">
                        <span>${item.name}</span>
                        <span>${item.price.toLocaleString()}đ</span>
                    </div>`;
        }).join('');
    }
    cartTotal.innerText = total.toLocaleString() + 'đ';
}

// 5. Điều khiển Modal Thanh Toán
function openModal() {
    if (cart.length === 0) return alert("Vui lòng thêm sản phẩm vào giỏ trước khi thanh toán!");
    document.getElementById('payment-modal').style.display = 'block';
}

document.querySelector('.close-modal').onclick = () => {
    document.getElementById('payment-modal').style.display = 'none';
};

// 6. XỬ LÝ GỬI DỮ LIỆU VỀ GOOGLE SHEETS (API SHEETDB)
document.getElementById('checkout-form').onsubmit = async (e) => {
    e.preventDefault();
    
    // Lấy thông tin từ form
    const customerName = e.target.querySelector('input[type="text"]').value;
    const customerPhone = e.target.querySelector('input[type="tel"]').value;
    const orderDetails = cart.map(i => i.name).join(", ");
    const finalTotal = cartTotal.innerText;
    const orderTime = new Date().toLocaleString('vi-VN');

    // Hiệu ứng chờ khi đang gửi
    const submitBtn = e.target.querySelector('.btn-confirm');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Đang gửi đơn hàng...";
    submitBtn.disabled = true;

    // Cấu trúc dữ liệu gửi lên Sheet (Phải khớp với tên cột trong Google Sheets của bạn)
    const orderData = {
        data: [
            {
                "Thời gian": orderTime,
                "Tên khách hàng": customerName,
                "Số điện thoại": customerPhone,
                "Sản phẩm": orderDetails,
                "Tổng tiền": finalTotal,
                "Trạng thái": "Chờ xác nhận"
            }
        ]
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            alert("🎉 Đặt hàng thành công! Đơn hàng đã được lưu vào hệ thống quản trị.");
            // Reset giỏ hàng và form
            cart = [];
            updateUI();
            e.target.reset();
            document.getElementById('payment-modal').style.display = 'none';
            cartSidebar.classList.remove('active');
        } else {
            throw new Error("Lỗi kết nối API");
        }
    } catch (error) {
        console.error(error);
        alert("Có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại hoặc liên hệ Zalo hỗ trợ!");
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
};

// Đóng modal khi click ra ngoài
window.onclick = (event) => {
    const modal = document.getElementById('payment-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
