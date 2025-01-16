# Inventario Inteligente - Intelligent Inventory Management Application

This is a full-stack inventory management application designed to provide a user-friendly interface for managing your inventory. It consists of a backend API built with Node.js and a frontend user interface built with React and Vite.

## Project Structure

-   `backend/`: Contains the server-side code, APIs, database logic, and server setup. Also contains a `database.sql` file for creating the necessary database structure.
-   `frontend/`: Contains the client-side code, user interface components, and frontend logic, built with Vite.
-   `.gitignore`: Specifies intentionally untracked files that Git should ignore, such as `.env` files and `node_modules` folders.
-   `README.md`: This file, providing documentation about the project, usage, and setup.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (version 16 or higher recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   A database server (e.g., SQL Server Management Studio)

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/Leythertv/InventarioInteligente.git
    ```

2.  **Navigate to the project directory:**

    ```sh
    cd InventarioInteligente
    ```

3.  **Set up the Backend**

    *   Navigate to the backend folder:

        ```sh
        cd backend
        ```
    *   **Database Setup**:
        *   Locate the `database.sql` file in the `backend` folder.
        *   Use SQL Server Management Studio (or your preferred SQL Server client) to create a new database.
        *   Execute the SQL queries in the `database.sql` file to create the necessary tables and schema for the application.
    *   Install dependencies:

        ```sh
        npm install
        ```

    *   Create a `.env` file in the `backend` folder. See `.envexample` for required environment variables.
    *   Rename `.envexample` to `.env` and update the variables with your actual database credentials and other configurations.
    *   Start the backend server:

        ```sh
        npm run dev
        ```

    *   The backend server will be running on port `5000`.

4.  **Set up the Frontend**

    *   Navigate to the frontend folder:

        ```sh
        cd ../frontend
        ```

    *   Install dependencies:

        ```sh
        npm install
        ```

    *   Start the frontend application with Vite:

        ```sh
        npm run dev
        ```

    *   The frontend application will be available at `http://localhost:5173` by default.

5.  **Access the Application**

    Open your browser and go to the provided url for your frontend application (`http://localhost:5173` by default). The backend API will be running at `http://localhost:5000`.

## Environment Variables

The application uses environment variables for configuration. See the `.envexample` file in the `backend` folder for the required variables.

**Important**: Create a `.env` file in the `backend` folder by renaming the `.envexample` to `.env`, then update the variables in this `.env` file with your actual credentials. **Never commit the `.env` file to version control**. The `.gitignore` file ensures this is not committed.

## Contributing

If you want to contribute to the project, please fork the repository, make your changes in a new branch, and create a pull request.

## License

[Add your license here if you have one]
