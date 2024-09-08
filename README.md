# File Store API

This project is a file store API developed using Express and TypeScript, with PostgreSQL and Prisma for database management. It provides functionality for managing products, users, and blog posts, including features for purchasing and downloading files. The API also includes search capabilities and documentation via Swagger.

## Features

- **Product Management:** Create, update, delete, and view products.
- **User System:** User registration and login with email.
- **Payment and Purchase:** Buy products through a payment gateway and receive download links.
- **Blog:** Manage and view blog posts.
- **Categories:** Manage and view product & blog categories.
- **Search:** Search functionality for products.
- **API Documentation:** API documentation available through Swagger.
- **File Upload:** File uploads handled with Multer.
- **Validation:** Input validation using express-validator.
- **Authentication:** JSON Web Token (JWT) for session management.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/majidmovahedi/nodejs-express-file-store.git
   cd repository
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Copy the `.env-sample` file to `.env` and update the values with your configuration.

   ```bash
   cp .env-sample .env
   ```

4. **Set Up the Database:**

   Use Prisma to apply the database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. **Run the Project:**

   To start the project:

   ```bash
   npm start
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

## Testing

To run tests, Jest is used. Execute tests with the following command:

```bash
npm test
```

## Contributing

To contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your changes.
3. Submit a Pull Request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

For questions or suggestions, please contact us:

- Email: majidmovahedinasab@gmail.com
