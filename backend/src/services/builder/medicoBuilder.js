class MedicoBuilder {
    constructor() {
        this.medico = {};
    }

    setNombre(nombre) {
        this.medico.nombre = nombre;
        return this;
    }

    setEspecialidad(especialidad) {
        this.medico.especialidad = especialidad;
        return this;
    }

    setRegistroMedico(registro) {
        this.medico.registro_medico = registro;
        return this;
    }

    setCorreo(correo) {
        this.medico.correo_electronico = correo;
        return this;
    }

    setIdAuth(idauth) {
        this.medico.idauth = idauth;
        return this;
    }

    setCedula(cedula) {
        this.medico.cedula = cedula;
        return this;
    }

    setDireccion(direccion) {
        this.medico.direccion = direccion;
        return this;
    }

    setCelular(celular) {
        this.medico.celular = celular;
        return this;
    }

    build() {
        return this.medico;
    }
}

module.exports = MedicoBuilder;