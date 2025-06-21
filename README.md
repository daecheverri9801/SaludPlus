SaludPlus: Sistema de Diagnóstico de Enfermedades Asistido por IA

SaludPlus es un sistema de diagnóstico de enfermedades asistido por IA que utiliza Node.js, React, PostgreSQL y la API de OpenAI (o Llama 3 a través de Ollama) para ofrecer diagnósticos precisos y personalizados.
Características:

API REST para:
- Pacientes, Médicos
- Citas médicas (CRUD)
- Historiales clínicos y Diagnósticos
- Generación de PDFs (incapacidades médicas)
- Integración con Ollama (DeepSeek) para generación de diagnósticos automáticos en JSON
- Validación de horarios de citas
- Arquitectura modular y sencilla

Requisitos Previos:
Lista de software y herramientas que deben estar instalados antes de comenzar.

- Node.js (versión 16 o superior)
- npm
- PostgreSQL
- Ollama (https://ollama.com/)
- Visual Studio Code

Instalación paso a paso

#Codigo#
1. Clonar el repositorio: https://github.com/daecheverri9801/SistemaDiagnosticoEnfermedades cd SistemaDiagnosticoEnfermedades

#Base de Datos#
1. Creación de la base de datos en Postgres con nombre "SistemaDiagnosticoEnfermedades".
2. Del repositorio abrir el archivo "Script.sql".
3. En Postgres ejecutar uno a uno el script.

#Modelo de IA#
1. Abrir Ollama.
2. Ejecutar un CMD o Powershell.
3. Instalar el modelo IA con el comando: "ollama run llama3.2:latest" (sin comillas).
4. Verificar la instalación con el comando: "ollama list" (sin comillas).

#Configuración Variables de Entorno#
1. En Visual Studio Code, abrir el archivo SistemaDiagnosticoEnfermedades/backend/src/config/db.js
2. Cambiar la contraseña por la de su postgres.

#Instalacion de dependencias#
1. Abrir una terminal en VSC.
2. Ir al backend con el comando: cd backend.
3. Ejecutar el instalador de dependencias: npm install.
4. Abrir otra terminal en VSC.
5. Ir al frontend con el comando: cd frontend.
6. Ejecutar el instalador de dependencias: npm install.

#Ejecución del proyecto#
1. En la terminal del backend ejecutar el comando: npm start.
2. En la terminal del frontend ejecutar el comando: npm start.
3. Escribir "y" cuando solicite instanciar la ejecución en otro puerto. 

