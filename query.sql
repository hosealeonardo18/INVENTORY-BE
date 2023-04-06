CREATE DATABASE inventory;
CREATE TYPE enum AS enum('L','P','');

CREATE TABLE users (
  id VARCHAR(128) PRIMARY KEY NOT NULL , 
  fullname VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL ,
  password VARCHAR(255) NOT NULL,
  no_telp VARCHAR(14) NULL,
  image VARCHAR(255) NULL,
  gender enum NULL,
  created_at VARCHAR(128) NULL,
  role VARCHAR(128) NULL
);

CREATE TABLE divisions (
  id VARCHAR(128) PRIMARY KEY NOT NULL ,
  division_name VARCHAR(255) NOT NULL
);

CREATE TABLE inventory (
  id VARCHAR(128) PRIMARY KEY NOT NULL , 
  id_product VARCHAR(128) NOT NULL,
  name VARCHAR(100) NOT NULL,
  purchase_date DATE NOT NULL ,
  purchase_store VARCHAR(255) NULL,
  qty INT NULL,
  type_product VARCHAR(128) NULL,
  description TEXT NULL,
  image VARCHAR(255) NULL,
  division_id VARCHAR(128) NULL,
  user_id VARCHAR(128) NULL,

  CONSTRAINT fk_division
  FOREIGN KEY (division_id) 
  REFERENCES divisions(id) ON DELETE CASCADE,

  CONSTRAINT fk_user
  FOREIGN KEY (user_id) 
  REFERENCES users(id) ON DELETE CASCADE
);