![portada_haciendola](https://github.com/hbaravalle/backend-haciendola-challenge/assets/24690415/43f3f53c-3178-470e-8103-b52938d38821)
# [Frontend] Challenge Full Stack, Haciendola

## Prerrequisitos

Tener instalados Node y NPM:

- [Node.js](https://nodejs.org/es/download/)
- [npm](https://www.npmjs.com/get-npm) (Node Package Manager)

## Funcionalidades de la Aplicación

### Autenticación

- [X] Login de usuario
- [X] Registro de usuario
- [X] Recupero de contraseña a través de código de único uso por mail (solo en modo test con Mailtrap.io)

### Productos

- [X] Listado de productos con paginación
- [X] Crear un producto
- [X] Editar un producto
- [X] Borrar (soft) un producto

## Primeros Pasos

Sigue estos pasos para ejecutar (localmente) la aplicación de React:

### 1. Clonar el repositorio

```bash
git clone https://github.com/hbaravalle/frontend-haciendola-challenge
cd frontend-haciendola-challenge
```

### 2. Instalar dependencias

Navega al directorio del proyecto y ejecuta:

```bash
npm install
```

### 3. Iniciar la aplicación

Ejecuta el siguiente comando para iniciar la aplicación en modo de desarrollo:

```bash
npm run dev
```

### 4. Usuarios de prueba

En caso de haber ejecutado los seeders del proyecto backend, se habrán creado tres usuarios de prueba:

#### Leia Organa
- username: leiaorgana
- email: leia@starwars.com

#### Luke Skywalker
- username: lukeskywalker
- email: luke@starwars.com

#### Han Solo
- username: hansolo
- email: han@starwars.com

> La contraseña de estos usuarios será la que se haya configurado en las variables de entorno de la API.

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

https://github.com/hbaravalle/frontend-haciendola-challenge/assets/24690415/e31c855c-2cac-4741-bf0a-614b410a6fc1

De esta manera, se podrá probar la funcionalidad de reseteo de contraseña sin necesidad de enviar correos electrónicos reales, asegurando el funcione correctamente en un entorno controlado.

## En desarrollo (Branch refactor)
- [ ] Formik y Yup para manejo de formularios y sus validaciones
- [ ] Refactorización y modularización del componente ProductList
- [ ] Refactorización y modularización general
- [ ] Detalles de diseño

---

¡Gracias por la oportunidad!
