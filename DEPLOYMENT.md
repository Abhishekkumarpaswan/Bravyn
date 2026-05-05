# Deployment Guide - Render

This guide walks you through deploying Bravyn to Render with a full-stack setup.

## Prerequisites

- GitHub account with your repository pushed
- Render account (free at https://render.com)
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
- Cloudinary account (free at https://cloudinary.com)
- Stripe account (free at https://stripe.com)

## Step 1: Set Up MongoDB Atlas (Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Create a database user with username and password
4. Whitelist your Render IP (allow 0.0.0.0/0 for now)
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/bravyn?retryWrites=true&w=majority`

## Step 2: Configure Frontend API URL

Create a `.env` file in the `client` folder:

```bash
# client/.env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

For local development:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

Update the API call in your frontend (example in `client/src/lib/api.ts`):

```typescript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
```

## Step 3: Prepare Backend for Production

1. Ensure `backend/src/index.js` reads PORT from environment (already done ✓)
2. Ensure `.env.example` is properly filled with all required variables
3. Update CORS in `backend/src/app.js`:

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
```

## Step 4: Deploy to Render

### Option A: Deploy via Render Dashboard (Recommended)

1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure for Backend:
   - **Name:** `bravyn-backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node src/index.js`
   - **Root Directory:** `backend`
   - **Plan:** Free (or paid)

5. Add Environment Variables:

   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bravyn
   FRONTEND_URL=https://your-frontend-url.onrender.com
   JWT_SECRET=your_super_secret_key_here
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   STRIPE_SECRET_KEY=sk_live_your_stripe_key
   STRIPE_PUBLIC_KEY=pk_live_your_stripe_key
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASS=your-app-password
   ```

6. Deploy and get your Backend URL (e.g., `https://bravyn-backend.onrender.com`)

### Option B: Deploy Frontend

1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name:** `bravyn-frontend`
   - **Build Command:** `cd client && npm install && npm run build`
   - **Publish Directory:** `client/dist`
   - **Environment Variables:**
     ```
     VITE_API_BASE_URL=https://bravyn-backend.onrender.com/api
     ```

4. Deploy

## Step 5: Update Frontend with Backend URL

After backend deployment, update your frontend `.env`:

```bash
VITE_API_BASE_URL=https://bravyn-backend.onrender.com/api
```

Then redeploy the frontend.

## Step 6: Verify Deployment

Test the deployed application:

```bash
# Test API
curl https://bravyn-backend.onrender.com/api/health

# Visit frontend
https://bravyn-frontend.onrender.com
```

## Environment Variables Reference

### Backend Required Variables

| Variable                | Purpose             | Example                                |
| ----------------------- | ------------------- | -------------------------------------- |
| `MONGODB_URI`           | Database connection | `mongodb+srv://...`                    |
| `JWT_SECRET`            | Token signing key   | Random string (min 32 chars)           |
| `FRONTEND_URL`          | CORS origin         | `https://bravyn-frontend.onrender.com` |
| `CLOUDINARY_NAME`       | Image storage       | From Cloudinary dashboard              |
| `CLOUDINARY_API_KEY`    | Image storage       | From Cloudinary                        |
| `CLOUDINARY_API_SECRET` | Image storage       | From Cloudinary                        |
| `STRIPE_SECRET_KEY`     | Payment processing  | From Stripe dashboard                  |
| `STRIPE_PUBLIC_KEY`     | Payment processing  | From Stripe                            |
| `GMAIL_USER`            | Email sender        | your-email@gmail.com                   |
| `GMAIL_PASS`            | Email app password  | App-specific password                  |

### Frontend Required Variables

| Variable            | Purpose         | Example                                   |
| ------------------- | --------------- | ----------------------------------------- |
| `VITE_API_BASE_URL` | Backend API URL | `https://bravyn-backend.onrender.com/api` |

## Troubleshooting

### Backend won't start

- Check logs in Render dashboard
- Verify MONGODB_URI is correct
- Ensure PORT is set to 10000

### Frontend can't reach backend

- Check VITE_API_BASE_URL in Render environment
- Verify CORS is configured in backend
- Check browser console for errors
- Redeploy frontend after environment changes

### MongoDB connection errors

- Verify IP whitelist includes 0.0.0.0/0
- Check connection string format
- Test connection locally first

### Database issues

- Use MongoDB Atlas for easier management
- Enable backups in MongoDB settings
- Monitor resource usage

## Optional: Set Up Custom Domain

1. In Render, go to your service settings
2. Add custom domain
3. Update DNS records with Render's CNAME
4. Enable auto-renewal SSL certificate

## Cost Breakdown (Free Tier)

- **Render Backend:** Free tier (sleeps after 15 min inactivity)
- **Render Frontend:** Free tier
- **MongoDB Atlas:** Free tier (512MB storage)
- **Cloudinary:** Free tier
- **Stripe:** Free tier (pay only on transactions)

**Total:** ~$0 (until you scale)

## Next Steps

1. Monitor application performance in Render dashboard
2. Set up error logging/monitoring
3. Enable auto-deploy on GitHub push
4. Test payment flow in production
5. Set up email notifications

## Support

- Render Docs: https://render.com/docs
- MongoDB Atlas Support: https://www.mongodb.com/support
- Stripe Support: https://stripe.com/support
