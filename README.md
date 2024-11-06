# File Store API

This project is a robust API for file storage developed using Express and TypeScript, with PostgreSQL and Prisma for database management. It offers functionalities for managing products, users, and blog posts, as well as features for purchasing and downloading files. The API includes search capabilities for finding products and blog posts, with comprehensive documentation available via Swagger.

## Features

- **Product Management:** Create, update, delete, and view products.
- **User System:** User registration and login with email.
- **Payment and Purchase:** Buy products through a payment gateway and receive download links.
- **Blog Management:** Manage and view blog posts.
- **Categories:** Manage and view product and blog categories.
- **Search Functionality:** Search products and blog posts effectively.
- **API Documentation:** Comprehensive API documentation available through Swagger.
- **File Uploads:** Handle file uploads using Multer.
- **Input Validation:** Validate inputs using express-validator.
- **Authentication:** Use JSON Web Token (JWT) for session management.

## Prerequisites

Ensure you have the following installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)


## Installation

### Using Docker

1. **Clone the Repository:**

   Open your terminal and run the following commands:

   ```bash
   git clone https://github.com/majidmovahedi/nodejs-express-file-store.git
   cd nodejs-express-file-store
   ```

2. **Build the Docker Image:**

   Make sure you are in the project directory and then build the Docker image using the following command:

   ```bash
   docker build -t file-store-api .
   ```

3. **Set Up the Database:**

   You can run a PostgreSQL container if you don't have it running already. Use the following command to run PostgreSQL in Docker:

   ```bash
   docker run --name postgres-db -e POSTGRES_USER=your_user -e POSTGRES_PASSWORD=your_password -e POSTGRES_DB=your_database -p 5432:5432 -d postgres
   ```

   Replace `your_user`, `your_password`, and `your_database` with your desired values.

4. **Run the Docker Container:**

   To run the application and link it to your PostgreSQL database container, use the following command:

   ```bash
   docker run --name file-store-api -p 8000:8000 --link postgres-db:db -d file-store-api
   ```

5. **Configure Environment Variables:**

   If you have a `.env` file in your project root, ensure it contains the necessary database connection details. If using the `.env` file, run the container with:

   ```bash
   docker run --name file-store-api -p 8000:8000 --env-file .env --link postgres-db:db -d file-store-api
   ```

6. **Run Database Migrations:**

   If you haven't set up the database yet, you can run the Prisma migrations from within the Docker container:

   ```bash
   docker exec -it file-store-api npx prisma migrate dev
   ```

## Usage

API documentation is available at:

[http://localhost:8000/api-docs](http://localhost:8000/api-docs)

## Project Structure

- `src/`: Source code of the project.
  - `controllers/`: API controllers.
  - `middlewares/`: Middleware functions.
  - `models/`: Prisma models.
  - `routes/`: API routes.
  - `utils/`: Utility functions and helpers.
- `prisma/`: Prisma configuration and migration files.
