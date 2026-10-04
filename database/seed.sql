-- ========================================================
-- ShopSphere E-Commerce Platform
-- Database Seed Data: MySQL 8.0
-- ========================================================

USE `shopsphere_db`;

-- --------------------------------------------------------
-- Users Seed Data
-- Passwords:
-- Admin: admin@shopsphere.com / Admin@123 (hashed with bcrypt 10 rounds)
-- Customer: customer@shopsphere.com / Customer@123 (hashed with bcrypt 10 rounds)
-- Jane Smith: jane@example.com / Customer@123
-- --------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
('usr-admin-001', 'Alex Mercer (Admin)', 'admin@shopsphere.com', '$2b$10$NxNpx7mK6qwPuLsNK33O2e7LphzIgj41lwfUqAhskevLf1K7lKul.', 'admin', 1, NOW(), NOW()),
('usr-cust-001', 'Sandesh Heda', 'customer@shopsphere.com', '$2b$10$Tm6LilUsprLV.Lygiw0fXuLlpxt0aPMLi45a54OwmiVwq72ZJW4I6', 'customer', 1, NOW(), NOW()),
('usr-cust-002', 'Sarah Jenkins', 'sarah.j@example.com', '$2b$10$Tm6LilUsprLV.Lygiw0fXuLlpxt0aPMLi45a54OwmiVwq72ZJW4I6', 'customer', 1, NOW(), NOW());

-- --------------------------------------------------------
-- Categories Seed Data
-- --------------------------------------------------------
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image_url`, `created_at`) VALUES
('cat-elec', 'Electronics', 'electronics', 'Cutting-edge gadgets, computing gear, smart displays and modern tech essentials.', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80', NOW()),
('cat-audio', 'Audio & Wearables', 'audio-wearables', 'High-fidelity headphones, noise-canceling earbuds, and health-tracking smart wearables.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', NOW()),
('cat-apparel', 'Fashion & Apparel', 'fashion-apparel', 'Contemporary everyday apparel, breathable outerwear, premium knitwear and stylish accessories.', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80', NOW()),
('cat-home', 'Home & Living', 'home-living', 'Artisanal homeware, minimalist workspace decor, ergonomic lights and kitchen craft.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80', NOW()),
('cat-acc', 'Accessories', 'accessories', 'Durable leather goods, minimalist carry backpacks, sunglasses and everyday carry tools.', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', NOW());

-- --------------------------------------------------------
-- Products Seed Data (20 products with authentic images & stock)
-- --------------------------------------------------------
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `image_url`, `stock_quantity`, `is_active`, `is_featured`, `created_at`, `updated_at`) VALUES
-- Audio & Wearables
('prod-001', 'cat-audio', 'AuraWave Wireless ANC Headphones', 'aurawave-wireless-anc-headphones', 'Precision acoustic engineering with active noise cancellation, 40-hour battery life, ultra-plush memory foam earcups, and dual beamforming microphones for crystal-clear calls.', 19999.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', 38, 1, 1, NOW(), NOW()),
('prod-002', 'cat-audio', 'SonicPulse Pro Earbuds', 'sonicpulse-pro-earbuds', 'True wireless earbuds with spatial audio tracking, transparency mode, IPX7 water resistance, and rapid wireless charging case.', 8999.00, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80', 50, 1, 1, NOW(), NOW()),
('prod-003', 'cat-audio', 'PulseFit Smart Fitness Tracker', 'pulsefit-smart-fitness-tracker', 'All-day heart rate, SpO2, sleep cycle tracker, AMOLED touch display, and 14-day battery life in a lightweight ceramic casing.', 4999.00, 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80', 25, 1, 0, NOW(), NOW()),
('prod-004', 'cat-audio', 'AcousticStudio Desktop Monitors', 'acousticstudio-desktop-monitors', 'Studio-grade reference audio monitors with silk dome tweeters, woven composite woofers, and Bluetooth 5.3 multi-device pairing.', 14999.00, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80', 14, 1, 0, NOW(), NOW()),

-- Electronics
('prod-005', 'cat-elec', 'LumixPro 4K Ultra-Wide Monitor 34"', 'lumixpro-4k-ultrawide-monitor-34', 'Curved 3440x1440 IPS panel with 144Hz refresh rate, USB-C 90W power delivery, HDR400, and factory color calibration.', 49999.00, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80', 12, 1, 1, NOW(), NOW()),
('prod-006', 'cat-elec', 'KeyCraft Minimalist Mechanical Keyboard', 'keycraft-minimalist-mechanical-keyboard', 'Custom hot-swappable tactile switches, frosted aluminum chassis, PBT double-shot keycaps, and custom RGB underglow.', 9999.00, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', 42, 1, 1, NOW(), NOW()),
('prod-007', 'cat-elec', 'ErgoGlide Precision Wireless Mouse', 'ergoglide-precision-wireless-mouse', 'Ergonomic vertical contouring designed by physical therapists, 4000 DPI sensor, silent optical switches, and hyper-fast scroll.', 4499.00, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80', 60, 1, 0, NOW(), NOW()),
('prod-008', 'cat-elec', 'NovaDock 10-in-1 Thunderbolt 4 Hub', 'novadock-10-in-1-thunderbolt-4-hub', 'Dual 4K display output, 100W PD pass-through charging, Gigabit Ethernet, UHS-II SD card reader, and audio in/out.', 11999.00, 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80', 20, 1, 0, NOW(), NOW()),

-- Fashion & Apparel
('prod-009', 'cat-apparel', 'Merino Wool Minimalist Crewneck', 'merino-wool-minimalist-crewneck', '100% extra-fine Australian merino wool with natural temperature regulation, moisture wicking, and odor-resistant comfort.', 5999.00, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80', 30, 1, 1, NOW(), NOW()),
('prod-010', 'cat-apparel', 'WeatherShield All-Weather Technical Jacket', 'weathershield-technical-jacket', 'Three-layer waterproof breathable shell, sealed taped seams, magnetic cuff closures, and ergonomic articulated sleeves.', 12999.00, 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', 18, 1, 1, NOW(), NOW()),
('prod-011', 'cat-apparel', 'Everyday Organic Oxford Cotton Shirt', 'everyday-organic-oxford-cotton-shirt', 'Pre-washed sustainable organic cotton shirt with structured button-down collar and relaxed modern silhouette.', 3499.00, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80', 45, 1, 0, NOW(), NOW()),
('prod-012', 'cat-apparel', 'AeroKnit Breathable Everyday Sneakers', 'aeroknit-breathable-everyday-sneakers', 'Featherlight seamless knitted upper, responsive EVA cushioning midsole, and grippy recycled rubber outsole.', 6999.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', 32, 1, 0, NOW(), NOW()),

-- Home & Living
('prod-013', 'cat-home', 'Artisan Handcrafted Ceramic Pour-Over Set', 'artisan-ceramic-pour-over-set', 'Matte-glazed stoneware cone dripper and 600ml glass server engineered for optimal thermal stability and extraction balance.', 2999.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', 22, 1, 1, NOW(), NOW()),
('prod-014', 'cat-home', 'Nordic Solid Walnut Desk Organizer', 'nordic-solid-walnut-desk-organizer', 'Sustainably sourced North American walnut wood with magnetic cable channels, pen trough, and phone docking groove.', 4299.00, 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80', 15, 1, 0, NOW(), NOW()),
('prod-015', 'cat-home', 'Lumina Ambient LED Desk Lamp', 'lumina-ambient-led-desk-lamp', 'Adjustable dual color temperature, touch-sensitive slide dimming, USB charging port, and flicker-free eye-care illumination.', 5499.00, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', 28, 1, 1, NOW(), NOW()),
('prod-016', 'cat-home', 'Botanical Soy Wax Scented Candle Trio', 'botanical-soy-wax-candle-trio', 'Hand-poured 100% natural soy wax featuring Cedarwood & Bergamot, Wild Fig & Olive, and Smoked Amber.', 2499.00, 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80', 40, 1, 0, NOW(), NOW()),

-- Accessories
('prod-017', 'cat-acc', 'Vanguard Full-Grain Leather Weekender', 'vanguard-full-grain-leather-weekender', 'Vegetable-tanned full-grain leather duffel bag with dedicated padded 16-inch laptop compartment and brass YKK hardware.', 18999.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', 8, 1, 1, NOW(), NOW()),
('prod-018', 'cat-acc', 'Modula Waterproof Urban Commuter Backpack', 'modula-waterproof-commuter-backpack', 'Weatherproof tarpaulin and 840D ballistic nylon, modular internal divider system, and hidden anti-theft passport pocket.', 7999.00, 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800&auto=format&fit=crop&q=80', 35, 1, 0, NOW(), NOW()),
('prod-019', 'cat-acc', 'Apex Titanium Minimalist Slim Wallet', 'apex-titanium-minimalist-slim-wallet', 'Grade 5 aerospace titanium RFID-blocking cardholder with integrated money clip and quick-draw thumb slot.', 3499.00, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', 55, 1, 0, NOW(), NOW()),
('prod-020', 'cat-acc', 'Solarium Polarized Acetate Sunglasses', 'solarium-polarized-acetate-sunglasses', 'Handcrafted Italian Mazzucchelli acetate frames with Category 3 100% UV400 polarized mineral glass lenses.', 6499.00, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', 24, 1, 0, NOW(), NOW());

-- --------------------------------------------------------
-- Sample Orders Seed Data
-- --------------------------------------------------------
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `customer_name`, `customer_email`, `shipping_address`, `city`, `state`, `postal_code`, `country`, `subtotal`, `shipping_cost`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `created_at`, `updated_at`) VALUES
('ord-001', 'ORD-2026-10492', 'usr-cust-001', 'Sandesh Heda', 'customer@shopsphere.com', 'Flat 402, Sunshine Residency, MG Road', 'Bengaluru', 'Karnataka', '560001', 'India', 28998.00, 0.00, 28998.00, 'Cash on Delivery', 'paid', 'Delivered', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
('ord-002', 'ORD-2026-10834', 'usr-cust-001', 'Sandesh Heda', 'customer@shopsphere.com', 'Flat 402, Sunshine Residency, MG Road', 'Bengaluru', 'Karnataka', '560001', 'India', 8999.00, 0.00, 8999.00, 'Cash on Delivery', 'unpaid', 'Shipped', DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
('ord-003', 'ORD-2026-11205', 'usr-cust-002', 'Sarah Jenkins', 'sarah.j@example.com', '124 Marine Drive, Nariman Point', 'Mumbai', 'Maharashtra', '400021', 'India', 18999.00, 0.00, 18999.00, 'Cash on Delivery', 'unpaid', 'Processing', DATE_SUB(NOW(), INTERVAL 6 HOUR), NOW());

-- --------------------------------------------------------
-- Sample Order Items Seed Data
-- --------------------------------------------------------
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `unit_price`, `quantity`, `line_total`, `image_url`) VALUES
('item-001', 'ord-001', 'prod-001', 'AuraWave Wireless ANC Headphones', 19999.00, 1, 19999.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'),
('item-002', 'ord-001', 'prod-002', 'SonicPulse Pro Earbuds', 8999.00, 1, 8999.00, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'),
('item-003', 'ord-002', 'prod-002', 'SonicPulse Pro Earbuds', 8999.00, 1, 8999.00, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'),
('item-004', 'ord-003', 'prod-017', 'Vanguard Full-Grain Leather Weekender', 18999.00, 1, 18999.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80');

-- --------------------------------------------------------
-- Sample Order Status History
-- --------------------------------------------------------
INSERT INTO `order_status_history` (`id`, `order_id`, `previous_status`, `new_status`, `changed_by`, `note`, `created_at`) VALUES
('hist-001', 'ord-001', NULL, 'Pending', 'System', 'Order placed by customer', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('hist-002', 'ord-001', 'Pending', 'Confirmed', 'Alex Mercer (Admin)', 'Payment terms confirmed', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('hist-003', 'ord-001', 'Confirmed', 'Shipped', 'Alex Mercer (Admin)', 'Dispatched via Express Courier (AWB #SP-99824)', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('hist-004', 'ord-001', 'Shipped', 'Delivered', 'Alex Mercer (Admin)', 'Package signed by recipient', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('hist-005', 'ord-002', NULL, 'Pending', 'System', 'Order placed by customer', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('hist-006', 'ord-002', 'Pending', 'Confirmed', 'Alex Mercer (Admin)', 'Confirmed and sent to fulfillment', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('hist-007', 'ord-002', 'Confirmed', 'Shipped', 'Alex Mercer (Admin)', 'In transit with tracking #SP-44912', NOW()),
('hist-008', 'ord-003', NULL, 'Pending', 'System', 'Order placed by customer', DATE_SUB(NOW(), INTERVAL 6 HOUR)),
('hist-009', 'ord-003', 'Pending', 'Processing', 'Alex Mercer (Admin)', 'Packaging fragile leather item', DATE_SUB(NOW(), INTERVAL 2 HOUR));

-- --------------------------------------------------------
-- Sample Product Reviews
-- --------------------------------------------------------
INSERT INTO `product_reviews` (`id`, `product_id`, `user_id`, `user_name`, `rating`, `comment`, `created_at`) VALUES
('rev-001', 'prod-001', 'usr-cust-001', 'Sandesh Heda', 5, 'Exceptional build quality and sound stage. The active noise cancellation easily drowns out coffee shop chatter and airplane hum. Battery life exceeds expectations!', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('rev-002', 'prod-001', 'usr-cust-002', 'Sarah Jenkins', 4, 'Very comfortable memory foam earcups even during 6-hour video call sessions. Fast USB-C charging too.', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('rev-003', 'prod-002', 'usr-cust-001', 'Sandesh Heda', 5, 'Tremendous bass clarity and seamless Bluetooth pairing with both my laptop and phone.', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('rev-004', 'prod-005', 'usr-cust-002', 'Sarah Jenkins', 5, 'The 34-inch curved ultra-wide display has dramatically improved my multitasking efficiency. 90W USB-C power delivery keeps my desk cable-free.', DATE_SUB(NOW(), INTERVAL 6 DAY)),
('rev-005', 'prod-006', 'usr-cust-001', 'Sandesh Heda', 5, 'Crisp tactile feedback on the mechanical switches and solid aluminum chassis weight. Highly recommended!', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('rev-006', 'prod-017', 'usr-cust-002', 'Sarah Jenkins', 5, 'The full-grain leather smells amazing and feels durable. Fits a 16-inch laptop snugly with plenty of room for weekend clothing.', DATE_SUB(NOW(), INTERVAL 1 DAY));

