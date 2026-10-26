# Custom Blossom 🌸

**Craft your creativity. Personalize the things you use every day.**

Custom Blossom is a web-based product-personalization experience for tech accessories. It brings together a visual storefront, customizable design workflows, product previews, and a Node.js/Express API for account and commerce-related features.

**Custom Blossom was developed as a college-level group project for our Tinkering and Mentoring coursework/program.** Working collaboratively, our team explored how a user-friendly website could let people personalize everyday tech accessories through themes, design tools, and product previews.

> **Project context:** Academic group project · Tinkering and Mentoring  
> **Project status:** Educational prototype with a browser-based frontend and an Express/MongoDB backend. Some integrations are configured as placeholders, so configure and test them before treating the project as production-ready.

## 🎓 Academic Project Context

- **Course / initiative:** Tinkering and Mentoring
- **Project type:** College-level group project
- **Project goal:** Explore and build a digital product-customization experience for accessories such as phone cases, laptop skins, and earbud cases.
- **Team approach:** Collaborative planning, interface design, and implementation across the frontend and backend.

The repository documents the project prototype and its current implementation. Feature availability can vary depending on whether optional services and integrations have been configured.

## ✨ Features

- **Personalized product experience** — explore accessories such as phone cases, laptop skins, and earbud cases.
- **Design customization** — create designs using available themes, text, images, colours, and design options.
- **Easy and Pro workflows** — choose a simpler customization flow or a more detailed model-aware workflow.
- **Live visual preview** — preview designs and export a canvas-style result where supported.
- **Theme and design gallery** — browse bundled artwork and themed visual collections.
- **Commerce-oriented features** — frontend flows and API routes for carts, wishlists, orders, coupons, payments, and reviews.
- **Account support** — backend routes for registration, login, and profile-related operations.
- **Responsive dark interface** — a dark visual system with pink, lavender, and cyan accents.
- **Backend resilience** — the API can fall back to an in-memory mock data mode when MongoDB cannot be reached.

## 🧰 Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- React 18 (UMD build)
- Babel Standalone for in-browser JSX transformation
- html2canvas for preview/canvas capture
- Firebase JavaScript SDK (compat build; configuration required)

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT-based authentication utilities
- bcryptjs
- Helmet, CORS, and express-rate-limit
- dotenv

## 📁 Project Structure

```text
Custom-Blossom/
├── index.html             # Frontend entry point
├── style.css              # Styles, design tokens, and animations
├── script.js              # React UI and frontend logic
├── images/                # Product, theme, and design artwork
├── vercel.json            # Static frontend deployment configuration
└── server/
    ├── index.js            # Express API entry point
    ├── config/             # Database connection and mock-store setup
    ├── middleware/         # Authentication middleware
    ├── models/             # Mongoose data models
    ├── routes/             # API route modules
    ├── package.json
    └── .env.example        # Environment-variable template
```

## 🚀 Getting Started

### Prerequisites

- Node.js (an actively supported LTS release is recommended)
- npm
- MongoDB, if you want persistent database storage
- A modern browser

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repository>.git
cd Custom-Blossom
```

Replace the repository URL and folder name with your actual GitHub repository details.

### 2. Configure the backend

```bash
cd server
npm install
```

Create a local `.env` file from the example:

**macOS / Linux**
```bash
cp .env.example .env
```

**Windows PowerShell**
```powershell
Copy-Item .env.example .env
```

Update `.env` with your own values:

```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/custom_blossom
JWT_SECRET=replace_with_a_long_random_secret
NODE_ENV=development
```

Use your own MongoDB connection string if you use MongoDB Atlas. Never commit `.env` or real credentials to GitHub.

### 3. Start the backend

From the `server/` directory:

```bash
npm run dev
```

If you prefer not to use nodemon:

```bash
npm start
```

The API defaults to `http://localhost:5000`. Check the health endpoint:

```text
GET http://localhost:5000/api/health
```

The health response reports whether the server is using MongoDB or the in-memory mock fallback. **Mock data is temporary** and should not be treated as persistent storage.

### 4. Run the frontend

The frontend is a static HTML/CSS/JavaScript app; there is no root-level frontend `package.json` in this project snapshot.

From the repository root, serve the files using a local static server. For example, if Python is installed:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

You can also use a static-server extension in your editor. Opening `index.html` directly may work for some UI features, but serving it over HTTP is recommended.

## 🔌 API Overview

The Express server mounts the following API groups under `/api`:

| Route group | Purpose |
|---|---|
| `/api/auth` | Registration, login, profile, and account-related operations |
| `/api/designs` | Save, list, and delete designs |
| `/api/products` | Retrieve products and product details |
| `/api/cart` | Cart operations |
| `/api/wishlist` | Wishlist operations |
| `/api/orders` | Create and retrieve orders; admin order/status routes |
| `/api/reviews` | Submit and retrieve reviews |
| `/api/coupons` | Coupon validation |
| `/api/payments` | Payment order creation and verification routes |
| `/api/themes` | Retrieve themes |
| `/api/notifications` | Retrieve notifications |
| `/api/admin-logs` | Administrative logs |
| `/api/ai` | AI chat and generation routes |

The frontend currently defines its API base URL as `http://localhost:5000/api` in `script.js`. Update this configuration before deploying the frontend and backend separately. Payment and AI routes may require additional provider configuration and should be verified before use.

## ⚙️ Configuration Notes

- **Firebase:** The frontend contains placeholder Firebase configuration values. Add your own Firebase project settings if you intend to enable Firebase-backed functionality.
- **MongoDB:** Set `MONGODB_URI` in `server/.env` for persistent storage.
- **JWT:** Replace the development secret with a strong, unique secret.
- **CORS:** The current backend allows requests from any origin. Restrict this to your deployed frontend domain before production.
- **API URL:** Replace the local API URL in `script.js` with the deployed backend URL when hosting remotely.
- **External assets:** Google Fonts and several JavaScript libraries are loaded from CDNs, so those features require an internet connection.
- **Image assets:** Keep the `images/` directory and its relative paths intact so bundled artwork can load correctly.

## ☁️ Deployment

The repository includes a `vercel.json` configuration for serving the static frontend. The Express backend is a separate Node.js service and needs a host that supports Node.js applications.

For a production deployment:

1. Deploy the frontend as a static site.
2. Deploy the backend as a Node.js service.
3. Configure environment variables on the backend host.
4. Set the frontend API base URL to the deployed backend.
5. Restrict CORS to the frontend domain.
6. Configure Firebase, MongoDB, AI, and payment integrations as required.
7. Test authentication, data persistence, checkout, and error handling end to end.

## 🔐 Security & Repository Hygiene

Before publishing the repository:

- Do **not** commit `.env`, access tokens, private keys, or database credentials.
- Keep `node_modules/` out of version control; install dependencies with `npm install`.
- Use a strong `JWT_SECRET` and rotate any secret that may have been exposed.
- Restrict CORS in production.
- Validate and authorize sensitive operations on the server.
- Verify payment signatures and provider-side payment status; never trust client-side payment success alone.

## 🛣️ Future Improvements

- Move frontend configuration into a clear environment-specific setup.
- Replace in-browser Babel compilation with a production build pipeline.
- Add automated tests for API routes and core design flows.
- Add deployment-specific CORS and security configuration.
- Document and test external AI, Firebase, and payment provider integrations.
- Add screenshots or a short demo GIF to showcase the customization experience.

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes with a descriptive message.
4. Push the branch and open a pull request.

Please avoid committing generated dependencies, local environment files, or credentials.

## 📄 License

No license file was identified in this project snapshot. Add a `LICENSE` file before presenting the project as open source, and choose a license that matches how you want others to use it.

---

<p align="center">
  Made with creativity 🌸 for people who love personalizing their everyday essentials.
</p>
