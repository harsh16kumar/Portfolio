# How to Deploy Your Portfolio

Your portfolio is fully ready for deployment! 🎉

Because your site is built using **React and Vite (Node.js)**, **you do not need a `requirements.txt` file**. That file is only used for Python applications. Instead, all your project dependencies are already perfectly managed inside your `package.json` file. 

## The Best Way to Deploy (Free & Easy)

The most popular platform for React sites like yours is **Vercel** or **Netlify**. Here is exactly how to do it:

### Option 1: Vercel (Recommended)
1. Push this entire folder/code to a new **GitHub Repository**.
2. Go to [Vercel.com](https://vercel.com/) and log in with GitHub.
3. Click **Add New Project** and import the repository you just created.
4. Vercel will automatically detect that you are using Vite!
5. **CRITICAL STEP:** Before you click "Deploy", open the **Environment Variables** section in the Vercel dashboard.
6. Add your two API keys exactly as they appear in your `.env` file:
   - Name: `VITE_GROQ_API_KEY`, Value: `gsk_...`
   - Name: `VITE_TAVILY_API_KEY`, Value: `tvly-...`
7. Click **Deploy**! 

*(Note: I added a `vercel.json` config file to your folder which ensures your website routing works perfectly out of the box on Vercel).*

### Option 2: Netlify
1. Push your code to GitHub.
2. Go to [Netlify.com](https://netlify.com/) and log in with GitHub.
3. Click **Add new site** -> **Import an existing project**.
4. Select your GitHub repository.
5. In the Build settings, add your Environment Variables (`VITE_GROQ_API_KEY` and `VITE_TAVILY_API_KEY`).
6. Click **Deploy site**.

## Summary of Prepared Files:
- Created `.env.example`: Keeps track of required API keys so you know what needs to be added to the hosting server.
- Created `vercel.json`: Fixes common React hosting bugs on Vercel automatically.
- Verified `package.json`: Your build scripts (`npm run build`) are natively supported by all modern hosting providers without any extra requirements files!
