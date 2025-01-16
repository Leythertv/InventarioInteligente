-- Crear la base de datos gestiondeinventarioV2
CREATE DATABASE gestiondeinventarioV2;
GO

-- Usar la base de datos
USE gestiondeinventarioV2;
GO

-- Tabla Usuarios
CREATE TABLE Usuarios (
    ID_Usuario INT IDENTITY(1,1) PRIMARY KEY,
    NombreUsuario VARCHAR(255) NOT NULL,
    CorreoElectronico VARCHAR(255) UNIQUE NOT NULL,
    Contraseña VARCHAR(255) NOT NULL
);
GO

-- Insertar datos de ejemplo en Usuarios
INSERT INTO Usuarios (NombreUsuario, CorreoElectronico, Contraseña) VALUES
('Juan Perez', 'juan.perez@ejemplo.com', 'Contraseña1!'),
('Maria Rodriguez', 'maria.rodriguez@ejemplo.com', 'Contraseña2@'),
('Pedro Gomez', 'pedro.gomez@ejemplo.com', 'Contraseña3#'),
('Ana Sanchez', 'ana.sanchez@ejemplo.com', 'Contraseña4$'),
('Luis Martinez', 'luis.martinez@ejemplo.com', 'Contraseña5%'),
('Sofia Herrera', 'sofia.herrera@ejemplo.com', 'Contraseña6^'),
('Carlos Ramirez', 'carlos.ramirez@ejemplo.com', 'Contraseña7&'),
('Laura Flores', 'laura.flores@ejemplo.com', 'Contraseña8*'),
('Javier Diaz', 'javier.diaz@ejemplo.com', 'Contraseña9('),
('Elena Ruiz', 'elena.ruiz@ejemplo.com', 'Contraseña0)');
GO

-- Tabla Clientes
CREATE TABLE Clientes (
    ID_Cliente INT IDENTITY(1,1) PRIMARY KEY,
    RUC VARCHAR(20) UNIQUE NOT NULL,
    NombreCliente VARCHAR(255) NOT NULL,
    Direccion VARCHAR(255),
    Telefono VARCHAR(20),
    CorreoElectronico VARCHAR(255)
);
GO

-- Insertar datos de ejemplo en Clientes
INSERT INTO Clientes (RUC, NombreCliente, Direccion, Telefono, CorreoElectronico) VALUES
('12345678901', 'Cliente A', 'Calle 1 #1-1', '555-1111', 'clienteA@ejemplo.com'),
('98765432109', 'Cliente B', 'Avenida 2 #2-2', '555-2222', 'clienteB@ejemplo.com'),
('45678901234', 'Cliente C', 'Carrera 3 #3-3', '555-3333', 'clienteC@ejemplo.com'),
('78901234567', 'Cliente D', 'Diagonal 4 #4-4', '555-4444', 'clienteD@ejemplo.com'),
('01234567890', 'Cliente E', 'Transversal 5 #5-5', '555-5555', 'clienteE@ejemplo.com'),
('34567890123', 'Cliente F', 'Calle 6 #6-6', '555-6666', 'clienteF@ejemplo.com'),
('67890123456', 'Cliente G', 'Avenida 7 #7-7', '555-7777', 'clienteG@ejemplo.com'),
('23456789012', 'Cliente H', 'Carrera 8 #8-8', '555-8888', 'clienteH@ejemplo.com'),
('56789012345', 'Cliente I', 'Diagonal 9 #9-9', '555-9999', 'clienteI@ejemplo.com'),
('89012345678', 'Cliente J', 'Transversal 10 #10-10', '555-0000', 'clienteJ@ejemplo.com');
GO

-- Tabla Productos
CREATE TABLE Productos (
    ID_Producto INT IDENTITY(1,1) PRIMARY KEY,
    NombreProducto VARCHAR(255) NOT NULL,
    Descripcion TEXT,
    Precio DECIMAL(10, 2) NOT NULL CHECK (Precio >= 0),
    CantidadStock INT NOT NULL CHECK (CantidadStock >= 0)
);
GO

-- Insertar datos de ejemplo en Productos
INSERT INTO Productos (NombreProducto, Descripcion, Precio, CantidadStock) VALUES
('Laptop Dell XPS 13', 'Laptop ultrabook de 13 pulgadas', 1200.00, 50),
('Monitor LG 27"', 'Monitor IPS de 27 pulgadas', 300.00, 100),
('Teclado Logitech MX Keys', 'Teclado inalámbrico con retroiluminación', 100.00, 75),
('Mouse Logitech MX Master 3', 'Mouse inalámbrico ergonómico', 90.00, 60),
('Impresora Epson EcoTank L3150', 'Impresora multifuncional con sistema de tinta continua', 250.00, 40),
('Disco Duro Externo Seagate 2TB', 'Disco duro portátil de 2 terabytes', 80.00, 90),
('Memoria RAM Corsair Vengeance 16GB', 'Kit de memoria RAM DDR4 de 16 gigabytes', 70.00, 80),
('Tarjeta de Video NVIDIA RTX 3060', 'Tarjeta gráfica para juegos', 400.00, 30),
('Audífonos Sony WH-1000XM4', 'Audífonos inalámbricos con cancelación de ruido', 350.00, 55),
('Cámara Web Logitech C920', 'Cámara web con resolución Full HD', 70.00, 120);
GO

-- Tabla Pedidos
CREATE TABLE Pedidos (
    ID_Pedido INT IDENTITY(1,1) PRIMARY KEY,
    ID_Usuario INT NOT NULL,
    ID_Cliente INT NOT NULL,
    FechaPedido DATE NOT NULL,
    FOREIGN KEY (ID_Usuario) REFERENCES Usuarios(ID_Usuario),
    FOREIGN KEY (ID_Cliente) REFERENCES Clientes(ID_Cliente)
);
GO

-- Insertar datos de ejemplo en Pedidos
INSERT INTO Pedidos (ID_Usuario, ID_Cliente, FechaPedido) VALUES
(1, 1, '2024-07-26'), (2, 2, '2024-07-25'), (3, 3, '2024-07-24'),
(4, 4, '2024-07-23'), (5, 5, '2024-07-22'), (6, 6, '2024-07-21'),
(7, 7, '2024-07-20'), (8, 8, '2024-07-19'), (9, 9, '2024-07-18'),
(10, 10, '2024-07-17');
GO

-- Tabla DetallesPedido
CREATE TABLE DetallesPedido (
    ID_DetallePedido INT IDENTITY(1,1) PRIMARY KEY,
    ID_Pedido INT NOT NULL,
    ID_Producto INT NOT NULL,
    Cantidad INT NOT NULL CHECK (Cantidad > 0),
    PrecioUnitario DECIMAL(10, 2) NOT NULL CHECK (PrecioUnitario >= 0),
    Subtotal DECIMAL(10, 2) NOT NULL CHECK (Subtotal >= 0),
    FOREIGN KEY (ID_Pedido) REFERENCES Pedidos(ID_Pedido),
    FOREIGN KEY (ID_Producto) REFERENCES Productos(ID_Producto)
);
GO

-- Insertar datos de ejemplo en DetallesPedido
INSERT INTO DetallesPedido (ID_Pedido, ID_Producto, Cantidad, PrecioUnitario, Subtotal) VALUES
(1, 1, 1, 1200.00, 1200.00), -- Pedido 1: Laptop Dell XPS 13
(1, 2, 2, 300.00, 600.00),   -- Pedido 1: Monitor LG 27"
(2, 3, 1, 100.00, 100.00),   -- Pedido 2: Teclado Logitech MX Keys
(2, 4, 1, 90.00, 90.00),     -- Pedido 2: Mouse Logitech MX Master 3
(3, 5, 1, 250.00, 250.00),   -- Pedido 3: Impresora Epson EcoTank L3150
(3, 6, 1, 80.00, 80.00),     -- Pedido 3: Disco Duro Externo Seagate 2TB
(4, 7, 2, 70.00, 140.00),    -- Pedido 4: Memoria RAM Corsair Vengeance 16GB
(4, 8, 1, 400.00, 400.00),   -- Pedido 4: Tarjeta de Video NVIDIA RTX 3060
(5, 9, 1, 350.00, 350.00),   -- Pedido 5: Audífonos Sony WH-1000XM4
(5, 10, 1, 70.00, 70.00),    -- Pedido 5: Cámara Web Logitech C920
(6, 1, 1, 1200.00, 1200.00), -- Pedido 6: Laptop Dell XPS 13
(6, 3, 1, 100.00, 100.00),   -- Pedido 6: Teclado Logitech MX Keys
(7, 4, 1, 90.00, 90.00),     -- Pedido 7: Mouse Logitech MX Master 3
(7, 5, 1, 250.00, 250.00),   -- Pedido 7: Impresora Epson EcoTank L3150
(8, 6, 1, 80.00, 80.00),     -- Pedido 8: Disco Duro Externo Seagate 2TB
(8, 7, 1, 70.00, 70.00),     -- Pedido 8: Memoria RAM Corsair Vengeance 16GB
(9, 8, 1, 400.00, 400.00),   -- Pedido 9: Tarjeta de Video NVIDIA RTX 3060
(9, 9, 1, 350.00, 350.00),   -- Pedido 9: Audífonos Sony WH-1000XM4
(10, 10, 1, 70.00, 70.00);   -- Pedido 10: Cámara Web Logitech C920
GO