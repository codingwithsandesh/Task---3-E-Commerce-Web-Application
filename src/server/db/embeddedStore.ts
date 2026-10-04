import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, Category, Product, CartItem, Order, OrderItem, OrderStatusHistory, OrderStatus, ProductReview, ReviewsResponseData } from '../../types/index.js';

interface RawCart {
  id: string;
  user_id: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
}

interface RawCartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

interface DBState {
  users: Array<User & { password_hash: string }>;
  categories: Category[];
  products: Product[];
  carts: RawCart[];
  cart_items: RawCartItem[];
  orders: Order[];
  order_items: OrderItem[];
  order_status_history: OrderStatusHistory[];
  product_reviews: ProductReview[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'shopsphere_store.json');

export class EmbeddedStore {
  private state: DBState = {
    users: [],
    categories: [],
    products: [],
    carts: [],
    cart_items: [],
    orders: [],
    order_items: [],
    order_status_history: [],
    product_reviews: [],
  };

  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.state = JSON.parse(raw);
        if (!this.state.product_reviews || this.state.product_reviews.length === 0) {
          this.state.product_reviews = this.getSeedReviews();
          this.persist();
        }
        this.initialized = true;
      } else {
        this.seedInitialData();
        this.persist();
        this.initialized = true;
      }
    } catch (err) {
      console.error('[EmbeddedStore] Failed reading data file, re-seeding:', err);
      this.seedInitialData();
      this.persist();
      this.initialized = true;
    }
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (err) {
      console.error('[EmbeddedStore] Persist error:', err);
    }
  }

  private seedInitialData() {
    const passwordHash = bcrypt.hashSync('Admin@123', 10);
    const customerPasswordHash = bcrypt.hashSync('Customer@123', 10);

    const now = new Date().toISOString();
    const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();
    const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString();

    const users: Array<User & { password_hash: string }> = [
      {
        id: 'usr-admin-001',
        name: 'Alex Mercer (Admin)',
        email: 'admin@shopsphere.com',
        password_hash: passwordHash,
        role: 'admin',
        is_active: 1,
        created_at: daysAgo(30),
        updated_at: daysAgo(30),
      },
      {
        id: 'usr-cust-001',
        name: 'Sandesh Heda',
        email: 'customer@shopsphere.com',
        password_hash: customerPasswordHash,
        role: 'customer',
        is_active: 1,
        created_at: daysAgo(20),
        updated_at: daysAgo(20),
      },
      {
        id: 'usr-cust-002',
        name: 'Sarah Jenkins',
        email: 'sarah.j@example.com',
        password_hash: customerPasswordHash,
        role: 'customer',
        is_active: 1,
        created_at: daysAgo(10),
        updated_at: daysAgo(10),
      },
    ];

    const categories: Category[] = [
      {
        id: 'cat-elec',
        name: 'Electronics',
        slug: 'electronics',
        description: 'Cutting-edge gadgets, computing gear, smart displays and modern tech essentials.',
        image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80',
        created_at: now,
      },
      {
        id: 'cat-audio',
        name: 'Audio & Wearables',
        slug: 'audio-wearables',
        description: 'High-fidelity headphones, noise-canceling earbuds, and health-tracking smart wearables.',
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        created_at: now,
      },
      {
        id: 'cat-apparel',
        name: 'Fashion & Apparel',
        slug: 'fashion-apparel',
        description: 'Contemporary everyday apparel, breathable outerwear, premium knitwear and stylish accessories.',
        image_url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
        created_at: now,
      },
      {
        id: 'cat-home',
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Artisanal homeware, minimalist workspace decor, ergonomic lights and kitchen craft.',
        image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
        created_at: now,
      },
      {
        id: 'cat-acc',
        name: 'Accessories',
        slug: 'accessories',
        description: 'Durable leather goods, minimalist carry backpacks, sunglasses and everyday carry tools.',
        image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
        created_at: now,
      },
    ];

    const products: Product[] = [
      {
        id: 'prod-001',
        category_id: 'cat-audio',
        category_name: 'Audio & Wearables',
        category_slug: 'audio-wearables',
        name: 'AuraWave Wireless ANC Headphones',
        slug: 'aurawave-wireless-anc-headphones',
        description: 'Precision acoustic engineering with active noise cancellation, 40-hour battery life, ultra-plush memory foam earcups, and dual beamforming microphones for crystal-clear calls.',
        price: 19999.00,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 38,
        is_active: 1,
        is_featured: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-002',
        category_id: 'cat-audio',
        category_name: 'Audio & Wearables',
        category_slug: 'audio-wearables',
        name: 'SonicPulse Pro Earbuds',
        slug: 'sonicpulse-pro-earbuds',
        description: 'True wireless earbuds with spatial audio tracking, transparency mode, IPX7 water resistance, and rapid wireless charging case.',
        price: 8999.00,
        image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 50,
        is_active: 1,
        is_featured: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-003',
        category_id: 'cat-audio',
        category_name: 'Audio & Wearables',
        category_slug: 'audio-wearables',
        name: 'PulseFit Smart Fitness Tracker',
        slug: 'pulsefit-smart-fitness-tracker',
        description: 'All-day heart rate, SpO2, sleep cycle tracker, AMOLED touch display, and 14-day battery life in a lightweight ceramic casing.',
        price: 4999.00,
        image_url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 25,
        is_active: 1,
        is_featured: 0,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-004',
        category_id: 'cat-audio',
        category_name: 'Audio & Wearables',
        category_slug: 'audio-wearables',
        name: 'AcousticStudio Desktop Monitors',
        slug: 'acousticstudio-desktop-monitors',
        description: 'Studio-grade reference audio monitors with silk dome tweeters, woven composite woofers, and Bluetooth 5.3 multi-device pairing.',
        price: 14999.00,
        image_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 14,
        is_active: 1,
        is_featured: 0,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-005',
        category_id: 'cat-elec',
        category_name: 'Electronics',
        category_slug: 'electronics',
        name: 'LumixPro 4K Ultra-Wide Monitor 34"',
        slug: 'lumixpro-4k-ultrawide-monitor-34',
        description: 'Curved 3440x1440 IPS panel with 144Hz refresh rate, USB-C 90W power delivery, HDR400, and factory color calibration.',
        price: 49999.00,
        image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 12,
        is_active: 1,
        is_featured: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-006',
        category_id: 'cat-elec',
        category_name: 'Electronics',
        category_slug: 'electronics',
        name: 'KeyCraft Minimalist Mechanical Keyboard',
        slug: 'keycraft-minimalist-mechanical-keyboard',
        description: 'Custom hot-swappable tactile switches, frosted aluminum chassis, PBT double-shot keycaps, and custom RGB underglow.',
        price: 9999.00,
        image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 42,
        is_active: 1,
        is_featured: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-007',
        category_id: 'cat-elec',
        category_name: 'Electronics',
        category_slug: 'electronics',
        name: 'ErgoGlide Precision Wireless Mouse',
        slug: 'ergoglide-precision-wireless-mouse',
        description: 'Ergonomic vertical contouring designed by physical therapists, 4000 DPI sensor, silent optical switches, and hyper-fast scroll.',
        price: 4499.00,
        image_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 60,
        is_active: 1,
        is_featured: 0,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-008',
        category_id: 'cat-elec',
        category_name: 'Electronics',
        category_slug: 'electronics',
        name: 'NovaDock 10-in-1 Thunderbolt 4 Hub',
        slug: 'novadock-10-in-1-thunderbolt-4-hub',
        description: 'Dual 4K display output, 100W PD pass-through charging, Gigabit Ethernet, UHS-II SD card reader, and audio in/out.',
        price: 11999.00,
        image_url: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 20,
        is_active: 1,
        is_featured: 0,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-009',
        category_id: 'cat-apparel',
        category_name: 'Fashion & Apparel',
        category_slug: 'fashion-apparel',
        name: 'Merino Wool Minimalist Crewneck',
        slug: 'merino-wool-minimalist-crewneck',
        description: '100% extra-fine Australian merino wool with natural temperature regulation, moisture wicking, and odor-resistant comfort.',
        price: 5999.00,
        image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 30,
        is_active: 1,
        is_featured: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-010',
        category_id: 'cat-apparel',
        category_name: 'Fashion & Apparel',
        category_slug: 'fashion-apparel',
        name: 'WeatherShield All-Weather Technical Jacket',
        slug: 'weathershield-technical-jacket',
        description: 'Three-layer waterproof breathable shell, sealed taped seams, magnetic cuff closures, and ergonomic articulated sleeves.',
        price: 12999.00,
        image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 18,
        is_active: 1,
        is_featured: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-011',
        category_id: 'cat-apparel',
        category_name: 'Fashion & Apparel',
        category_slug: 'fashion-apparel',
        name: 'Everyday Organic Oxford Cotton Shirt',
        slug: 'everyday-organic-oxford-cotton-shirt',
        description: 'Pre-washed sustainable organic cotton shirt with structured button-down collar and relaxed modern silhouette.',
        price: 3499.00,
        image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 45,
        is_active: 1,
        is_featured: 0,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-012',
        category_id: 'cat-apparel',
        category_name: 'Fashion & Apparel',
        category_slug: 'fashion-apparel',
        name: 'AeroKnit Breathable Everyday Sneakers',
        slug: 'aeroknit-breathable-everyday-sneakers',
        description: 'Featherlight seamless knitted upper, responsive EVA cushioning midsole, and grippy recycled rubber outsole.',
        price: 6999.00,
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 32,
        is_active: 1,
        is_featured: 0,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-013',
        category_id: 'cat-home',
        category_name: 'Home & Living',
        category_slug: 'home-living',
        name: 'Artisan Handcrafted Ceramic Pour-Over Set',
        slug: 'artisan-ceramic-pour-over-set',
        description: 'Matte-glazed stoneware cone dripper and 600ml glass server engineered for optimal thermal stability and extraction balance.',
        price: 2999.00,
        image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 22,
        is_active: 1,
        is_featured: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-014',
        category_id: 'cat-home',
        category_name: 'Home & Living',
        category_slug: 'home-living',
        name: 'Nordic Solid Walnut Desk Organizer',
        slug: 'nordic-solid-walnut-desk-organizer',
        description: 'Sustainably sourced North American walnut wood with magnetic cable channels, pen trough, and phone docking groove.',
        price: 4299.00,
        image_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 15,
        is_active: 1,
        is_featured: 0,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-015',
        category_id: 'cat-home',
        category_name: 'Home & Living',
        category_slug: 'home-living',
        name: 'Lumina Ambient LED Desk Lamp',
        slug: 'lumina-ambient-led-desk-lamp',
        description: 'Adjustable dual color temperature, touch-sensitive slide dimming, USB charging port, and flicker-free eye-care illumination.',
        price: 5499.00,
        image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 28,
        is_active: 1,
        is_featured: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-016',
        category_id: 'cat-home',
        category_name: 'Home & Living',
        category_slug: 'home-living',
        name: 'Botanical Soy Wax Scented Candle Trio',
        slug: 'botanical-soy-wax-candle-trio',
        description: 'Hand-poured 100% natural soy wax featuring Cedarwood & Bergamot, Wild Fig & Olive, and Smoked Amber.',
        price: 2499.00,
        image_url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 40,
        is_active: 1,
        is_featured: 0,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-017',
        category_id: 'cat-acc',
        category_name: 'Accessories',
        category_slug: 'accessories',
        name: 'Vanguard Full-Grain Leather Weekender',
        slug: 'vanguard-full-grain-leather-weekender',
        description: 'Vegetable-tanned full-grain leather duffel bag with dedicated padded 16-inch laptop compartment and brass YKK hardware.',
        price: 18999.00,
        image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 8,
        is_active: 1,
        is_featured: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-018',
        category_id: 'cat-acc',
        category_name: 'Accessories',
        category_slug: 'accessories',
        name: 'Modula Waterproof Urban Commuter Backpack',
        slug: 'modula-waterproof-commuter-backpack',
        description: 'Weatherproof tarpaulin and 840D ballistic nylon, modular internal divider system, and hidden anti-theft passport pocket.',
        price: 7999.00,
        image_url: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 35,
        is_active: 1,
        is_featured: 0,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-019',
        category_id: 'cat-acc',
        category_name: 'Accessories',
        category_slug: 'accessories',
        name: 'Apex Titanium Minimalist Slim Wallet',
        slug: 'apex-titanium-minimalist-slim-wallet',
        description: 'Grade 5 aerospace titanium RFID-blocking cardholder with integrated money clip and quick-draw thumb slot.',
        price: 3499.00,
        image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 55,
        is_active: 1,
        is_featured: 0,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prod-020',
        category_id: 'cat-acc',
        category_name: 'Accessories',
        category_slug: 'accessories',
        name: 'Solarium Polarized Acetate Sunglasses',
        slug: 'solarium-polarized-acetate-sunglasses',
        description: 'Handcrafted Italian Mazzucchelli acetate frames with Category 3 100% UV400 polarized mineral glass lenses.',
        price: 6499.00,
        image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
        stock_quantity: 24,
        is_active: 1,
        is_featured: 0,
        created_at: now,
        updated_at: now,
      },
    ];

    const orders: Order[] = [
      {
        id: 'ord-001',
        order_number: 'ORD-2026-10492',
        user_id: 'usr-cust-001',
        customer_name: 'Sandesh Heda',
        customer_email: 'customer@shopsphere.com',
        shipping_address: 'Flat 402, Sunshine Residency, MG Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postal_code: '560001',
        country: 'India',
        subtotal: 28998.00,
        shipping_cost: 0.00,
        total_amount: 28998.00,
        payment_method: 'Cash on Delivery',
        payment_status: 'paid',
        order_status: 'Delivered',
        created_at: daysAgo(5),
        updated_at: daysAgo(1),
      },
      {
        id: 'ord-002',
        order_number: 'ORD-2026-10834',
        user_id: 'usr-cust-001',
        customer_name: 'Sandesh Heda',
        customer_email: 'customer@shopsphere.com',
        shipping_address: 'Flat 402, Sunshine Residency, MG Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postal_code: '560001',
        country: 'India',
        subtotal: 8999.00,
        shipping_cost: 0.00,
        total_amount: 8999.00,
        payment_method: 'Cash on Delivery',
        payment_status: 'unpaid',
        order_status: 'Shipped',
        created_at: daysAgo(2),
        updated_at: now,
      },
      {
        id: 'ord-003',
        order_number: 'ORD-2026-11205',
        user_id: 'usr-cust-002',
        customer_name: 'Sarah Jenkins',
        customer_email: 'sarah.j@example.com',
        shipping_address: '124 Marine Drive, Nariman Point',
        city: 'Mumbai',
        state: 'Maharashtra',
        postal_code: '400021',
        country: 'India',
        subtotal: 18999.00,
        shipping_cost: 0.00,
        total_amount: 18999.00,
        payment_method: 'Cash on Delivery',
        payment_status: 'unpaid',
        order_status: 'Processing',
        created_at: hoursAgo(6),
        updated_at: now,
      },
    ];

    const order_items: OrderItem[] = [
      {
        id: 'item-001',
        order_id: 'ord-001',
        product_id: 'prod-001',
        product_name: 'AuraWave Wireless ANC Headphones',
        unit_price: 19999.00,
        quantity: 1,
        line_total: 19999.00,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'item-002',
        order_id: 'ord-001',
        product_id: 'prod-002',
        product_name: 'SonicPulse Pro Earbuds',
        unit_price: 8999.00,
        quantity: 1,
        line_total: 8999.00,
        image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'item-003',
        order_id: 'ord-002',
        product_id: 'prod-002',
        product_name: 'SonicPulse Pro Earbuds',
        unit_price: 8999.00,
        quantity: 1,
        line_total: 8999.00,
        image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'item-004',
        order_id: 'ord-003',
        product_id: 'prod-017',
        product_name: 'Vanguard Full-Grain Leather Weekender',
        unit_price: 18999.00,
        quantity: 1,
        line_total: 18999.00,
        image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      },
    ];

    const order_status_history: OrderStatusHistory[] = [
      {
        id: 'hist-001',
        order_id: 'ord-001',
        previous_status: null,
        new_status: 'Pending',
        changed_by: 'System',
        note: 'Order placed by customer',
        created_at: daysAgo(5),
      },
      {
        id: 'hist-002',
        order_id: 'ord-001',
        previous_status: 'Pending',
        new_status: 'Confirmed',
        changed_by: 'Alex Mercer (Admin)',
        note: 'Payment terms confirmed',
        created_at: daysAgo(4),
      },
      {
        id: 'hist-003',
        order_id: 'ord-001',
        previous_status: 'Confirmed',
        new_status: 'Shipped',
        changed_by: 'Alex Mercer (Admin)',
        note: 'Dispatched via Express Courier (AWB #SP-99824)',
        created_at: daysAgo(2),
      },
      {
        id: 'hist-004',
        order_id: 'ord-001',
        previous_status: 'Shipped',
        new_status: 'Delivered',
        changed_by: 'Alex Mercer (Admin)',
        note: 'Package signed by recipient',
        created_at: daysAgo(1),
      },
      {
        id: 'hist-005',
        order_id: 'ord-002',
        previous_status: null,
        new_status: 'Pending',
        changed_by: 'System',
        note: 'Order placed by customer',
        created_at: daysAgo(2),
      },
      {
        id: 'hist-006',
        order_id: 'ord-002',
        previous_status: 'Pending',
        new_status: 'Confirmed',
        changed_by: 'Alex Mercer (Admin)',
        note: 'Confirmed and sent to fulfillment',
        created_at: daysAgo(1),
      },
      {
        id: 'hist-007',
        order_id: 'ord-002',
        previous_status: 'Confirmed',
        new_status: 'Shipped',
        changed_by: 'Alex Mercer (Admin)',
        note: 'In transit with tracking #SP-44912',
        created_at: now,
      },
      {
        id: 'hist-008',
        order_id: 'ord-003',
        previous_status: null,
        new_status: 'Pending',
        changed_by: 'System',
        note: 'Order placed by customer',
        created_at: hoursAgo(6),
      },
      {
        id: 'hist-009',
        order_id: 'ord-003',
        previous_status: 'Pending',
        new_status: 'Processing',
        changed_by: 'Alex Mercer (Admin)',
        note: 'Packaging fragile leather item',
        created_at: hoursAgo(2),
      },
    ];

    this.state = {
      users,
      categories,
      products,
      carts: [],
      cart_items: [],
      orders,
      order_items,
      order_status_history,
      product_reviews: this.getSeedReviews(),
    };
  }

  private getSeedReviews(): ProductReview[] {
    const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();
    return [
      {
        id: 'rev-001',
        product_id: 'prod-001',
        user_id: 'usr-cust-001',
        user_name: 'Sandesh Heda',
        rating: 5,
        comment: 'Exceptional build quality and sound stage. The active noise cancellation easily drowns out coffee shop chatter and airplane hum. Battery life exceeds expectations!',
        created_at: daysAgo(4),
      },
      {
        id: 'rev-002',
        product_id: 'prod-001',
        user_id: 'usr-cust-002',
        user_name: 'Sarah Jenkins',
        rating: 4,
        comment: 'Very comfortable memory foam earcups even during 6-hour video call sessions. Fast USB-C charging too.',
        created_at: daysAgo(2),
      },
      {
        id: 'rev-003',
        product_id: 'prod-002',
        user_id: 'usr-cust-001',
        user_name: 'Sandesh Heda',
        rating: 5,
        comment: 'Tremendous bass clarity and seamless Bluetooth pairing with both my laptop and phone.',
        created_at: daysAgo(3),
      },
      {
        id: 'rev-004',
        product_id: 'prod-005',
        user_id: 'usr-cust-002',
        user_name: 'Sarah Jenkins',
        rating: 5,
        comment: 'The 34-inch curved ultra-wide display has dramatically improved my multitasking efficiency. 90W USB-C power delivery keeps my desk cable-free.',
        created_at: daysAgo(6),
      },
      {
        id: 'rev-005',
        product_id: 'prod-006',
        user_id: 'usr-cust-001',
        user_name: 'Sandesh Heda',
        rating: 5,
        comment: 'Crisp tactile feedback on the mechanical switches and solid aluminum chassis weight. Highly recommended!',
        created_at: daysAgo(5),
      },
      {
        id: 'rev-006',
        product_id: 'prod-017',
        user_id: 'usr-cust-002',
        user_name: 'Sarah Jenkins',
        rating: 5,
        comment: 'The full-grain leather smells amazing and feels durable. Fits a 16-inch laptop snugly with plenty of room for weekend clothing.',
        created_at: daysAgo(1),
      },
    ];
  }

  // --- Users ---
  findUserByEmail(email: string): (User & { password_hash: string }) | undefined {
    return this.state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): User | undefined {
    const user = this.state.users.find(u => u.id === id);
    if (!user) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...rest } = user;
    return rest;
  }

  createUser(userData: { name: string; email: string; password_hash: string; role?: 'customer' | 'admin' }): User {
    const newUser: User & { password_hash: string } = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password_hash: userData.password_hash,
      role: userData.role || 'customer',
      is_active: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.state.users.push(newUser);
    this.persist();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...rest } = newUser;
    return rest;
  }

  listUsers(search?: string): User[] {
    let users = this.state.users.map(u => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...rest } = u;
      return rest;
    });

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return users;
  }

  updateUserStatus(id: string, is_active: number): { success: boolean; message?: string; user?: User } {
    const user = this.state.users.find(u => u.id === id);
    if (!user) return { success: false, message: 'User not found' };

    // Prevent deactivating the last active admin
    if (user.role === 'admin' && is_active === 0) {
      const activeAdmins = this.state.users.filter(u => u.role === 'admin' && Number(u.is_active) === 1);
      if (activeAdmins.length <= 1) {
        return { success: false, message: 'Cannot deactivate the last active administrator account' };
      }
    }

    user.is_active = is_active;
    user.updated_at = new Date().toISOString();
    this.persist();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...rest } = user;
    return { success: true, user: rest };
  }

  // --- Categories ---
  listCategories(): Category[] {
    return this.state.categories.map(cat => ({
      ...cat,
      product_count: this.state.products.filter(p => p.category_id === cat.id && Number(p.is_active) === 1).length,
    }));
  }

  findCategoryById(id: string): Category | undefined {
    return this.state.categories.find(c => c.id === id);
  }

  findCategoryBySlug(slug: string): Category | undefined {
    return this.state.categories.find(c => c.slug === slug);
  }

  // --- Products ---
  listProducts(options: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    inStockOnly?: boolean;
    page?: number;
    limit?: number;
    includeInactive?: boolean;
    featured?: boolean;
  } = {}): { products: Product[]; total: number; page: number; limit: number; totalPages: number } {
    let items = [...this.state.products];

    // Filter inactive products unless requested by admin
    if (!options.includeInactive) {
      items = items.filter(p => Number(p.is_active) === 1);
    }

    if (options.featured) {
      items = items.filter(p => Number(p.is_featured) === 1);
    }

    // Category filter by id or slug
    if (options.category && options.category !== 'all') {
      const cat = this.state.categories.find(c => c.id === options.category || c.slug === options.category);
      if (cat) {
        items = items.filter(p => p.category_id === cat.id);
      }
    }

    // Search filter
    if (options.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      items = items.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Price range
    if (options.minPrice !== undefined && !isNaN(options.minPrice)) {
      items = items.filter(p => p.price >= options.minPrice!);
    }
    if (options.maxPrice !== undefined && !isNaN(options.maxPrice)) {
      items = items.filter(p => p.price <= options.maxPrice!);
    }

    // In stock only
    if (options.inStockOnly) {
      items = items.filter(p => p.stock_quantity > 0);
    }

    // Sorting
    switch (options.sortBy) {
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        items.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        items.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        break;
    }

    const total = items.length;
    const page = options.page || 1;
    const limit = options.limit || 12;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    // Enrich with category name and review ratings
    const enriched = paginatedItems.map(p => {
      const cat = this.state.categories.find(c => c.id === p.category_id);
      const reviews = (this.state.product_reviews || []).filter(r => r.product_id === p.id);
      const review_count = reviews.length;
      const average_rating =
        review_count > 0
          ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / review_count).toFixed(1))
          : 0;

      return {
        ...p,
        category_name: cat ? cat.name : p.category_name,
        category_slug: cat ? cat.slug : p.category_slug,
        average_rating,
        review_count,
      };
    });

    return {
      products: enriched,
      total,
      page,
      limit,
      totalPages,
    };
  }

  findProductByIdOrSlug(idOrSlug: string): Product | undefined {
    const p = this.state.products.find(item => item.id === idOrSlug || item.slug === idOrSlug);
    if (!p) return undefined;
    const cat = this.state.categories.find(c => c.id === p.category_id);
    const reviews = (this.state.product_reviews || []).filter(r => r.product_id === p.id);
    const review_count = reviews.length;
    const average_rating =
      review_count > 0
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / review_count).toFixed(1))
        : 0;

    return {
      ...p,
      category_name: cat ? cat.name : p.category_name,
      category_slug: cat ? cat.slug : p.category_slug,
      average_rating,
      review_count,
    };
  }

  createProduct(data: {
    category_id: string;
    name: string;
    slug?: string;
    description: string;
    price: number;
    image_url: string;
    stock_quantity: number;
    is_active?: number;
    is_featured?: number;
  }): Product {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProduct: Product = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      category_id: data.category_id,
      name: data.name,
      slug,
      description: data.description,
      price: Number(data.price),
      image_url: data.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      stock_quantity: Math.max(0, Number(data.stock_quantity)),
      is_active: data.is_active !== undefined ? Number(data.is_active) : 1,
      is_featured: data.is_featured !== undefined ? Number(data.is_featured) : 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const cat = this.state.categories.find(c => c.id === newProduct.category_id);
    newProduct.category_name = cat?.name;
    newProduct.category_slug = cat?.slug;

    this.state.products.unshift(newProduct);
    this.persist();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const idx = this.state.products.findIndex(p => p.id === id);
    if (idx === -1) return undefined;

    const existing = this.state.products[idx];
    const updated: Product = {
      ...existing,
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : existing.price,
      stock_quantity: updates.stock_quantity !== undefined ? Math.max(0, Number(updates.stock_quantity)) : existing.stock_quantity,
      updated_at: new Date().toISOString(),
    };

    if (updates.category_id) {
      const cat = this.state.categories.find(c => c.id === updates.category_id);
      updated.category_name = cat?.name;
      updated.category_slug = cat?.slug;
    }

    this.state.products[idx] = updated;
    this.persist();
    return updated;
  }

  deleteProduct(id: string): { success: boolean; message?: string } {
    const idx = this.state.products.findIndex(p => p.id === id);
    if (idx === -1) return { success: false, message: 'Product not found' };

    // Check if product is in active orders
    const hasOrders = this.state.order_items.some(item => item.product_id === id);
    if (hasOrders) {
      // Soft-delete to preserve order history integrity
      this.state.products[idx].is_active = 0;
      this.state.products[idx].updated_at = new Date().toISOString();
      this.persist();
      return { success: true, message: 'Product is referenced in previous orders; it has been archived (set to inactive).' };
    }

    this.state.products.splice(idx, 1);
    this.persist();
    return { success: true, message: 'Product permanently removed.' };
  }

  // --- Carts ---
  getOrCreateCart(userId?: string, sessionId?: string): RawCart {
    let cart: RawCart | undefined;
    if (userId) {
      cart = this.state.carts.find(c => c.user_id === userId);
    } else if (sessionId) {
      cart = this.state.carts.find(c => c.session_id === sessionId);
    }

    if (!cart) {
      cart = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        user_id: userId || null,
        session_id: sessionId || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.state.carts.push(cart);
      this.persist();
    }
    return cart;
  }

  getCartItems(cartId: string): CartItem[] {
    const rawItems = this.state.cart_items.filter(item => item.cart_id === cartId);
    const result: CartItem[] = [];

    for (const item of rawItems) {
      const product = this.findProductByIdOrSlug(item.product_id);
      if (product && Number(product.is_active) === 1) {
        result.push({
          id: item.id,
          cart_id: item.cart_id,
          product_id: item.product_id,
          quantity: item.quantity,
          product,
        });
      }
    }
    return result;
  }

  addToCart(cartId: string, productId: string, quantity: number): { success: boolean; message?: string; item?: CartItem } {
    const product = this.findProductByIdOrSlug(productId);
    if (!product || Number(product.is_active) !== 1) {
      return { success: false, message: 'Product is unavailable' };
    }

    if (product.stock_quantity <= 0) {
      return { success: false, message: 'Product is currently out of stock' };
    }

    let existing = this.state.cart_items.find(i => i.cart_id === cartId && i.product_id === productId);
    const newQty = existing ? existing.quantity + quantity : quantity;

    if (newQty > product.stock_quantity) {
      return {
        success: false,
        message: `Only ${product.stock_quantity} units available in stock. Cannot add requested quantity.`,
      };
    }

    if (existing) {
      existing.quantity = newQty;
      existing.updated_at = new Date().toISOString();
    } else {
      existing = {
        id: `citem-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        cart_id: cartId,
        product_id: productId,
        quantity: Math.max(1, quantity),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.state.cart_items.push(existing);
    }

    this.persist();
    return {
      success: true,
      item: {
        id: existing.id,
        cart_id: existing.cart_id,
        product_id: existing.product_id,
        quantity: existing.quantity,
        product,
      },
    };
  }

  updateCartItemQuantity(cartId: string, itemId: string, quantity: number): { success: boolean; message?: string } {
    const item = this.state.cart_items.find(i => i.id === itemId && i.cart_id === cartId);
    if (!item) return { success: false, message: 'Cart item not found' };

    if (quantity <= 0) {
      return this.removeCartItem(cartId, itemId);
    }

    const product = this.findProductByIdOrSlug(item.product_id);
    if (!product) return { success: false, message: 'Product not found' };

    if (quantity > product.stock_quantity) {
      return { success: false, message: `Only ${product.stock_quantity} units available in stock` };
    }

    item.quantity = quantity;
    item.updated_at = new Date().toISOString();
    this.persist();
    return { success: true };
  }

  removeCartItem(cartId: string, itemId: string): { success: boolean; message?: string } {
    const idx = this.state.cart_items.findIndex(i => i.id === itemId && i.cart_id === cartId);
    if (idx === -1) return { success: false, message: 'Cart item not found' };

    this.state.cart_items.splice(idx, 1);
    this.persist();
    return { success: true };
  }

  clearCart(cartId: string): void {
    this.state.cart_items = this.state.cart_items.filter(i => i.cart_id !== cartId);
    this.persist();
  }

  // --- Orders & Transactions ---
  createOrder(orderData: {
    userId?: string | null;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    paymentMethod: string;
    cartId: string;
  }): { success: boolean; message?: string; order?: Order } {
    // Fetch cart items
    const items = this.getCartItems(orderData.cartId);
    if (items.length === 0) {
      return { success: false, message: 'Shopping cart is empty' };
    }

    // Atomic stock verification
    for (const item of items) {
      const prod = this.state.products.find(p => p.id === item.product_id);
      if (!prod || Number(prod.is_active) !== 1) {
        return { success: false, message: `Product "${item.product.name}" is no longer available` };
      }
      if (prod.stock_quantity < item.quantity) {
        return {
          success: false,
          message: `Insufficient inventory for "${prod.name}". Only ${prod.stock_quantity} units remaining.`,
        };
      }
    }

    // Calculate authoritative totals on the server
    let subtotal = 0;
    const orderItems: OrderItem[] = [];
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    for (const item of items) {
      const prod = this.state.products.find(p => p.id === item.product_id)!;
      // Decrement stock atomically
      prod.stock_quantity -= item.quantity;
      prod.updated_at = new Date().toISOString();

      const lineTotal = Number((prod.price * item.quantity).toFixed(2));
      subtotal += lineTotal;

      orderItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        order_id: orderId,
        product_id: prod.id,
        product_name: prod.name,
        unit_price: prod.price,
        quantity: item.quantity,
        line_total: lineTotal,
        image_url: prod.image_url,
      });
    }

    subtotal = Number(subtotal.toFixed(2));
    const shippingCost = subtotal >= 999 ? 0.00 : 99.00;
    const totalAmount = Number((subtotal + shippingCost).toFixed(2));

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      user_id: orderData.userId || null,
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      shipping_address: orderData.shippingAddress,
      city: orderData.city,
      state: orderData.state,
      postal_code: orderData.postalCode,
      country: orderData.country || 'India',
      subtotal,
      shipping_cost: shippingCost,
      total_amount: totalAmount,
      payment_method: orderData.paymentMethod || 'Cash on Delivery',
      payment_status: 'unpaid',
      order_status: 'Pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const initialHistory: OrderStatusHistory = {
      id: `hist-${Date.now()}`,
      order_id: orderId,
      previous_status: null,
      new_status: 'Pending',
      changed_by: orderData.customerName,
      note: 'Order placed by customer via checkout',
      created_at: new Date().toISOString(),
    };

    // Save to state
    this.state.orders.unshift(newOrder);
    this.state.order_items.push(...orderItems);
    this.state.order_status_history.push(initialHistory);

    // Clear cart
    this.clearCart(orderData.cartId);
    this.persist();

    return {
      success: true,
      order: {
        ...newOrder,
        items: orderItems,
        history: [initialHistory],
      },
    };
  }

  getOrderById(idOrNumber: string, userId?: string, isAdmin?: boolean): Order | undefined {
    const order = this.state.orders.find(o => o.id === idOrNumber || o.order_number === idOrNumber);
    if (!order) return undefined;

    // Authorization check
    if (!isAdmin && userId && order.user_id && order.user_id !== userId) {
      return undefined;
    }

    const items = this.state.order_items.filter(i => i.order_id === order.id);
    const history = this.state.order_status_history
      .filter(h => h.order_id === order.id)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    return {
      ...order,
      items,
      history,
    };
  }

  getUserOrders(userId: string): Order[] {
    const userOrders = this.state.orders
      .filter(o => o.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return userOrders.map(o => {
      const items = this.state.order_items.filter(i => i.order_id === o.id);
      return {
        ...o,
        items,
      };
    });
  }

  getAllOrders(options: { status?: string; search?: string; page?: number; limit?: number } = {}): {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    let items = [...this.state.orders];

    if (options.status && options.status !== 'all') {
      items = items.filter(o => o.order_status === options.status);
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      items = items.filter(
        o =>
          o.order_number.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_email.toLowerCase().includes(q)
      );
    }

    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const total = items.length;
    const page = options.page || 1;
    const limit = options.limit || 10;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = items.slice(startIndex, startIndex + limit);

    const enriched = paginated.map(o => ({
      ...o,
      items: this.state.order_items.filter(i => i.order_id === o.id),
    }));

    return {
      orders: enriched,
      total,
      page,
      limit,
      totalPages,
    };
  }

  updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    changedBy: string,
    note?: string
  ): { success: boolean; message?: string; order?: Order } {
    const order = this.state.orders.find(o => o.id === orderId || o.order_number === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    const validStatuses: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return { success: false, message: 'Invalid order status specified' };
    }

    const previousStatus = order.order_status;
    if (previousStatus === newStatus) {
      return { success: false, message: `Order is already in "${newStatus}" status` };
    }

    if (previousStatus === 'Cancelled') {
      return { success: false, message: 'Cannot modify a cancelled order' };
    }

    if (previousStatus === 'Delivered' && newStatus !== 'Cancelled') {
      return { success: false, message: 'Delivered orders cannot transition back to in-flight statuses' };
    }

    // If transitioning to Cancelled, safely restore inventory
    if (newStatus === 'Cancelled') {
      const items = this.state.order_items.filter(i => i.order_id === order.id);
      for (const item of items) {
        if (item.product_id) {
          const prod = this.state.products.find(p => p.id === item.product_id);
          if (prod) {
            prod.stock_quantity += item.quantity;
            prod.updated_at = new Date().toISOString();
          }
        }
      }
    }

    // If transitioned to Delivered, mark payment as paid if unpaid
    if (newStatus === 'Delivered' && order.payment_status === 'unpaid') {
      order.payment_status = 'paid';
    }

    order.order_status = newStatus;
    order.updated_at = new Date().toISOString();

    const historyEntry: OrderStatusHistory = {
      id: `hist-${Date.now()}`,
      order_id: order.id,
      previous_status: previousStatus,
      new_status: newStatus,
      changed_by: changedBy,
      note: note || `Status transitioned from ${previousStatus} to ${newStatus}`,
      created_at: new Date().toISOString(),
    };
    this.state.order_status_history.push(historyEntry);

    this.persist();

    return {
      success: true,
      order: this.getOrderById(order.id, undefined, true),
    };
  }

  // --- Admin Dashboard Metrics ---
  getDashboardStats(): {
    totalProducts: number;
    totalCustomers: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    databaseMode: 'embedded';
    lowStockProducts: Product[];
    recentOrders: Order[];
  } {
    const totalProducts = this.state.products.filter(p => Number(p.is_active) === 1).length;
    const totalCustomers = this.state.users.filter(u => u.role === 'customer').length;
    const totalOrders = this.state.orders.length;
    const pendingOrders = this.state.orders.filter(o => o.order_status === 'Pending').length;

    // Strict requirement: Revenue must be calculated from actual saved order records and must exclude cancelled orders.
    const eligibleOrders = this.state.orders.filter(o => o.order_status !== 'Cancelled');
    const totalRevenue = Number(
      eligibleOrders.reduce((sum, order) => sum + Number(order.total_amount), 0).toFixed(2)
    );

    const lowStockProducts = this.state.products
      .filter(p => Number(p.is_active) === 1 && p.stock_quantity <= 15)
      .sort((a, b) => a.stock_quantity - b.stock_quantity)
      .slice(0, 5);

    const recentOrders = this.state.orders
      .slice(0, 5)
      .map(o => ({
        ...o,
        items: this.state.order_items.filter(i => i.order_id === o.id),
      }));

    return {
      totalProducts,
      totalCustomers,
      totalOrders,
      pendingOrders,
      totalRevenue,
      databaseMode: 'embedded',
      lowStockProducts,
      recentOrders,
    };
  }

  // --- Product Reviews ---
  getProductReviews(productIdOrSlug: string): ReviewsResponseData {
    const product = this.findProductByIdOrSlug(productIdOrSlug);
    if (!product) {
      return {
        reviews: [],
        averageRating: 0,
        reviewCount: 0,
        ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const reviews = (this.state.product_reviews || [])
      .filter(r => r.product_id === product.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const reviewCount = reviews.length;
    const ratingBreakdown: { [stars: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;

    for (const r of reviews) {
      sum += r.rating;
      if (ratingBreakdown[r.rating] !== undefined) {
        ratingBreakdown[r.rating]++;
      }
    }

    const averageRating = reviewCount > 0 ? Number((sum / reviewCount).toFixed(1)) : 0;

    return {
      reviews,
      averageRating,
      reviewCount,
      ratingBreakdown,
    };
  }

  addProductReview(data: {
    productIdOrSlug: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
  }): { success: boolean; message?: string; review?: ProductReview } {
    const product = this.findProductByIdOrSlug(data.productIdOrSlug);
    if (!product) {
      return { success: false, message: 'Product not found' };
    }

    if (!this.state.product_reviews) {
      this.state.product_reviews = [];
    }

    // Check if user already reviewed this product - if so, update existing review
    const existingIndex = this.state.product_reviews.findIndex(
      r => r.product_id === product.id && r.user_id === data.userId
    );

    let review: ProductReview;
    if (existingIndex >= 0) {
      this.state.product_reviews[existingIndex].rating = data.rating;
      this.state.product_reviews[existingIndex].comment = data.comment;
      this.state.product_reviews[existingIndex].user_name = data.userName;
      this.state.product_reviews[existingIndex].created_at = new Date().toISOString();
      review = this.state.product_reviews[existingIndex];
    } else {
      review = {
        id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        product_id: product.id,
        user_id: data.userId,
        user_name: data.userName,
        rating: data.rating,
        comment: data.comment,
        created_at: new Date().toISOString(),
      };
      this.state.product_reviews.unshift(review);
    }

    this.persist();
    return { success: true, review };
  }
}
