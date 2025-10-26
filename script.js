// Product data example
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2499, // In Philippine peso
    image: "images/Wireless.jpeg" // <-- Attach product image here
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 3999,
    image: "images/Smart.jpg" // <-- Attach product image here
  },
  {
    id: 3,
    name: "Portable Bluetooth Speaker",
    price: 1799,
    image: "images/Jbl.jpg" // <-- Attach product image here
  },
  {
    id: 4,
    name: "Gaming Mouse",
    price: 1299,
    image: "images/Mouse.jpg" // <-- Attach product image here
  },
  {
    id: 5,
    name: "Mechanical Keyboard",
    price: 4999,
    image: "images/Keyboard.jpg" // <-- Attach product image here
  },
  {
    id: 6,
    name: "USB-C Hub",
    price: 999,
    image: "images/USBcHUB.jpg" // <-- Attach product image here
  }
];
// State variables
let currentPage = "home";
let loggedInUser = null;
let cart = [];

// Cached DOM elements
const contentContainer = document.getElementById("contentContainer");
const navLinks = document.querySelectorAll(".nav-link");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const signoutBtn = document.getElementById("signoutBtn");
const cartCountElem = document.getElementById("cartCount");
const cartIcon = document.getElementById("cartIcon");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");
const loginCloseBtn = document.getElementById("loginCloseBtn");
const signupCloseBtn = document.getElementById("signupCloseBtn");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const topOfferBar = document.querySelector(".top-offer-bar");
const closeOfferBtn = document.getElementById("closeOfferBtn");

// Utility Functions

function saveSession() {
  localStorage.setItem("pixelPowerUser", JSON.stringify(loggedInUser));
  localStorage.setItem("pixelPowerCart", JSON.stringify(cart));
}

function loadSession() {
  const user = JSON.parse(localStorage.getItem("pixelPowerUser"));
  const savedCart = JSON.parse(localStorage.getItem("pixelPowerCart"));
  if (user) loggedInUser = user;
  if (savedCart) cart = savedCart;
}

function clearSession() {
  loggedInUser = null;
  cart = [];
  localStorage.removeItem("pixelPowerUser");
  localStorage.removeItem("pixelPowerCart");
}

function formatPrice(value) {
  return `₱${value.toLocaleString("en-PH")}`;
}

function updateCartCount() {
  if (loggedInUser && cart.length > 0) {
    cartCountElem.textContent = cart.length;
    cartCountElem.style.display = "inline-block";
  } else {
    cartCountElem.style.display = "none";
  }
}

function updateAuthDisplay() {
  if (loggedInUser) {
    loginBtn.classList.add("hidden");
    signupBtn.classList.add("hidden");
    signoutBtn.classList.remove("hidden");
  } else {
    loginBtn.classList.remove("hidden");
    signupBtn.classList.remove("hidden");
    signoutBtn.classList.add("hidden");
  }
}

// Navigation & Page Rendering

function changePage(page) {
  currentPage = page;

  // Update active nav link
  navLinks.forEach(link => {
    if (link.dataset.page === page) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  if (page === "home") {
    renderHomePage();
  } else if (page === "shop") {
    renderShopPage();
  } else if (page === "about") {
    renderAboutPage();
  } else if (page === "contact") {
    renderContactPage();
  }
}

function renderHomePage() {
  contentContainer.innerHTML = `
    <section id="homePage" class="page">
      <div class="home-banner">
        <small>NEW</small>
        <h1>Gadgets you'll love.<br>Prices you'll trust.</h1>
        <strong>Starting from ${formatPrice(2499)}</strong>
        <button id="learnMoreBtn">Learn More</button>
        <!-- Attach main banner image here -->
        <img src="images/Happyperson.jpeg" alt="Happy person wearing headphones" class="home-image" />
      </div>
      <div class="promo-blocks">
        <div class="promo best">
          <h3>Best products</h3>
          <!-- Attach product promo image here -->
         <img src="images/Keyboard.jpg" alt="Best product" width="200" height="150" class="promo-image" />
          <a href="#" id="viewBestProducts">View More &rarr;</a>
        </div>
        <div class="promo discount">
          <h3>20% discounts</h3>
          <!-- Attach discount promo image here -->
          <img src="images/USBcHUB.jpg" alt="Discount" width="200" height="150" class="promo-image" />
          <a href="#" id="viewDiscounts">View More &rarr;</a>
        </div>
      </div>
    </section>
  `;

  // Add event listeners for promo links
  document.getElementById("learnMoreBtn").addEventListener("click", () => changePage("shop"));
  document.getElementById("viewBestProducts").addEventListener("click", (e) => {
    e.preventDefault();
    changePage("shop");
    // Could implement filter if products had categories
  });
  document.getElementById("viewDiscounts").addEventListener("click", (e) => {
    e.preventDefault();
    changePage("shop");
    // Could implement filter if discounts available
  });
}

function renderShopPage(searchTerm = "") {
  let filteredProducts = products;
  if (searchTerm) {
    filteredProducts = products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filteredProducts.length === 0) {
    contentContainer.innerHTML = `
      <section id="shopPage" class="page">
        <p>No products found for "${searchTerm}". Please try another search.</p>
      </section>
    `;
    return;
  }

  const productCardsHTML = filteredProducts.map(p => `
    <article class="product-card" data-id="${p.id}">
      <img src="${p.image}" alt="${p.name}" class="product-image" />
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-price">${formatPrice(p.price)}</p>
      </div>
      ${loggedInUser ? `<button class="add-cart-btn" data-id="${p.id}">Add to Cart</button>` : ''}
    </article>
  `).join("");

  contentContainer.innerHTML = `
    <section id="shopPage" class="page">
      ${productCardsHTML}
    </section>
  `;

  // Attach add to cart button events if logged in
  if (loggedInUser) {
    const addCartBtns = contentContainer.querySelectorAll(".add-cart-btn");
    addCartBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const productId = parseInt(btn.dataset.id);
        addToCart(productId);
      });
    });
  }
}

function renderAboutPage() {
  contentContainer.innerHTML = `
    <section id="aboutPage" class="page">
      <h2>About Pixel Power</h2>
      <p>Pixel Power is your ultimate tech haven for gadgets you’ll love and prices you'll trust. Our mission is to bring quality electronics and tech accessories to the Filipino market at unbeatable prices.</p>
      <p>We carefully select the best products and provide excellent customer support to create a seamless online shopping experience.</p>
    </section>
  `;
}

function renderContactPage() {
  contentContainer.innerHTML = `
    <section id="contactPage" class="page">
      <h2>Contact Us</h2>
      <p>Got questions or need support? Feel free to reach out.</p>
      <ul>
        <li>Email: pixelsupport@gmail.com</li>
        <li>Phone: +63 927 648 6697</li>
        <li>Address: Purok 3-B Poblacion, Ramon Magsaysay Z,D,S Philippines</li>
      </ul>
    </section>
  `;
}

// Cart management
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  // Prevent duplicates in cart
  if (!cart.some(item => item.id === productId)) {
    cart.push(product);
    saveSession();
    updateCartCount();
    alert(`${product.name} has been added to your cart.`);
  } else {
    alert(`${product.name} is already in your cart.`);
  }
}

// Login / Signup logic

// Dummy users storage
const usersKey = "pixelPowerUsers";

function getUsers() {
  const users = JSON.parse(localStorage.getItem(usersKey)) || [];
  return users;
}

function saveUser(user) {
  let users = getUsers();
  users.push(user);
  localStorage.setItem(usersKey, JSON.stringify(users));
}

function findUser(email) {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

// Show / hide modals
function showModal(modal) {
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function hideModal(modal) {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

// Event Listeners

// Navigation click
navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const page = e.currentTarget.dataset.page;
    changePage(page);
  });
});

// Login button
loginBtn.addEventListener("click", () => {
  showModal(loginModal);
});

// Signup button
signupBtn.addEventListener("click", () => {
  showModal(signupModal);
});

// Close modals
loginCloseBtn.addEventListener("click", () => hideModal(loginModal));
signupCloseBtn.addEventListener("click", () => hideModal(signupModal));

// Login form submit
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const user = findUser(email);
  if (!user) {
    alert("User not found. Please sign up first.");
    return;
  }
  if (user.password !== password) {
    alert("Incorrect password.");
    return;
  }
  loggedInUser = { email: user.email };
  loadUserCart();
  saveSession();
  hideModal(loginModal);
  updateAuthDisplay();
  updateCartCount();
  renderCurrentPageAfterAuth();
  alert(`Welcome back, ${email}!`);
  loginForm.reset();
});

// Signup form submit
signupForm.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (findUser(email)) {
    alert("Email already registered. Try logging in.");
    return;
  }

  saveUser({ email, password });
  alert("Sign up successful! Please login now.");
  hideModal(signupModal);
  signupForm.reset();
});

// Signout button
signoutBtn.addEventListener("click", () => {
  clearSession();
  updateAuthDisplay();
  updateCartCount();
  renderCurrentPageAfterAuth();
  alert("You have signed out.");
});

// Search functionality
searchBtn.addEventListener("click", () => {
  const term = searchInput.value.trim();
  changePage("shop");
  renderShopPage(term);
});

searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchBtn.click();
  }
});

// Load user cart items on login
function loadUserCart() {
  const savedCart = JSON.parse(localStorage.getItem("pixelPowerCart"));
  if (savedCart) {
    cart = savedCart;
  } else {
    cart = [];
  }
}

function renderCurrentPageAfterAuth() {
  if (currentPage === "shop") {
    renderShopPage(searchInput.value.trim());
  } else {
    changePage(currentPage);
  }
}

// Close offer bar
closeOfferBtn.addEventListener("click", () => {
  topOfferBar.style.display = "none";
});

// Initialize app
function init() {
  loadSession();
  updateAuthDisplay();
  updateCartCount();
  changePage(currentPage);
}

init();
