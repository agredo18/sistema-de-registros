-- ============================================================================
--  BD de PRUEBA que simula el ERP institucional (erp_sena).
--  El backend_porteria consulta aquí las personas (aprendices/instructores)
--  por cédula o UUID. En producción se apuntaría al ERP real.
--  Este script solo corre la PRIMERA vez que se inicializa el volumen de datos.
-- ============================================================================

CREATE DATABASE erp_sena;

\connect erp_sena

CREATE TABLE IF NOT EXISTS public.personas (
    "idPersona" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre      varchar(200) NOT NULL,
    cedula      varchar(20)  UNIQUE NOT NULL,
    correo      varchar(200),
    telefono    varchar(30),
    direccion   varchar(255),
    estado      varchar(20)  DEFAULT 'ACTIVO'
);

INSERT INTO public.personas (nombre, cedula, correo, telefono, direccion) VALUES
    ('Andres Felipe Munoz Agredo',  '1075123456', 'andres@sena.edu.co', '3104567890', 'Palestina, Huila'),
    ('Laura Valentina Gomez Ruiz',  '1082334455', 'laura@sena.edu.co',  '3117654321', 'Neiva, Huila'),
    ('Carlos Andres Ramirez Ortiz', '1083445566', 'carlos@sena.edu.co', '3125551212', 'Pitalito, Huila'),
    ('Diana Marcela Lopez Vargas',  '1084556677', 'diana@sena.edu.co',  '3134445566', 'Garzon, Huila'),
    ('Wilson Perez Coordinador',    '12345678',   'wilson@sena.edu.co', '3009998877', 'Neiva, Huila');
