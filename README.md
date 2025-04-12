## Task Manager API - NestJS

Este proyecto es una API RESTful desarrollada con [Nest](https://github.com/nestjs/nest), diseñada para gestionar tareas. Implementa conceptos modernos como arquitectura modular, manejo de errores global, cache con Redis, y persistencia con PostgreSQL.

## Tecnologías Utilizadas

- **NestJS** (Framework principal)
- **TypeScript**
- **PostgreSQL** (base de datos relacional)
- **TypeORM** (ORM para manejo de datos)
- **Redis** (sistema de cache)
- **Docker** (para contenedores)
- **Postman** (para pruebas)
- **Middlewares personalizados** (para logging)
- **Filtros de excepción globales**
- **Validación con DTOs**

---

## ⚙️ Instalación

1. **Clonar el repositorio**

````bash
git clone https://github.com/JoaquinParada/task-manager.git
cd task-manager


## Compile and run the project

```bash
# development
$ npm run start

# Levantar en desarrollo
$ npm run start:dev
````

## Configurar variables de entorno

El archivo .env.template te brinda una guía de qué valores deben estar presentes para que la app funcione correctamente. Editá el archivo .env con tus credenciales locales

## Configurar variables de entorno

Asegurate de que Docker esté corriendo.

```bash
docker-compose up --build
```

## Requisitos

Node.js (v18+ recomendado)

Docker y Docker Compose

PostgreSQL y Redis si lo corrés fuera de Docker

## Scripts útiles

```bash
## Poblar la base de datos con datos iniciales de usuarios
$ npm run seed
```
