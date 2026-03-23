# Quantum Binance Signal Dashboard

Full stack Binance crypto intraday signal generator. Analyzes real-time price, calculates dynamic indicators (EMA, VWAP, RSI, ATR), evaluates multi-timeframe signals, and provides backtesting functionality.

## Architecture
* **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Zustand.
* **Backend**: Python 3, FastAPI, Pandas, Pandas-TA (Serverless-ready).

---

## 🚀 How to Deploy to Vercel & GitHub

This project has been pre-configured for a seamless push to Vercel and GitHub.

### 1. Push to GitHub
Open your terminal and link this local Git repository (which is already initialized and committed) to your GitHub account:

```bash
# 1. Create a new empty repository on GitHub.com
# 2. Run the following commands:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [Vercel.com](https://vercel.com/) and click **Add New Project**.
2. **Import** the GitHub repository you just pushed.
3. Vercel will automatically detect the `vercel.json` file.
   * It will build your React application.
   * It will compile the `api/main.py` folder into serverless Python edge functions.
4. Click **Deploy**.

*Note: Your frontend and Python API will automatically share the same deployed domain!*

---

## 💻 Local Development

**Start the Python Backend:**
```bash
py -m pip install -r api/requirements.txt
py -m uvicorn api.main:app --reload
```
*(Runs on `http://localhost:8000`)*

**Start the React Frontend:**
```bash
npm install
npm run dev
```
*(Runs on `http://localhost:5173` or `5174`)*
