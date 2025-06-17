-- Create the database
CREATE DATABASE IF NOT EXISTS anime_store;
-- Use the newly created database
USE anime_store;
-- Create the 'users' table to store user information
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    contact_number VARCHAR(15),
    location VARCHAR(100)
);
-- Create the 'products' table to store product information
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(100) NOT NULL -- Store the filename of the product image
);
-- Create the 'cart' table to store items added by users
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    product_id INT,
    quantity INT DEFAULT 1,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
-- insert products into products table
INSERT INTO products (name, price, image_url) VALUES
('Toji Desk Mat', 300 , 'desk_mat_1.jpg'),
('Ryomen Sukuna Desk Mat', 300 , 'desk_mat_2.jpg'),
('Roronoa Zoro Desk Mat', 300 , 'desk_mat_3.jpg'),
('Gear 5 Luffy Poster', 500 , 'poster_1.jpg'),
('Shanks Poster', 500 , 'poster_2.jpg'),
('Zoro Poster', 500 , 'poster_3.jpg'),
('Mihawk Poster', 500 , 'poster_4.jpg'),
('AOT Manga Poster', 600 , 'manga_poster_1.jpg'),
('Tokyo Revengers Manga Poster', 600 , 'manga_poster_2.jpg'),
('One piece manga', 1000, 'manga_1.jpg'),
('Ship in bottle', 1500, 'bottle_ship.jpg');
INSERT INTO products (name, price, image_url) VALUES
('Kantana Stand wall mount', 2000, 'katana_stand.jpg'),
('Shusui', 3000, 'katana1.jpg'),
('LED katana', 3000, 'katana2.jpg'),
('Enma', 5000, 'katana3.jpg'),
('Toji cursed sword', 3000, 'katana4.jpg'),
('Luffy wanted T-shirt', 900, 'luffy_tshirt.jpg'),
('One punch man T-shirt', 700, 'onepunchman_tshirt.jpg'),
('Wanted Poster Puzzle', 1500, 'poster_puzzle.jpg');

INSERT INTO products (name, price, image_url) VALUES
('Gara Bag', 2000, 'gara_bag.jpg');

update products set name = 'Tokyo Rev. Manga Poster' where image_url = 'manga_poster_2.jpg';

CREATE TABLE wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    product_id INT NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- SELECT username, contact_number, location FROM users WHERE username = 'testuser';
-- SELECT * FROM cart;
-- delete from users ;
-- select * from users;
-- drop table products;
-- drop database anime_store;