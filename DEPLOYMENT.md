# Deployment Guide for Ecommerce-B-to-B

This guide provides step-by-step instructions to deploy your full-stack application.

## Prerequisites

- **Docker** and **Docker Compose** installed on your deployment server (or local machine for testing).
- A **MySQL Database** (can be a managed service like AWS RDS, Railway MySQL, or a Docker container).

## Environment Variables

You must set the following environment variables in your deployment environment (e.g., via a `.env` file or your hosting platform's dashboard).

### Backend Variables

| Variable | Description | Default (if not set) |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | MySQL Connection URL | `jdbc:mysql://localhost:3306/B2BEcom` |
| `SPRING_DATASOURCE_USERNAME` | Database Username | `root` |
| `SPRING_DATASOURCE_PASSWORD` | Database Password | `cdac` |
| `JWT_SECRET` | Secret key for JWT signing | *(Default hardcoded dev key)* |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed origins | `*` |

### Frontend Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Full URL to your backend API | `http://localhost:8080/api` |

> [!IMPORTANT]
> The `VITE_API_BASE_URL` must be set **at build time** for the frontend. If you are using Docker Compose, you might need to adjust how this is passed or rebuild the image with the correct ARG.

## Deployment Method: Docker Compose (Recommended)

1.  **Clone the repository** to your server.
2.  **Create a `.env` file** in the root directory with your production values:
    ```env
    DB_USERNAME=your_db_user
    DB_PASSWORD=your_db_password
    SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/B2BEcom
    JWT_SECRET=your_secure_random_secre_key_minimum_256_bits
    CORS_ALLOWED_ORIGINS=http://your-frontend-domain.com
    ```
3.  **Run the application**:
    ```bash
    docker-compose up -d --build
    ```

## Deployment Method: Cloud Platforms (Render, Railway, etc.)

### Backend
1.  Connect your GitHub repository.
2.  Select `spring_boot_mvc_template` as the specific root directory.
3.  Add the **Environment Variables** listed above.
4.  The provided `Dockerfile` will handle the build and run process.

### Frontend
1.  Connect your GitHub repository.
2.  Select `frontend` as the root directory.
3.  Add `VITE_API_BASE_URL` to the **Environment Variables** (set to your deployed Backend URL).
4.  The provided `Dockerfile` serves the app using Nginx.

## Troubleshooting

### CORS Issues
If you see "CORS error" in the browser console:
- Check that `CORS_ALLOWED_ORIGINS` in the backend includes your frontend's domain (e.g., `https://myapp.com`).
- Ensure the frontend is calling the correct `VITE_API_BASE_URL`.

### Database Connection Failures
- Verify `SPRING_DATASOURCE_URL` is correct.
- Ensure the database server is running and accessible from the backend container.
- If using Docker Compose, the hostname for the database is `db` (as defined in `docker-compose.yml`).

### Build Failures
- **Backend**: Ensure Maven options are correct. The Dockerfile skips tests (`-DskipTests`) to speed up builds.
- **Frontend**: Check for linting errors. The build command `npm run build` will fail if there are TypeScript or ESLint errors.
