
![portada_haciendola](https://github.com/hbaravalle/backend-haciendola-challenge/assets/24690415/43f3f53c-3178-470e-8103-b52938d38821)
                      
# [Backend] Challenge Full Stack, Haciendola

## Prerrequisitos

Tener instalados Node y NPM:

- [Node.js](https://nodejs.org/es/download/)
- [npm](https://www.npmjs.com/get-npm) (Node Package Manager)

## Endpoints de la API

### Autenticación

- `POST /api/auth/register` → Registrar un nuevo usuario.
- `POST /api/auth/login` → Iniciar sesión de un usuario.

### Mailtrap Test Mode

- `POST /api/auth/otp` → Enviar un código de un solo uso (OTP) para restablecer la contraseña.
- `POST /api/auth/otp-check` → Verificar el código OTP.
- `POST /api/auth/reset-password` → Restablecer la contraseña del usuario.

> Mas información para testar el reseteo de contraseña en el apartado 

### Productos

- `GET /api/products/` → Listar todos los productos. Admite por query string el número de página. Ejemplo: `/products?page=2`.
- `GET /api/products/:product` → Obtener los detalles de un producto específico a través de su SKU o Handle.
- `POST /api/products/` → Crear un nuevo producto.
- `PUT /api/products/:product` → Actualizar un producto existente a través de su SKU o Handle.
- `DELETE /api/products/:product` → Eliminar (soft) un producto a través de su SKU o Handle.

## Primeros Pasos

Seguir los siguientes pasos para la correcta ejecución (local) del proyecto:

### 1. Clonar el repositorio

```bash
git clone https://github.com/hbaravalle/backend-haciendola-challenge
cd backend-haciendola-challenge
```

### 2. Instalar dependencias

Navegar al directorio del proyecto y ejecutar:

```bash
npm install
```

### 3. Crear variables de entorno

Crea un archivo `.env` en la raíz del proyecto y agrega tus variables de entorno. Por ejemplo:

```plaintext
APP_PORT=

DB_DATABASE=
DB_USER=
DB_PASS=
DB_HOST=
DB_PORT=
DB_DIALECT=

SEEDER_USER_PASS=

NODEMAILER_FROM=
NODEMAILER_USER=
NODEMAILER_PASS=

JWT_SECRET=
```

### 4. Inicializar la base de datos

Ejecuta el siguiente comando para crear la base de datos (si no existe) con el nombre especificado en las variables de entorno. Además, se ejecutarán seeders necesarios para tener datos de prueba:

```bash
npm run db-init
```

### 5. Ejecutar seeders

Si se necesita borrar y ejecutar varios datos de prueba en la base de datos, usar el siguiente comando:

```bash
npm run seeders
```

### 6. Ejecutar el servidor

Inicia el servidor de desarrollo:

```bash
npm start
```
## Reset de contraseña

Para probar el reseteo de contraseña, se puede utilizar Mailtrap en modo test. A continuación, se indican los pasos a seguir:

1. Crear una cuenta en Mailtrap.

2. Configurar Mailtrap en el proyecto. Generalmente, esto implica establecer las credenciales de Mailtrap en las variables de entorno de la API. Ejemplo de los datos que se pueden encontrar:

```
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=tu_username_mailtrap
MAIL_PASSWORD=tu_password_mailtrap
MAIL_FROM_ADDRESS=no-reply@tu-dominio.com
MAIL_FROM_NAME="Tu Proyecto"
```

3. Ejecutar (desde el Frontend) el proceso de reseteo de contraseña desde tu aplicación:
4. Revisar la bandeja de entrada en Mailtrap para verificar que el correo de reseteo de contraseña haya sido enviado y recibido correctamente.

### Video del funcionamiento

https://github.com/hbaravalle/backend-haciendola-challenge/assets/24690415/9cc698cc-ebc4-44e1-8b56-2fa2b033010a

De esta manera, se podrá probar la funcionalidad de reseteo de contraseña sin necesidad de enviar correos electrónicos reales, asegurando el funcione correctamente en un entorno controlado.

## En desarrollo
- [ ] Express validator
- [ ] Creación de middlewares para evitar repetir código
- [ ] Refactorización y creación de servicios

---

¡Gracias por la oportunidad!
