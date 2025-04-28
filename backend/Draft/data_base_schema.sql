-- Таблиця для зберігання користувачів
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    verification_code VARCHAR(6),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблиця для додаткової інформації про користувачів
CREATE TABLE UserInfo (
    user_id INT PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
    name VARCHAR(50),
    surname VARCHAR(50),
    phone VARCHAR(20),
    country VARCHAR(50)
);

-- Таблиця для зберігання refresh токенів
CREATE TABLE RefreshTokens (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблиця для зберігання проектів
CREATE TABLE Projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблиця для зберігання ролей користувачів у проектах
CREATE TABLE UserRoles (
    user_id INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    project_id INT NOT NULL REFERENCES Projects(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'LEADER', 'EXECUTOR')),
    PRIMARY KEY (user_id, project_id)
);

-- Таблиця для зберігання задач
CREATE TABLE Tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    project_id INT NOT NULL REFERENCES Projects(id) ON DELETE CASCADE,
    priority VARCHAR(15) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'UPPER_MEDIUM', 'HIGH')),
    tag_id INT REFERENCES Tags(id) ON DELETE SET NULL,
    status_id INT REFERENCES Status(id) ON DELETE SET NULL,
    executor_id INT REFERENCES Users(id) ON DELETE SET NULL,
    start_execution_at TIMESTAMP,
    end_execution_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблиця для зберігання тегів
CREATE TABLE Tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL,
    project_id INT NOT NULL REFERENCES Projects(id) ON DELETE CASCADE
);

-- Таблиця для зберігання статусів
CREATE TABLE Status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL
);