# How to run this project

## 1. Start the backend (required first)

```bash
cd backend
npm install
node app.js
```

You must see: **Server running at http://localhost:3000**

Leave this terminal open.

## 2. Start the frontend

Open a **new** terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the app in the browser (e.g. http://localhost:5173).

## 3. If Home shows "Could not load videos"

- The backend is not running or not on port 3000.
- In the **backend** terminal run: `node app.js` (from the `backend` folder).
- In the browser click **Retry** on the Home page.

## Ports

- Backend: **3000**
- Frontend: **5173**

Both must be running for the app to work.
