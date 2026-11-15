-- =====================================================================
-- Proyecto  : PASANTIX - "Conectando aprendices con oportunidades reales"
--             Plataforma que conecta a los aprendices que agotaron su
--             contrato de aprendizaje con empresas que ofrecen pasantías.
-- Archivo   : pasantix.sql
-- Propósito : Crear la base de datos, las tablas y los datos de prueba.
-- Motor     : MySQL 8 / MariaDB 10 (XAMPP)
-- Autor     : Iván Antonio Ovalle Barajas - ADSO Ficha 3336169
-- Instructor: Francisco Arnaldo Vargas Bermudez
-- =====================================================================

DROP DATABASE IF EXISTS pasantix;
CREATE DATABASE pasantix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pasantix;

-- ---------------------------------------------------------------------
-- Tabla: usuarios (credenciales de acceso al sistema)
-- ---------------------------------------------------------------------
CREATE TABLE usuarios (
    id_usuario       INT AUTO_INCREMENT PRIMARY KEY,
    nombre           VARCHAR(100) NOT NULL,
    correo           VARCHAR(120) NOT NULL UNIQUE,
    contrasena_hash  VARCHAR(255) NOT NULL,
    rol              ENUM('APRENDIZ','EMPRESA','ADMIN') NOT NULL DEFAULT 'APRENDIZ',
    fecha_creacion   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabla: empresas (entidades que publican ofertas de pasantía)
-- ---------------------------------------------------------------------
CREATE TABLE empresas (
    id_empresa      INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario      INT NULL,
    nit             VARCHAR(20)  NOT NULL UNIQUE,
    razon_social    VARCHAR(150) NOT NULL,
    sector          VARCHAR(80)  NULL,
    correo          VARCHAR(120) NOT NULL,
    telefono        VARCHAR(20)  NULL,
    ciudad          VARCHAR(80)  NOT NULL DEFAULT 'Bogotá',
    fecha_registro  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_empresa_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabla: aprendices (aprendices que buscan pasantía para su etapa productiva)
-- ---------------------------------------------------------------------
CREATE TABLE aprendices (
    id_aprendiz      INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario       INT NULL,
    nombres          VARCHAR(80)  NOT NULL,
    apellidos        VARCHAR(80)  NOT NULL,
    documento        VARCHAR(15)  NULL UNIQUE,
    correo           VARCHAR(120) NOT NULL UNIQUE,
    telefono         VARCHAR(20)  NULL,
    programa         VARCHAR(120) NOT NULL DEFAULT 'Análisis y Desarrollo de Software',
    ficha            VARCHAR(12)  NULL,
    ciudad           VARCHAR(80)  NOT NULL DEFAULT 'Bogotá',
    fecha_registro   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_aprendiz_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabla: ofertas (vacantes de pasantía publicadas por las empresas)
-- ---------------------------------------------------------------------
CREATE TABLE ofertas (
    id_oferta          INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa         INT NOT NULL,
    titulo             VARCHAR(120) NOT NULL,
    descripcion        TEXT NOT NULL,
    area               VARCHAR(80)  NOT NULL,
    modalidad          ENUM('PRESENCIAL','REMOTA','HIBRIDA') NOT NULL DEFAULT 'PRESENCIAL',
    cupos              INT NOT NULL DEFAULT 1,
    fecha_publicacion  DATE NOT NULL,
    fecha_cierre       DATE NOT NULL,
    estado             ENUM('ABIERTA','CERRADA') NOT NULL DEFAULT 'ABIERTA',
    CONSTRAINT fk_oferta_empresa FOREIGN KEY (id_empresa)
        REFERENCES empresas(id_empresa) ON DELETE CASCADE,
    CONSTRAINT chk_oferta_cupos CHECK (cupos BETWEEN 1 AND 50)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabla: postulaciones (relación aprendiz - oferta)
-- ---------------------------------------------------------------------
CREATE TABLE postulaciones (
    id_postulacion     INT AUTO_INCREMENT PRIMARY KEY,
    id_oferta          INT NOT NULL,
    id_aprendiz        INT NOT NULL,
    fecha_postulacion  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado             ENUM('PENDIENTE','ACEPTADA','RECHAZADA') NOT NULL DEFAULT 'PENDIENTE',
    comentario         VARCHAR(255) NULL,
    CONSTRAINT fk_postulacion_oferta FOREIGN KEY (id_oferta)
        REFERENCES ofertas(id_oferta) ON DELETE CASCADE,
    CONSTRAINT fk_postulacion_aprendiz FOREIGN KEY (id_aprendiz)
        REFERENCES aprendices(id_aprendiz) ON DELETE CASCADE,
    CONSTRAINT uq_postulacion UNIQUE (id_oferta, id_aprendiz)
) ENGINE=InnoDB;

-- =====================================================================
-- DATOS DE PRUEBA
-- Contraseña de TODOS los usuarios de prueba: Pasantix2026*
-- (hash bcrypt generado con 10 rondas)
-- =====================================================================
INSERT INTO usuarios (nombre, correo, contrasena_hash, rol) VALUES
('Administrador Pasantix', 'admin@pasantix.co',    '$2b$10$FcqIBRQGhc0IH/Xl9B00suyKYsJKyuGIBRlAUsrkoPqOD7b.KhYt2', 'ADMIN'),
('Soluciones Andinas TI',  'talento@andinasti.co', '$2b$10$FcqIBRQGhc0IH/Xl9B00suyKYsJKyuGIBRlAUsrkoPqOD7b.KhYt2', 'EMPRESA'),
('Laura Gómez',            'laura.gomez@soy.sena.edu.co', '$2b$10$FcqIBRQGhc0IH/Xl9B00suyKYsJKyuGIBRlAUsrkoPqOD7b.KhYt2', 'APRENDIZ');

INSERT INTO empresas (id_usuario, nit, razon_social, sector, correo, telefono, ciudad) VALUES
(2,    '900123456-1', 'Soluciones Andinas TI S.A.S.', 'Tecnología',   'talento@andinasti.co',  '6015550101', 'Bogotá'),
(NULL, '901987654-2', 'Logística Express del Centro', 'Logística',    'rrhh@logexcentro.co',   '6015550202', 'Bogotá'),
(NULL, '800555777-3', 'Banco Comunitario Kennedy',    'Financiero',   'practicas@bck.co',      '6015550303', 'Bogotá');

INSERT INTO aprendices (id_usuario, nombres, apellidos, documento, correo, telefono, programa, ficha, ciudad) VALUES
(3,    'Laura',  'Gómez Ruiz',     '1000000001', 'laura.gomez@soy.sena.edu.co',   '3001112233', 'Análisis y Desarrollo de Software', '3336169', 'Bogotá'),
(NULL, 'Andrés', 'Pérez Castillo', '1000000002', 'andres.perez@soy.sena.edu.co',  '3104445566', 'Análisis y Desarrollo de Software', '3336169', 'Bogotá'),
(NULL, 'Camila', 'Torres Díaz',    '1000000003', 'camila.torres@soy.sena.edu.co', '3207778899', 'Gestión Empresarial',               '2899001', 'Soacha'),
(NULL, 'Julián', 'Rojas Mendoza',  '1000000004', 'julian.rojas@soy.sena.edu.co',  '3156667788', 'Análisis y Desarrollo de Software', '3336169', 'Bogotá');

INSERT INTO ofertas (id_empresa, titulo, descripcion, area, modalidad, cupos, fecha_publicacion, fecha_cierre, estado) VALUES
(1, 'Aprendiz de Desarrollo Web',     'Apoyo en el desarrollo de módulos web con Node.js y React.',          'Desarrollo de software', 'HIBRIDA',    2, '2026-10-01', '2026-12-15', 'ABIERTA'),
(1, 'Aprendiz de Pruebas de Software','Apoyo en pruebas funcionales y de API con Postman.',                  'Calidad de software',    'REMOTA',     1, '2026-10-05', '2026-12-01', 'ABIERTA'),
(2, 'Aprendiz de Soporte TI',         'Mesa de ayuda, inventario de equipos y soporte a usuarios.',          'Infraestructura',        'PRESENCIAL', 3, '2026-09-20', '2026-11-30', 'ABIERTA'),
(3, 'Aprendiz Analista de Datos',     'Construcción de reportes y tableros de indicadores.',                 'Análisis de datos',      'PRESENCIAL', 1, '2026-08-01', '2026-09-30', 'CERRADA'),
(3, 'Aprendiz de Marketing Digital',  'Apoyo en campañas digitales, redes sociales y analítica web.',        'Mercadeo',               'HIBRIDA',    2, '2026-10-12', '2026-12-20', 'ABIERTA'),
(2, 'Aprendiz de Bases de Datos',     'Apoyo en consultas SQL, respaldos y documentación de procesos.',      'Desarrollo de software', 'PRESENCIAL', 1, '2026-10-15', '2026-12-10', 'ABIERTA');

INSERT INTO postulaciones (id_oferta, id_aprendiz, estado, comentario) VALUES
(1, 1, 'PENDIENTE', 'Me interesa trabajar con React.'),
(2, 2, 'ACEPTADA',  'Tengo experiencia básica en Postman.'),
(3, 3, 'RECHAZADA', NULL),
(1, 4, 'PENDIENTE', 'Agoté mi contrato de aprendizaje en otro programa y busco pasantía.'),
(5, 1, 'PENDIENTE', NULL);
