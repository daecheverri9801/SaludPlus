class PacienteBuilder {
    constructor() {
        this.paciente = {}
    }

    setUsuario(usuario) {
        this.paciente.usuario = usuario
        return this
    }

    setNombre(nombre) {
        this.paciente.nombre = nombre
        return this
    }

    setCedula(cedula) {
        this.paciente.cedula = cedula
        return this
    }

    setCorreo(correo) {
        this.paciente.correo_electronico = correo
        return this
    }

    setTelefono(telefono) {
        this.paciente.telefono = telefono
        return this
    }

    setFechaNacimiento(fechaNacimiento) {
        this.paciente.fecha_nacimiento = fechaNacimiento
        return this
    }

    setIdAuth(idauth) {
        this.paciente.idauth = idauth
        return this
    }

    setCelular(celular) {
        this.paciente.celular = celular
        return this
    }

    setDireccion(direccion) {
        this.paciente.direccion = direccion
        return this
    }

    build() {
        return this.paciente
    }
}

module.exports = PacienteBuilder