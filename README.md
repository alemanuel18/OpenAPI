# FakeAPI Store 🚀

Este proyecto es una API RESTful desarrollada en **Node.js** y **Express** bajo el enfoque **API-First** (Diseño Primero). Toda la estructura, validación y documentación de la API están definidas y gobernadas por la especificación de OpenAPI 3.1.1 (`openapi.yaml`).

---

## 📋 Características Principales

*   **Enfoque API-First**: Diseño y documentación de contratos primero a través de la especificación OpenAPI (Swagger).
*   **Validación Estricta**: Validación automática de peticiones y respuestas en tiempo de ejecución utilizando `express-openapi-validator`.
*   **Documentación Interactiva**: Swagger UI integrado y disponible directamente en la ruta `/docs`.
*   **Autenticación JWT**: Seguridad implementada mediante JSON Web Tokens (JWT) para proteger rutas sensibles.
*   **Simulación de Datos**: Datos mockeados en memoria para pruebas rápidas de usuarios y productos.

---

## 🛠️ Tecnologías Utilizadas

*   **Runtime**: Node.js (v18+)
*   **Framework**: Express
*   **Validación de OpenAPI**: `express-openapi-validator`
*   **Documentación**: `swagger-ui-express` y `yamljs`
*   **Autenticación**: `jsonwebtoken`
*   **Variables de Entorno**: `dotenv`

---

## 📁 Estructura del Proyecto

```text
├── src/
│   └── index.js          # Servidor Express, lógica de endpoints y middlewares
├── .env                  # Configuración de variables de entorno (local)
├── .gitignore            # Archivos ignorados por Git
├── openapi.yaml          # Especificación oficial de la API (OpenAPI 3.1.1)
├── package.json          # Script de npm y dependencias del proyecto
└── README.md             # Documentación del repositorio (este archivo)
```

---

## 🚀 Instalación y Configuración

### 1. Requisitos Previos

Asegúrate de tener instalado **Node.js** (versión 18 o superior) y **npm**.

### 2. Clonar e Instalar Dependencias

Clona este repositorio en tu máquina local y ejecuta:

```bash
npm install
```

### 3. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (puedes tomar como referencia el archivo `.env` existente):

```env
PORT=3005
JWT_SECRET=tu_clave_secreta_aqui
```

*   `PORT`: Puerto en el que correrá el servidor local (por defecto `3005`).
*   `JWT_SECRET`: Llave secreta para firmar y verificar los tokens JWT.

---

## 💻 Ejecución del Proyecto

### Modo Desarrollo (con recarga automática)

Ejecuta el servidor en modo desarrollo utilizando la bandera `--watch` nativa de Node.js:

```bash
npm run dev
```

### Modo Producción

Para iniciar el servidor en producción:

```bash
npm start
```

El servidor estará disponible en `http://localhost:3005`.

---

## 📖 Documentación de la API (Swagger UI)

Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva en:

👉 **[http://localhost:3005/docs](http://localhost:3005/docs)**

Desde esta interfaz podrás ver todos los schemas de datos, probar los diferentes endpoints y configurar el token de autenticación para interactuar con la API directamente.

---

## 🔐 Autenticación y Seguridad

La API utiliza un esquema de seguridad de tipo **Bearer Token (JWT)**. Para interactuar con los endpoints protegidos:

1.  **Obtener Token**: Envía una petición `POST` a `/users/login` con las credenciales de un usuario existente.
2.  **Usar Token**: Agrega la cabecera `Authorization` en tus peticiones subsecuentes:
    ```http
    Authorization: Bearer <TU_TOKEN_JWT>
    ```

### Credenciales por Defecto (Mock Data)
Puedes iniciar sesión con cualquiera de los siguientes usuarios cargados en memoria:

*   **Email**: `john@example.com` | **Password**: `password123`
*   **Email**: `jane@example.com` | **Password**: `password123`
*   **Email**: `bob@example.com`  | **Password**: `password123`

---

## 🛣️ Endpoints Disponibles

A continuación se presenta un resumen de las rutas disponibles en la API:

### 🌟 Rutas Públicas (Sin JWT)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **GET** | `/hello` | Mensaje de prueba básico ("Hello World!") |
| **GET** | `/products` | Obtiene la lista de todos los productos disponibles |
| **GET** | `/products/{id}` | Obtiene los detalles de un producto específico |
| **POST** | `/users/login` | Inicia sesión y retorna el token JWT |

### 🔒 Rutas Protegidas (Requieren cabecera `Authorization: Bearer <JWT>`)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **POST** | `/users` | Registra un nuevo usuario en la plataforma |
| **GET** | `/users/me` | Obtiene la información del perfil del usuario autenticado |
| **GET** | `/users/{id}` | Obtiene los datos públicos de un usuario específico |
| **POST** | `/users/{id}` | Actualiza la información de un usuario |
| **POST** | `/products` | Agrega un nuevo producto a la tienda |
| **POST** | `/products/{id}` | Actualiza los detalles de un producto existente |
| **DELETE** | `/products/{id}` | Elimina un producto por su ID |

---

## ✍️ Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo de la especificación `openapi.yaml` para más información.
