DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
item_id INTEGER NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) DEFAULT NULL,
department_name VARCHAR(100) DEFAULT NULL,
price DECIMAL(10,2) DEFAULT NULL,
stock_quantity INTEGER(20) DEFAULT NULL, 
PRIMARY KEY (item_id)
);

SELECT * FROM products;
