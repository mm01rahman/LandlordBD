# Deployment Guide (Frontend + Backend + Database)

## 1 Backend (Render)
1. Connect GitHub repo https://github.com/mm01rahman/LandlordBD
2. Choose Docker deployment
3. Set Root Directory = backend (if Dockerfile is inside backend folder)
4. Add environment variables (see README)
5. Deploy and test `https://landlordbd-1.onrender.com/api/health`

## 2 Frontend (Netlify)
1. Create new site from GitHub
2. Base directory: `frontend`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add env var: `VITE_API_BASE_URL=https://landlordbd-1.onrender.com`

## 3 Database (Neon)
1. Create a Neon project
2. Copy connection details to Render env
3. Run migrations with Render deploy

## 4 Troubleshooting
- CORS errors → check cors.php supports token mode
- 404 on login → check API_BASE_URL
- Refresh 404 → add Netlify redirects