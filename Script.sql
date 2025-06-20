tabla paciente
CREATE TABLE paciente (
    id_paciente SERIAL PRIMARY KEY,
    usuario VARCHAR(50),
    nombre VARCHAR(100),
    cedula VARCHAR(20),
    correo_electronico VARCHAR(100),
    celular VARCHAR(20),
    direccion VARCHAR(100),
    fecha_registro TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    idauth TEXT
);

tabla medico
CREATE TABLE medico (
    id_medico SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    especialidad VARCHAR(100),
    registro_medico VARCHAR(50),
    correo_electronico VARCHAR(100),
    cedula VARCHAR(20), 
    direccion VARCHAR(100),
    celular VARCHAR(20),
    idauth TEXT
);

tabla historial_clinico
CREATE TABLE historial_clinico (
    id_historial SERIAL PRIMARY KEY,
    id_paciente INTEGER REFERENCES paciente(id_paciente),
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

tabla consulta
CREATE TABLE consulta (
    id_consulta SERIAL PRIMARY KEY,
    id_historial INTEGER REFERENCES historial_clinico(id_historial),
    id_medico INTEGER REFERENCES medico(id_medico),
    fecha_consulta TIMESTAMP WITHOUT TIME ZONE,
    motivo TEXT,
    observaciones TEXT
);

tabla diagnostico
CREATE TABLE diagnostico (
    id_diagnostico SERIAL PRIMARY KEY,
    id_consulta INTEGER REFERENCES consulta(id_consulta),
    codigo_icd VARCHAR(20),
    descripcion TEXT,
    tratamiento TEXT
);

tabla autorizacion_examen_procedimiento
CREATE TABLE autorizacion_examen_procedimiento (
    id_autorizacion SERIAL PRIMARY KEY,
    id_paciente INTEGER REFERENCES paciente(id_paciente),
    id_medico INTEGER REFERENCES medico(id_medico),
    id_consulta INTEGER REFERENCES consulta(id_consulta),
    tipo VARCHAR(100),
    descripcion TEXT,
    fecha_emision TIMESTAMP WITHOUT TIME ZONE,
    fecha_expiracion DATE,
    instrucciones TEXT,
    estado VARCHAR(20) DEFAULT 'ACTIVA'
);

tabla autorizacion_medicamento
CREATE TABLE autorizacion_medicamento (
    id_autorizacion SERIAL PRIMARY KEY,
    id_paciente INTEGER REFERENCES paciente(id_paciente),
    id_medico INTEGER REFERENCES medico(id_medico),
    id_consulta INTEGER REFERENCES consulta(id_consulta),
    medicamento VARCHAR(100),
    dosis TEXT,
    frecuencia TEXT,
    duracion TEXT,
    fecha_emision TIMESTAMP WITHOUT TIME ZONE,
    fecha_expiracion DATE,
    justificacion TEXT,
    estado VARCHAR(20) DEFAULT 'ACTIVA'
);

tabla incapacidad_medica
CREATE TABLE incapacidad_medica (
    id_incapacidad SERIAL PRIMARY KEY,
    id_paciente INTEGER REFERENCES paciente(id_paciente),
    id_medico INTEGER REFERENCES medico(id_medico),
    id_consulta INTEGER REFERENCES consulta(id_consulta),
    fecha_emision TIMESTAMP WITHOUT TIME ZONE,
    fecha_inicio DATE,
    fecha_fin DATE,
    dias_incapacidad INTEGER,
    diagnostico TEXT,
    recomendaciones TEXT,
    estado VARCHAR(20) DEFAULT 'ACTIVA'
);

tabla recuperacion_contraseña
CREATE TABLE recuperacion_contraseña (
    id_recuperacion SERIAL PRIMARY KEY,
    id_paciente INTEGER REFERENCES paciente(id_paciente),
    token VARCHAR(100),
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP WITHOUT TIME ZONE,
    utilizado BOOLEAN DEFAULT false
);

tabla cita_medica
CREATE TABLE cita_medica (
    id_cita SERIAL PRIMARY KEY,
    id_paciente INTEGER NOT NULL REFERENCES paciente(id_paciente),
    id_medico INTEGER NOT NULL REFERENCES medico(id_medico),
    fecha_cita TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    motivo TEXT
);