const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve all files from the current directory (anime-manga-store)
app.use(express.static(path.join(__dirname)));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'anime_store'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

// Login Endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.query(query, [username, password], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.json({ success: true, username: username });
        } else {
            res.json({ success: false, error: 'Invalid credentials' });
        }
    });
});


// Signup Endpoint
app.post('/signup', (req, res) => {
    const { username, password, contact_number, location } = req.body;
    const query = `INSERT INTO users (username, password, contact_number, location) VALUES (?, ?, ?, ?)`;
    db.query(query, [username, password, contact_number, location], (err) => {
        if (err) throw err;
        res.redirect('/index.html?signup=success');
    });
});

// Fetch Products
app.get('/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching products');
        } else {
            res.json(results);
        }
    });
});


// Add to Cart Endpoint
app.post('/add-to-cart', (req, res) => {
    const { username, product_id } = req.body;

    const query = 'INSERT INTO cart (username, product_id) VALUES (?, ?)';
    db.query(query, [username, product_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error adding to cart');
        }
        res.status(200).send('Product added to cart');
    });
});



// Fetch Cart Items
app.get('/cart', (req, res) => {
    const username = req.query.username; // Extract username from query
    const query = `
        SELECT products.id, products.name, products.price, COUNT(cart.product_id) AS quantity
        FROM cart
        JOIN products ON cart.product_id = products.id
        WHERE cart.username = ?
        GROUP BY products.id
    `;
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching cart items');
        }
        res.json(results); // Send back the fetched items
    });
});

app.post('/clear-cart', (req, res) => {
    const { username } = req.body;

    const sql = 'DELETE FROM cart WHERE username = ?';
    db.query(sql, [username], (err, result) => {
        if (err) {
            console.error('Error clearing cart:', err);
            return res.status(500).json({ message: 'Error clearing cart' });
        }
        res.json({ message: 'Cart cleared successfully' });
    });
});

app.get('/user-info', (req, res) => {
    const { username } = req.query;
    const sql = 'SELECT username, contact_number, location FROM users WHERE username = ?';

    db.query(sql, [username], (err, result) => {
        if (err) {
            console.error('Error fetching user info:', err);
            return res.status(500).json({ message: 'Error fetching user info' });
        }
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });
});

// Add to Wishlist Endpoint
app.post('/add-to-wishlist', (req, res) => {
    const { username, product_id } = req.body;
    const query = 'INSERT INTO wishlist (username, product_id) VALUES (?, ?)';
    db.query(query, [username, product_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error adding to wishlist');
        }
        res.status(200).send('Product added to wishlist');
    });
});

// Fetch Wishlist Items
app.get('/wishlist', (req, res) => {
    const username = req.query.username; // Extract username from query
    const query = `
        SELECT products.id, products.name, products.price, products.image_url
        FROM wishlist
        JOIN products ON wishlist.product_id = products.id
        WHERE wishlist.username = ?
    `;
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching wishlist items');
        }
        res.json(results); // Send back the fetched items
    });
});

// Remove from Wishlist and Add to Cart
app.post('/move-to-cart', (req, res) => {
    const { username, product_id } = req.body;

    // Remove from wishlist and add to cart as a transaction
    const deleteQuery = 'DELETE FROM wishlist WHERE username = ? AND product_id = ?';
    const insertQuery = 'INSERT INTO cart (username, product_id) VALUES (?, ?)';
    db.query(deleteQuery, [username, product_id], (err) => {
        if (err) {
            console.error('Error removing from wishlist:', err);
            return res.status(500).send('Error moving product to cart');
        }
        db.query(insertQuery, [username, product_id], (err) => {
            if (err) {
                console.error('Error adding to cart:', err);
                return res.status(500).send('Error moving product to cart');
            }
            res.status(200).send('Product moved to cart');
        });
    });
});




app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
