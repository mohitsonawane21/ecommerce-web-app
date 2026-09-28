import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // =========================
  // PRODUCTS FROM BACKEND
  // =========================

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  // =========================
  // PRODUCT DETAILS
  // =========================

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailQuantity, setDetailQuantity] = useState(1);

  // =========================
  // SEARCH + CATEGORY FILTER
  // =========================

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      )
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !search ||
      product.name?.toLowerCase().includes(search) ||
      product.description?.toLowerCase().includes(search) ||
      product.category?.toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // =========================
  // CART
  // =========================

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // =========================
  // CHECKOUT / ORDER
  // =========================

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState("");

  // =========================
  // MY ORDERS
  // =========================

  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  // =========================
  // AUTH
  // =========================

  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("shopeaseUser");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [authMessage, setAuthMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH PRODUCTS FROM API
  // =========================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError("");

        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch products"
          );
        }

        const formattedProducts = data.map(
          (product) => {
            const productName = (
              product.name || ""
            ).toLowerCase();

            let productEmoji = "🛍️";

            // Match the correct visual to the actual product.
            if (
              productName.includes("headphone") ||
              productName.includes("earphone") ||
              productName.includes("earbud")
            ) {
              productEmoji = "🎧";
            } else if (
              productName.includes("watch")
            ) {
              productEmoji = "⌚";
            } else if (
              productName.includes("shoe") ||
              productName.includes("sneaker")
            ) {
              productEmoji = "👟";
            } else if (
              productName.includes("backpack") ||
              productName.includes("bag")
            ) {
              productEmoji = "🎒";
            } else if (
              (product.category || "")
                .toLowerCase()
                .includes("electronics")
            ) {
              productEmoji = "📱";
            } else if (
              (product.category || "")
                .toLowerCase()
                .includes("fashion")
            ) {
              productEmoji = "👕";
            } else if (
              (product.category || "")
                .toLowerCase()
                .includes("home")
            ) {
              productEmoji = "🏠";
            } else if (
              (product.category || "")
                .toLowerCase()
                .includes("sport")
            ) {
              productEmoji = "⚽";
            }

            return {
              ...product,

              // MongoDB _id -> frontend id
              id: product._id,

              emoji: productEmoji,

              badge: product.badge || "NEW",
            };
          }
        );

        setProducts(formattedProducts);
      } catch (error) {
        console.error(
          "Products fetch error:",
          error
        );

        setProductsError(
          "Unable to load products. Please make sure the backend is running."
        );
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =========================
  // PRODUCT DETAILS FUNCTIONS
  // =========================

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setDetailQuantity(1);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
    setDetailQuantity(1);
  };

  const addProductFromDetails = () => {
    if (!selectedProduct) return;

    for (let i = 0; i < detailQuantity; i += 1) {
      addToCart(selectedProduct);
    }

    closeProductDetails();
    setShowCart(true);
  };

  // =========================
  // CART FUNCTIONS
  // =========================

  const addToCart = (product) => {
    const existingProduct = cart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }

    setOrderMessage("");
  };

  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart(
      cart.filter((item) => item.id !== id)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  // =========================
  // CHECKOUT / PLACE ORDER
  // =========================

  const handleCheckout = async () => {
    // Check empty cart
    if (cart.length === 0) {
      setOrderMessage(
        "Your cart is empty. Please add some products first."
      );
      return;
    }

    // Get authentication data
    const token = localStorage.getItem(
      "shopeaseToken"
    );

    const savedUser =
      localStorage.getItem("shopeaseUser");

    // Check login
    if (!token || !savedUser || !user) {
      setShowCart(false);

      setAuthMode("login");

      setAuthMessage(
        "Please login before placing your order."
      );

      setShowAuth(true);

      return;
    }

    try {
      setCheckoutLoading(true);
      setOrderMessage("");

      const orderData = {
        items: cart.map((item) => ({
          product: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
        })),

        totalAmount: Number(totalPrice),
      };

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      // Token invalid / expired
      if (response.status === 401) {
        localStorage.removeItem(
          "shopeaseToken"
        );

        localStorage.removeItem(
          "shopeaseUser"
        );

        setUser(null);

        setShowCart(false);

        setAuthMode("login");

        setAuthMessage(
          "Your session has expired. Please login again."
        );

        setShowAuth(true);

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to place order"
        );
      }

      // Save order ID
      setLastOrderId(
        data.order?._id || ""
      );

      // Success
      setOrderSuccess(true);

      setOrderMessage(
        "Your order has been placed successfully!"
      );

      // Clear cart
      setCart([]);

      // Close cart
      setShowCart(false);

    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      setOrderSuccess(false);

      setOrderMessage(
        error.message ||
          "Unable to place order. Please try again."
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  // =========================
  // FETCH MY ORDERS
  // =========================

  const fetchMyOrders = async () => {
    const token = localStorage.getItem("shopeaseToken");

    if (!token || !user) {
      setAuthMode("login");
      setAuthMessage("Please login to view your orders.");
      setShowAuth(true);
      return;
    }

    try {
      setOrdersLoading(true);
      setOrdersError("");

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("shopeaseToken");
        localStorage.removeItem("shopeaseUser");
        setUser(null);
        setShowOrders(false);
        setAuthMode("login");
        setAuthMessage("Your session has expired. Please login again.");
        setShowAuth(true);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data);
      setShowOrders(true);
    } catch (error) {
      console.error("Orders fetch error:", error);
      setOrdersError(
        error.message || "Unable to load your orders."
      );
      setShowOrders(true);
    } finally {
      setOrdersLoading(false);
    }
  };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // LOGIN / REGISTER
  // =========================

  const handleAuth = async (e) => {
    e.preventDefault();

    setLoading(true);
    setAuthMessage("");

    const endpoint =
      authMode === "login"
        ? "/api/auth/login"
        : "/api/auth/register";

    try {
      const response = await fetch(
        `http://localhost:5000${endpoint}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(
            authMode === "login"
              ? {
                  email: formData.email,
                  password:
                    formData.password,
                }
              : formData
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setAuthMessage(
          data.message ||
            "Something went wrong"
        );

        return;
      }

      // =========================
      // REGISTER
      // =========================

      if (authMode === "register") {
        setAuthMessage(
          "Registration successful! Please login."
        );

        setAuthMode("login");

        setFormData({
          name: "",
          email: formData.email,
          password: "",
        });
      }

      // =========================
      // LOGIN
      // =========================

      else {
        localStorage.setItem(
          "shopeaseToken",
          data.token
        );

        localStorage.setItem(
          "shopeaseUser",
          JSON.stringify(data.user)
        );

        setUser(data.user);

        setShowAuth(false);

        setFormData({
          name: "",
          email: "",
          password: "",
        });

        setAuthMessage("");
      }
    } catch (error) {
      console.error(
        "Authentication error:",
        error
      );

      setAuthMessage(
        "Cannot connect to server. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem(
      "shopeaseToken"
    );

    localStorage.removeItem(
      "shopeaseUser"
    );

    setUser(null);

    setOrderMessage("");
  };

  // =========================
  // CLOSE ORDER SUCCESS
  // =========================

  const closeOrderSuccess = () => {
    setOrderSuccess(false);
    setOrderMessage("");
    setLastOrderId("");
  };

  // =========================
  // RETURN UI
  // =========================

  return (
    <div className="app">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">

        <div className="logo">
          Shop<span>Ease</span>
        </div>

        <nav>
          <a href="#home">Home</a>

          <a href="#products">
            Products
          </a>

          <a href="#categories">
            Categories
          </a>

          <a href="#about">
            About
          </a>
        </nav>

        <div className="nav-actions">

          <button
            className="search-btn"
            onClick={() => {
              document
                .getElementById("product-search")
                ?.focus();

              document
                .getElementById("products")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
            title="Search products"
          >
            🔍
          </button>

          <button
            className="cart-btn"
            onClick={() => {
              setOrderMessage("");
              setShowCart(true);
            }}
          >
            🛒 Cart

            {totalItems > 0 && (
              <span className="cart-count">
                {totalItems}
              </span>
            )}
          </button>

          {user ? (
            <div className="user-area">

              <span>
                Hi, {user.name}
              </span>

              <button
                className="login-btn"
                onClick={fetchMyOrders}
              >
                My Orders
              </button>

              <button
                className="login-btn"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>
          ) : (
            <button
              className="login-btn"
              onClick={() => {
                setAuthMode("login");
                setAuthMessage("");
                setShowAuth(true);
              }}
            >
              Login
            </button>
          )}

        </div>

      </header>

      {/* =========================
          HERO
      ========================= */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <p className="hero-tag">
            WELCOME TO SHOPEASE
          </p>

          <h1>
            Shop Smart.
            <br />
            Live Better.
          </h1>

          <p>
            Discover quality products at
            great prices. Everything you
            need, all in one place.
          </p>

          <button
            className="shop-btn"
            onClick={() =>
              document
                .getElementById("products")
                .scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            Shop Now →
          </button>

        </div>

        <div className="hero-image">
          🛍️
        </div>

      </section>

      {/* =========================
          CATEGORIES
      ========================= */}

      <section
        className="categories"
        id="categories"
      >

        <h2>
          Shop by Category
        </h2>

        <div className="category-grid">

          <div className="category-card">
            <div>📱</div>

            <h3>
              Electronics
            </h3>

            <p>
              Latest gadgets & devices
            </p>
          </div>

          <div className="category-card">
            <div>👕</div>

            <h3>
              Fashion
            </h3>

            <p>
              Trendy styles for everyone
            </p>
          </div>

          <div className="category-card">
            <div>🏠</div>

            <h3>
              Home
            </h3>

            <p>
              Make your home beautiful
            </p>
          </div>

          <div className="category-card">
            <div>⚽</div>

            <h3>
              Sports
            </h3>

            <p>
              Gear up and stay active
            </p>
          </div>

        </div>

      </section>

      {/* =========================
          PRODUCTS
      ========================= */}

      <section
        className="products"
        id="products"
      >

        <div className="section-heading">

          <div>

            <p>
              OUR COLLECTION
            </p>

            <h2>
              Featured Products
            </h2>

          </div>

        </div>

        {/* SEARCH + CATEGORY FILTER */}

        {!productsLoading && !productsError && (
          <div
            style={{
              margin: "0 0 28px",
              padding: "18px",
              borderRadius: "16px",
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(220px, 1fr) minmax(180px, 240px) auto",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "18px",
                  }}
                >
                  🔍
                </span>

                <input
                  id="product-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "13px 42px 13px 42px",
                    border: "1px solid #d1d5db",
                    borderRadius: "10px",
                    outline: "none",
                    fontSize: "15px",
                    background: "#ffffff",
                    color: "#111827",
                    caretColor: "#111827",
                    WebkitTextFillColor: "#111827",
                  }}
                />

                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    title="Clear search"
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "#f3f4f6",
                      borderRadius: "50%",
                      width: "28px",
                      height: "28px",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "13px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "10px",
                  outline: "none",
                  fontSize: "15px",
                  background: "#ffffff",
                  cursor: "pointer",
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "All"
                      ? "All Categories"
                      : category}
                  </option>
                ))}
              </select>

              {(searchTerm || selectedCategory !== "All") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  style={{
                    padding: "13px 16px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#111827",
                    color: "#ffffff",
                    fontWeight: "600",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Reset
                </button>
              )}
            </div>

            <div
              style={{
                marginTop: "12px",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              Showing{" "}
              <strong style={{ color: "#111827" }}>
                {filteredProducts.length}
              </strong>{" "}
              of{" "}
              <strong style={{ color: "#111827" }}>
                {products.length}
              </strong>{" "}
              products
              {searchTerm && (
                <>
                  {" "}for <strong style={{ color: "#111827" }}>
                    "{searchTerm}"
                  </strong>
                </>
              )}
            </div>
          </div>
        )}

        {/* LOADING */}

        {productsLoading && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              fontSize: "18px",
            }}
          >
            Loading products...
          </div>
        )}

        {/* ERROR */}

        {!productsLoading &&
          productsError && (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "red",
                fontSize: "16px",
              }}
            >
              {productsError}
            </div>
          )}

        {/* EMPTY */}

        {!productsLoading &&
          !productsError &&
          products.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
              }}
            >
              No products available.
            </div>
          )}

        {!productsLoading &&
          !productsError &&
          products.length > 0 &&
          filteredProducts.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "50px 20px",
                borderRadius: "16px",
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>
                🔎
              </div>
              <h3 style={{ margin: "0 0 8px" }}>
                No products found
              </h3>
              <p style={{ color: "#6b7280", margin: 0 }}>
                Try a different search term or category.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                style={{
                  marginTop: "18px",
                  padding: "11px 18px",
                  border: "none",
                  borderRadius: "9px",
                  background: "#111827",
                  color: "#ffffff",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

        {/* PRODUCT GRID */}

        {!productsLoading &&
          !productsError &&
          filteredProducts.length > 0 && (
            <div className="product-grid">

              {filteredProducts.map(
                (product) => (
                  <div
                    className="product-card"
                    key={product.id}
                  >

                    <div className="product-image">
                      {product.emoji}
                    </div>

                    <span className="badge">
                      {product.badge}
                    </span>

                    <h3>
                      {product.name}
                    </h3>

                    <p className="product-description">
                      {product.description}
                    </p>

                    <div className="product-bottom">

                      <strong>
                        ₹
                        {Number(
                          product.price
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() =>
                            openProductDetails(product)
                          }
                          style={{
                            background: "#f3f4f6",
                            color: "#111827",
                          }}
                        >
                          View Details
                        </button>

                        <button
                          onClick={() =>
                            addToCart(product)
                          }
                        >
                          + Add
                        </button>
                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

      </section>

      {/* =========================
          PRODUCT DETAILS
      ========================= */}

      {selectedProduct && (
        <div
          onClick={closeProductDetails}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "rgba(15, 23, 42, 0.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(100%, 900px)",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: "20px",
              padding: "28px",
              boxSizing: "border-box",
              boxShadow: "0 25px 70px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <button
                onClick={closeProductDetails}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#4b5563",
                  fontSize: "16px",
                  cursor: "pointer",
                  padding: "8px 0",
                }}
              >
                ← Back to Products
              </button>

              <button
                onClick={closeProductDetails}
                aria-label="Close product details"
                style={{
                  width: "38px",
                  height: "38px",
                  border: "none",
                  borderRadius: "50%",
                  background: "#f3f4f6",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "minmax(240px, 1fr) minmax(280px, 1.2fr)",
              gap: "32px",
              alignItems: "center",
            }}>
              <div style={{
                minHeight: "330px",
                borderRadius: "18px",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "130px",
              }}>
                {selectedProduct.emoji || "🛍️"}
              </div>

              <div>
                <span style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  background: "#eef2ff",
                  color: "#4338ca",
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "12px",
                }}>
                  {selectedProduct.badge || selectedProduct.category || "PRODUCT"}
                </span>

                <h1 style={{ margin: "0 0 12px", fontSize: "34px", color: "#111827" }}>
                  {selectedProduct.name}
                </h1>

                <div style={{ fontSize: "30px", fontWeight: "800", color: "#111827", marginBottom: "18px" }}>
                  ₹{Number(selectedProduct.price || 0).toLocaleString("en-IN")}
                </div>

                <p style={{ color: "#4b5563", lineHeight: 1.7, fontSize: "16px", marginBottom: "18px" }}>
                  {selectedProduct.description || "No description available for this product."}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "22px" }}>
                  <span style={{ padding: "8px 12px", borderRadius: "8px", background: "#f3f4f6", color: "#374151", fontSize: "14px" }}>
                    Category: {selectedProduct.category || "General"}
                  </span>
                  <span style={{ padding: "8px 12px", borderRadius: "8px", background: selectedProduct.stock > 0 ? "#ecfdf5" : "#fef2f2", color: selectedProduct.stock > 0 ? "#047857" : "#b91c1c", fontSize: "14px" }}>
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : "Out of stock"}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
                  <span style={{ fontWeight: "700", color: "#374151" }}>Quantity</span>
                  <button
                    onClick={() => setDetailQuantity((q) => Math.max(1, q - 1))}
                    style={{ width: "36px", height: "36px", border: "1px solid #d1d5db", borderRadius: "8px", background: "#fff", cursor: "pointer", fontSize: "18px" }}
                  >−</button>
                  <strong style={{ minWidth: "28px", textAlign: "center" }}>{detailQuantity}</strong>
                  <button
                    onClick={() => setDetailQuantity((q) => q + 1)}
                    style={{ width: "36px", height: "36px", border: "1px solid #d1d5db", borderRadius: "8px", background: "#fff", cursor: "pointer", fontSize: "18px" }}
                  >+</button>
                </div>

                <button
                  onClick={addProductFromDetails}
                  disabled={Number(selectedProduct.stock) <= 0}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    border: "none",
                    borderRadius: "10px",
                    background: Number(selectedProduct.stock) <= 0 ? "#d1d5db" : "#111827",
                    color: "#ffffff",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: Number(selectedProduct.stock) <= 0 ? "not-allowed" : "pointer",
                  }}
                >
                  {Number(selectedProduct.stock) <= 0 ? "Out of Stock" : `Add ${detailQuantity} to Cart →`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          FOOTER
      ========================= */}

      <footer id="about">

        <h2>
          ShopEase
        </h2>

        <p>
          Smart shopping made simple.
        </p>

        <p>
          © 2026 ShopEase.
          All rights reserved.
        </p>

      </footer>

      {/* =========================
          CART OVERLAY
      ========================= */}

      {showCart && (
        <div
          className="cart-overlay"
          onClick={() =>
            setShowCart(false)
          }
        >

          <div
            className="cart-panel"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="cart-header">

              <h2>
                🛒 Your Cart
              </h2>

              <button
                className="close-cart"
                onClick={() =>
                  setShowCart(false)
                }
              >
                ✕
              </button>

            </div>

            {cart.length === 0 ? (

              <div className="empty-cart">

                <div>🛒</div>

                <h3>
                  Your cart is empty
                </h3>

                <p>
                  Add some products to
                  get started.
                </p>

              </div>

            ) : (

              <>

                <div className="cart-items">

                  {cart.map((item) => (

                    <div
                      className="cart-item"
                      key={item.id}
                    >

                      <div className="cart-item-image">
                        {item.emoji}
                      </div>

                      <div className="cart-item-info">

                        <h3>
                          {item.name}
                        </h3>

                        <p>
                          ₹
                          {Number(
                            item.price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <div className="quantity-controls">

                          <button
                            onClick={() =>
                              decreaseQuantity(
                                item.id
                              )
                            }
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(
                                item.id
                              )
                            }
                          >
                            +
                          </button>

                        </div>

                      </div>

                      <div className="cart-item-right">

                        <strong>
                          ₹
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                        <button
                          className="remove-btn"
                          onClick={() =>
                            removeFromCart(
                              item.id
                            )
                          }
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

                <div className="cart-summary">

                  <div>
                    <span>
                      Total Items
                    </span>

                    <strong>
                      {totalItems}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Total Price
                    </span>

                    <strong>
                      ₹
                      {totalPrice.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  {/* ORDER MESSAGE */}

                  {orderMessage && (
                    <div
                      style={{
                        marginTop: "15px",
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor:
                          orderSuccess
                            ? "#e8f8ee"
                            : "#fff3cd",
                        color:
                          orderSuccess
                            ? "#1b7a3a"
                            : "#856404",
                        fontSize: "14px",
                        textAlign: "center",
                      }}
                    >
                      {orderMessage}
                    </div>
                  )}

                  <button
                    className="checkout-btn"
                    onClick={
                      handleCheckout
                    }
                    disabled={
                      checkoutLoading
                    }
                    style={{
                      opacity:
                        checkoutLoading
                          ? 0.7
                          : 1,
                      cursor:
                        checkoutLoading
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {checkoutLoading
                      ? "Placing Order..."
                      : "Proceed to Checkout →"}
                  </button>

                  <button
                    className="clear-cart-btn"
                    onClick={clearCart}
                    disabled={
                      checkoutLoading
                    }
                  >
                    Clear Cart
                  </button>

                </div>

              </>

            )}

          </div>

        </div>
      )}

      {/* =========================
          ORDER SUCCESS MODAL
      ========================= */}

      {orderSuccess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0, 0, 0, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "20px",
          }}
        >

          <div
            style={{
              background: "#ffffff",
              width: "100%",
              maxWidth: "430px",
              borderRadius: "18px",
              padding: "35px 25px",
              textAlign: "center",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >

            <div
              style={{
                fontSize: "55px",
                marginBottom: "10px",
              }}
            >
              🎉
            </div>

            <h2
              style={{
                marginBottom: "10px",
              }}
            >
              Order Placed Successfully!
            </h2>

            <p
              style={{
                color: "#666",
                lineHeight: "1.6",
              }}
            >
              Thank you for shopping with
              ShopEase. Your order has been
              successfully saved.
            </p>

            {lastOrderId && (
              <div
                style={{
                  marginTop: "18px",
                  padding: "12px",
                  background: "#f5f5f5",
                  borderRadius: "8px",
                  fontSize: "13px",
                  wordBreak: "break-all",
                }}
              >
                <strong>
                  Order ID:
                </strong>
                <br />
                {lastOrderId}
              </div>
            )}

            <button
              onClick={closeOrderSuccess}
              style={{
                marginTop: "22px",
                width: "100%",
                padding: "13px",
                border: "none",
                borderRadius: "8px",
                background:
                  "#111827",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Continue Shopping
            </button>

          </div>

        </div>
      )}

      {/* =========================
          MY ORDERS MODAL
      ========================= */}

      {showOrders && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1900,
            padding: "20px",
          }}
          onClick={() => setShowOrders(false)}
        >
          <div
            style={{
              background: "#ffffff",
              width: "100%",
              maxWidth: "850px",
              maxHeight: "85vh",
              overflowY: "auto",
              borderRadius: "18px",
              padding: "28px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "22px",
              }}
            >
              <div>
                <h2 style={{ margin: 0 }}>📦 My Orders</h2>
                <p style={{ margin: "6px 0 0", color: "#666" }}>
                  View your previous ShopEase orders
                </p>
              </div>

              <button
                onClick={() => setShowOrders(false)}
                style={{
                  border: "none",
                  background: "#f1f1f1",
                  borderRadius: "50%",
                  width: "38px",
                  height: "38px",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                ✕
              </button>
            </div>

            {ordersLoading && (
              <div style={{ textAlign: "center", padding: "40px" }}>
                Loading your orders...
              </div>
            )}

            {!ordersLoading && ordersError && (
              <div
                style={{
                  padding: "15px",
                  borderRadius: "10px",
                  background: "#fff3cd",
                  color: "#856404",
                  textAlign: "center",
                }}
              >
                {ordersError}
              </div>
            )}

            {!ordersLoading &&
              !ordersError &&
              orders.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "45px 20px",
                  }}
                >
                  <div style={{ fontSize: "50px" }}>📦</div>
                  <h3>No orders yet</h3>
                  <p style={{ color: "#666" }}>
                    Your completed orders will appear here.
                  </p>
                </div>
              )}

            {!ordersLoading &&
              !ordersError &&
              orders.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      style={{
                        border: "1px solid #e5e5e5",
                        borderRadius: "12px",
                        padding: "18px",
                        background: "#fafafa",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "15px",
                          flexWrap: "wrap",
                          marginBottom: "12px",
                        }}
                      >
                        <div>
                          <strong>Order ID</strong>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginTop: "4px",
                              wordBreak: "break-all",
                            }}
                          >
                            {order._id}
                          </div>
                        </div>

                        <div
                          style={{
                            padding: "7px 12px",
                            borderRadius: "20px",
                            background: "#fff3cd",
                            color: "#856404",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          {order.status || "Pending"}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(150px, 1fr))",
                          gap: "10px",
                          marginBottom: "15px",
                        }}
                      >
                        <div>
                          <span style={{ color: "#777", fontSize: "13px" }}>
                            Date
                          </span>
                          <div style={{ fontWeight: "600" }}>
                            {new Date(
                              order.createdAt
                            ).toLocaleDateString("en-IN")}
                          </div>
                        </div>

                        <div>
                          <span style={{ color: "#777", fontSize: "13px" }}>
                            Items
                          </span>
                          <div style={{ fontWeight: "600" }}>
                            {order.items.reduce(
                              (sum, item) => sum + item.quantity,
                              0
                            )}
                          </div>
                        </div>

                        <div>
                          <span style={{ color: "#777", fontSize: "13px" }}>
                            Total
                          </span>
                          <div style={{ fontWeight: "700" }}>
                            ₹
                            {Number(
                              order.totalAmount
                            ).toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          borderTop: "1px solid #e5e5e5",
                          paddingTop: "12px",
                        }}
                      >
                        {order.items.map((item, index) => (
                          <div
                            key={`${order._id}-${index}`}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: "15px",
                              padding: "6px 0",
                              fontSize: "14px",
                            }}
                          >
                            <span>
                              {item.name} × {item.quantity}
                            </span>

                            <strong>
                              ₹
                              {(
                                item.price * item.quantity
                              ).toLocaleString("en-IN")}
                            </strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            <button
              onClick={fetchMyOrders}
              disabled={ordersLoading}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                background: "#111827",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: "600",
                cursor: ordersLoading ? "not-allowed" : "pointer",
                opacity: ordersLoading ? 0.7 : 1,
              }}
            >
              {ordersLoading ? "Refreshing..." : "Refresh Orders"}
            </button>
          </div>
        </div>
      )}

      {/* =========================
          LOGIN / REGISTER MODAL
      ========================= */}

      {showAuth && (
        <div
          className="auth-overlay"
          onClick={() =>
            setShowAuth(false)
          }
        >

          <div
            className="auth-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="auth-close"
              onClick={() =>
                setShowAuth(false)
              }
            >
              ✕
            </button>

            <h2>
              {authMode === "login"
                ? "Welcome Back 👋"
                : "Create Account"}
            </h2>

            <p>
              {authMode === "login"
                ? "Login to continue shopping"
                : "Join ShopEase today"}
            </p>

            <form
              onSubmit={handleAuth}
            >

              {authMode ===
                "register" && (
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={
                  formData.email
                }
                onChange={
                  handleInputChange
                }
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={
                  formData.password
                }
                onChange={
                  handleInputChange
                }
                required
              />

              {authMessage && (
                <p className="auth-message">
                  {authMessage}
                </p>
              )}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : authMode ===
                    "login"
                  ? "Login"
                  : "Create Account"}
              </button>

            </form>

            <div className="auth-switch">

              {authMode === "login" ? (
                <>
                  Don't have an account?{" "}

                  <button
                    onClick={() => {
                      setAuthMode(
                        "register"
                      );
                      setAuthMessage("");
                    }}
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}

                  <button
                    onClick={() => {
                      setAuthMode(
                        "login"
                      );
                      setAuthMessage("");
                    }}
                  >
                    Login
                  </button>
                </>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;