-- Tabla: roles
DROP TABLE IF EXISTS roles CASCADE;

CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    image VARCHAR(255),
    route VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: users
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    id_customer VARCHAR(255),
    email VARCHAR(180) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    name VARCHAR(255) NOT NULL,
    notification_token VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    is_available BOOLEAN DEFAULT FALSE,
    lastname VARCHAR(255),
    session_token VARCHAR(180),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla intermedia: user_has_roles
DROP TABLE IF EXISTS user_has_roles CASCADE;

CREATE TABLE user_has_roles (
    id_user BIGINT NOT NULL,
    id_role BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_user, id_role),
    FOREIGN KEY (id_user) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_role) REFERENCES roles (id) ON UPDATE CASCADE ON DELETE CASCADE
);


INSERT INTO roles (
    name, 
    route,
    created_at,
    updated_at
)

VALUES(
    'CLIENTE',
    'client/product/list',
    '2025-01-25',
    '2025-01-25'
);

INSERT INTO roles (
    name, 
    route,
    created_at,
    updated_at
)

VALUES(
    'RESTAURANTE',
    'restaurant/orders/list',
    '2025-01-25',
    '2025-01-25'
);

INSERT INTO roles (
    name, 
    route,
    created_at,
    updated_at
)

VALUES(
    'REPARTIDOR',
    'delivery/orders/list',
    '2025-01-25',
    '2025-01-25'
);

SELECT 
    u.id,
    u.email,
    u.password,
    phone,
    u.name,
    u.image,
    u.is_available,
    u.lastname,
    u.session_token,
    json_agg(
        json_build_object(
            'id', r.id,
            'name', r.name,
            'image', r.image,
            'route', r.route
            
        ) 
    ) as roles
FROM 
    users as u
INNER JOIN 
    user_has_roles as uhr
ON
    u.id = uhr.id_user
INNER JOIN
    roles r
    ON
    r.id = uhr.id_role
WHERE
    u.email = 'irmag@gmail.com'
GROUP BY u.id