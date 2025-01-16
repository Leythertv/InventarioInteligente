# Inventario Inteligente - Aplicación de Gestión de Inventario Inteligente

Esta es una aplicación de gestión de inventario de pila completa diseñada para proporcionar una interfaz fácil de usar para gestionar su inventario. Consiste en una API de backend construida con Node.js y **Express.js**, y una interfaz de usuario frontend construida con React y Vite.

## Estructura del Proyecto

-   `backend/`: Contiene el código del lado del servidor, las API, la lógica de la base de datos, y la configuración del servidor utilizando Express.js. También contiene un archivo `database.sql` para crear la estructura de base de datos necesaria.
-   `frontend/`: Contiene el código del lado del cliente, los componentes de la interfaz de usuario y la lógica del frontend, construidos con Vite.
-   `.gitignore`: Especifica intencionalmente los archivos no rastreados que Git debe ignorar, como los archivos `.env` y las carpetas `node_modules`.
-   `README.md`: Este archivo, que proporciona documentación sobre el proyecto, su uso y configuración.

## Empezando

### Prerrequisitos

Antes de comenzar, asegúrese de tener instalado lo siguiente:

-   [Node.js(https://nodejs.org/) (versión 16 o superior recomendada)
-   [npm](https://www.npmjs.com/) (viene con Node.js)
-   Un servidor de base de datos (por ejemplo, SQL Server Management Studio)

### Instalación

1.  **Clona el repositorio:**

    ```sh
    git clone https://github.com/Leythertv/InventarioInteligente.git
    ```

2.  **Navega al directorio del proyecto:**

    ```sh
    cd InventarioInteligente
    ```

3.  **Configurar el Backend**

    *   Navega a la carpeta `backend`:

        ```sh
        cd backend
        ```

    *   **Configuración de la Base de Datos**:
        *   Localiza el archivo `database.sql` en la carpeta `backend`.
        *   Utiliza SQL Server Management Studio (o tu cliente de SQL Server preferido) para crear una nueva base de datos.
        *   Ejecuta las consultas SQL en el archivo `database.sql` para crear las tablas y el esquema necesarios para la aplicación.
    *   Instala las dependencias:

        ```sh
        npm install
        ```

    *   Crea un archivo `.env` en la carpeta `backend`. Consulta el archivo `.envexample` para ver las variables de entorno requeridas.
    *   Cambia el nombre de `.envexample` a `.env` y actualiza las variables con tus credenciales de base de datos reales y otras configuraciones.
    *   Inicia el servidor backend:

        ```sh
        npm run dev
        ```

    *   El servidor backend, basado en Express.js, se ejecutará en el puerto `5000`.

4.  **Configurar el Frontend**

    *   Navega a la carpeta `frontend`:

        ```sh
        cd ../frontend
        ```

    *   Instala las dependencias:

        ```sh
        npm install
        ```

    *   Inicia la aplicación frontend con Vite:

        ```sh
        npm run dev
        ```

    *   La aplicación frontend estará disponible en `http://localhost:5173` de forma predeterminada.

5.  **Acceder a la Aplicación**

    Abre tu navegador y ve a la URL proporcionada para tu aplicación frontend (`http://localhost:5173` de forma predeterminada). La API de backend, basada en Express.js, se ejecutará en `http://localhost:5000`.

## Variables de Entorno

La aplicación utiliza variables de entorno para su configuración. Consulta el archivo `.envexample` en la carpeta `backend` para ver las variables requeridas.

**Importante**: Crea un archivo `.env` en la carpeta `backend` cambiando el nombre de `.envexample` a `.env`, luego actualiza las variables en este archivo `.env` con tus credenciales reales. **Nunca confirmes el archivo `.env` en el control de versiones**. El archivo `.gitignore` asegura que esto no suceda.

## Contribuciones

Si deseas contribuir al proyecto, por favor, haz un fork del repositorio, realiza tus cambios en una nueva rama y crea una solicitud de extracción.
