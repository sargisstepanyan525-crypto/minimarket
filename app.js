// საწყისი პროდუქტების ბაზა
const defaultProducts = [
    {
        id: 1,
        name: "სომხური ყავა ლატინო",
        price: 3.50,
        country: "სომხეთი",
        img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
        hasPrize: true
    },
    {
        id: 2,
        name: "სარეცხი საშუალება Ariel",
        price: 18.00,
        country: "თურქეთი",
        img: "https://images.unsplash.com/photo-1585830812416-a6c86bb14576?w=400",
        hasPrize: false
    }
];

// LocalStorage-ის ინიციალიზაცია
let products = JSON.parse(localStorage.getItem('mini_market_db')) || defaultProducts;
let cart = [];
let isAdminLoggedIn = false;

// მონაცემების შენახვა
function syncStorage() {
    localStorage.setItem('mini_market_db', JSON.stringify(products));
}

// პროდუქტების გამოჩენა/რენდერი
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const searchValue = document.getElementById('searchInput').value.toLowerCase().trim();
    const selectedCountry = document.getElementById('countryFilter').value;

    if (!grid) return;
    grid.innerHTML = '';

    const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchValue);
        const matchesCountry = (selectedCountry === 'ALL') || (p.country === selectedCountry);
        return matchesSearch && matchesCountry;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px;">პროდუქტი ვერ მოიძებნა</p>`;
        return;
    }

    filtered.forEach(p => {
        grid.innerHTML += `
            <div class="card">
                ${p.hasPrize ? '<span class="badge-prize">🎁 პრიზი!</span>' : ''}
                <img src="${p.img || 'https://via.placeholder.com/250'}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/250'">
                <div class="card-body">
                    <div class="card-title">${p.name}</div>
                    <div class="card-country">📍 ${p.country}</div>
                    <div class="card-price">${Number(p.price).toFixed(2)} ₾</div>
                    <button class="btn" style="width: 100%;" onclick="addToCart(${p.id})">კალათაში დამატება</button>
                    ${isAdminLoggedIn ? `
                        <div class="admin-actions">
                            <button class="btn-delete" onclick="deleteProduct(${p.id})">წაშლა</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });
}

// კალათის ფუნქციები
function addToCart(id) {
    const item = products.find(p => p.id === id);
    if (item) {
        cart.push(item);
        updateCart();
    }
}

function updateCart() {
    const badge = document.getElementById('cartCount');
    const itemsContainer = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');

    if (badge) badge.innerText = cart.length;
    if (!itemsContainer || !totalElement) return;

    itemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += Number(item.price);
        itemsContainer.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${Number(item.price).toFixed(2)} ₾</small>
                </div>
                <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer; font-weight:bold;">✕</button>
            </div>
        `;
    });

    totalElement.innerText = total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('კალათა ცარიელია!');
        return;
    }
    const address = document.getElementById('orderAddress').value.trim();
    if (!address) {
        alert('გთხოვთ მიუთითოთ მიწოდების მისამართი!');
        return;
    }

    alert('შეკვეთა წარმატებით გაფორმდა! ოპერატორი დაგიკავშირდებათ ნომერზე: +995 500 22 48 22');
    cart = [];
    updateCart();
    toggleCart();
}

// ადმინ სისტემის მართვა
function openAdminModal() {
    if (isAdminLoggedIn) {
        document.getElementById('adminPanelModal').style.display = 'flex';
    } else {
        document.getElementById('adminLoginModal').style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function loginAdmin() {
    const pass = document.getElementById('adminPassword').value;
    if (pass === '2003') {
        isAdminLoggedIn = true;
        closeModal('adminLoginModal');
        document.getElementById('adminPanelModal').style.display = 'flex';
        renderProducts();
        document.getElementById('adminPassword').value = '';
    } else {
        alert('არასწორი პაროლი!');
    }
}

function addProduct() {
    const name = document.getElementById('prodName').value.trim();
    const price = parseFloat(document.getElementById('prodPrice').value);
    const img = document.getElementById('prodImg').value.trim();
    const country = document.getElementById('prodCountry').value;
    const hasPrize = document.getElementById('prodHasPrize').checked;

    if (!name || isNaN(price) || price <= 0) {
        alert('გთხოვთ მიუთითოთ ვალიდური დასახელება და ფასი!');
        return;
    }

    const newProd = {
        id: Date.now(),
        name,
        price,
        img: img || 'https://via.placeholder.com/250',
        country,
        hasPrize
    };

    products.push(newProd);
    syncStorage();
    renderProducts();
    closeModal('adminPanelModal');

    // ფორმის გასუფთავება
    document.getElementById('prodName').value = '';
    document.getElementById('prodPrice').value = '';
    document.getElementById('prodImg').value = '';
    document.getElementById('prodHasPrize').checked = false;
}

function deleteProduct(id) {
    if (confirm('ნამდვილად გსურთ ამ პროდუქტის წაშლა?')) {
        products = products.filter(p => p.id !== id);
        syncStorage();
        renderProducts();
    }
}

// ჩატვირთვისას ივენთების გაშვება
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});
