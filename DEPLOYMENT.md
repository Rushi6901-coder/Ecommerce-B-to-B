# 🚀 How to Make Your Project Live on Render

This guide will help you deploy your **Spring Boot Backend** and **React Frontend** to Render.com for free.

## Phase 1: Database Setup (Railway MySQL)

Since Render's free PostgreSQL doesn't work with your MySQL setup without changes, we'll use **Railway** for a free MySQL database.

1.  Go to [Railway.app](https://railway.app/) and sign up/login.
2.  Click **"New Project"** -> **"Provision MySQL"**.
3.  Once created, click on the **MySQL** card -> **Variables**.
4.  Copy the following values (you will need them later):
    - `MYSQLHOST`
    - `MYSQLPORT`
    - `MYSQLUSER`
    - `MYSQLPASSWORD`
    - `MYSQLDATABASE`
    - Or just copy the full `DATABASE_URL` if available (it looks like `mysql://user:pass@host:port/db`).

## Phase 2: Backend Deployment (Render)

1.  Go to [Render.com](https://render.com/) and sign up/login.
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your GitHub account and select your repository: `Ecommerce-B-to-B`.
4.  **Name**: `b2b-backend` (or similar).
5.  **Root Directory**: `spring_boot_mvc_template` (Important!).
6.  **Runtime**: Select **Docker**.
7.  **Instance Type**: Select **Free**.
8.  **Environment Variables** (Click "Add Environment Variable"):
    - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<MYSQLHOST>:<MYSQLPORT>/<MYSQLDATABASE>` (Replace with Railway values)
    - `SPRING_DATASOURCE_USERNAME`: `<MYSQLUSER>`
    - `SPRING_DATASOURCE_PASSWORD`: `<MYSQLPASSWORD>`
    - `CORS_ALLOWED_ORIGINS`: `*` (We will update this to the frontend URL later)
    - `JWT_SECRET`: `generate_a_long_random_string_here`
9.  Click **"Create Web Service"**.
10. Wait for the build to finish. Once it says "Live", copy the **backend URL** (e.g., `https://b2b-backend.onrender.com`).

## Phase 3: Frontend Deployment (Render)

1.  Go to Render Dashboard -> **"New +"** -> **"Static Site"**.
2.  Select the same repository: `Ecommerce-B-to-B`.
3.  **Name**: `b2b-frontend` (or similar).
4.  **Root Directory**: `frontend`.
5.  **Build Command**: `npm run build`.
6.  **Publish Directory**: `dist`.
7.  **Environment Variables**:
    - `VITE_API_BASE_URL`: Paste the **backend URL** from Phase 2 (e.g., `https://b2b-backend.onrender.com/api`).
8.  Click **"Create Static Site"**.
9.  Wait for deployment. Once live, click the link to see your website!
10. **Final Step**: Go back to your Backend Web Service -> Environment Variables, and update `CORS_ALLOWED_ORIGINS` to your new **Frontend URL** (e.g., `https://b2b-frontend.onrender.com`).

## 🎉 Done!

You now have two links:
- **Frontend Link**: This is what you put on your resume!
- **Backend Link**: API endpoint (for reference).
