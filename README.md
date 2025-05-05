
# fe-electronics-shop-platform

A simple and responsive frontend for an electronics shopping platform, built with **ReactJS**, **Tailwind CSS**, **Ant Design**, and **JSON Server** for mock API.

---

## 🚀 Features

- 🛒 Product listing with filters (brand, price,...)
- 🔍 Product detail page
- 🎯 Category and brand filtering
- 🧭 Navigation with breadcrumbs
- 🖼️ Responsive layout using Tailwind CSS
- 📦 Component library integration with Ant Design
- 🔗 Connects to a mock REST API via JSON Server

---

## 🛠️ Tech Stack

| Technology    | Description                     |
|---------------|---------------------------------|
| ReactJS       | Frontend JavaScript library     |
| Tailwind CSS  | Utility-first CSS framework     |
| Ant Design    | React UI component library      |
| JSON Server   | Mock REST API for development   |

---

## 📂 Project Structure

```
fe-electronics-shop-platform/
├── public/
├── src/
│   ├── assets/         # Images, icons...
│   ├── components/     # Shared UI components (Header, Footer, etc.)
│   ├── constants/      # Constant variables
│   ├── database/       # Local JSON
│   ├── pages/          # Pages (Home, ListProduct, ProductDetail, etc.)
│   ├── services/       # API services
│   └── App.jsx         # Main App entry
└── index.html          # Main HTML entry point
```

---

## 🧪 Getting Started

### 1. Clone this repo

```bash
git clone https://github.com/hoanghuy04/fe-electronics-shop-platform.git
cd fe-electronics-shop-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

### 4. Start the mock backend (JSON Server)

```bash
npm run serve-json
```

----

The app will run at `http://localhost:5173` and the API at `http://localhost:3000`.

## 📌 Notes

- Data is stored in `db.json` and served via JSON Server.
- Filtering is done via API query params.
- Ensure both frontend and JSON server are running for full functionality.
