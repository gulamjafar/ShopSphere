# ShopSphere E-Commerce Starter

## Run in VS Code
1. Extract this ZIP and open `ShopSphere_Complete_Project` in VS Code.
2. Terminal 1:
   ```powershell
   cd backend
   npm install
   npm run dev
   ```
3. Terminal 2:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
4. Open the URL Vite prints (usually http://localhost:5173).

Backend test: http://localhost:5000/api/products

This starter intentionally uses temporary in-memory sample products, not MongoDB yet. Products reset when the backend restarts. Once this runs, we can connect MongoDB Atlas. If PowerShell blocks `npm`, use `npm.cmd`.
