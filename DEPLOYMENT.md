# Deployment Notes

## Frontend

Set the frontend environment variable:

```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

Build command:

```bash
npm run build
```

Publish the `frontend/dist` output if you are deploying manually, or point your host at the `frontend` directory if it builds from source.

## Backend

Set these backend environment variables at minimum:

```env
MONGODB_CONNECTION_STRING=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
ADMIN_JWT_SECRET=...
STUDENT_EMAIL=...
STUDENT_PASSWORD=...
STUDENT_JWT_SECRET=...
CORS_ORIGINS=https://your-frontend.vercel.app,https://*.vercel.app
```

`CORS_ORIGINS` is the key setting for browser requests. It must include the exact deployed frontend URL, and if you use preview deployments you can also include a wildcard such as `https://*.vercel.app`.

## CORS Checklist

If the frontend is deployed but API calls fail in the browser:

1. Confirm `VITE_API_BASE_URL` points to the deployed backend, not `localhost`.
2. Confirm the backend `CORS_ORIGINS` contains the deployed frontend origin.
3. Make sure both frontend and backend are using HTTPS in production.
4. Test the backend health endpoint at `/health`.
