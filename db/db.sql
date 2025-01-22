CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    id_customer VARCHAR(255),
    email VARCHAR(180) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    is_available BOOLEAN DEFAULT FALSE,
    lastname VARCHAR(255),
    session_token VARCHAR(180),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);