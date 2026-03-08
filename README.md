# 🧀 Cheese with Love (Käse mit Liebe) ❤️

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel)](https://kease-mit-liebe-cheese-with-love.vercel.app/)
[![Trello Progress](https://img.shields.io/badge/Project-Trello-blue?style=flat-square&logo=trello)](https://trello.com/invite/b/695b86ae7e00340881f103c7/ATTI09c7e3a0032cda64cb62f78e935769bcF12F0330/🧀-kase-mit-liebe-❤️)

**A professional platform for cheesemakers and enthusiasts.**

"Cheese with Love" is a digital ecosystem designed for people who love cheese, make it at home, or are just starting their journey. It provides a comprehensive set of tools to manage the cheesemaking process, from sourcing ingredients to tracking maturation.

---

## 🚀 Project Overview

Everything a cheesemaker needs in one place:
- **Community Hub**: Connect with fellow cheesemakers.
- **Recipe Management**: Access verified recipes and contribute your own.
- **Batch Tracking**: Document every step of your cheesemaking process.
- **AI Assistant**: Get instant help with recipes and troubleshooting via a specialized RAG-based chatbot.
- **Integrated Shop**: One-stop shop for cultures, equipment, and additives.

---

## 🧩 Key Features

### 🧀 Core Functionalities
- **🧾 Cheese Diary**: Personal logs for every batch produced.
- **🕓 Maturation Timeline**: Visual tracking of aging progress with notifications for when cheese is ready.
- **🛒 Online Shop**: Curated marketplace for essential cheesemaking supplies.
- **📸 Personal Maker Profiles**: Showcases for your handcrafted cheeses.
- **📚 Recipe Database**: Robust searchable collection of techniques and recipes.
- **🤖 AI-Powered Concierge (RAG)**: An intelligent assistant trained on cheesemaking knowledge bases to assist with recipes, technical questions, and maturation stages.

### 🔐 User Roles & Permissions
| Role | Capabilities |
| :--- | :--- |
| **Administrator** | Manage recipes/products, process orders, oversee system status. |
| **Registered User** | Create batches, track maturation, save favorites, participate in the community. |
| **Guest** | Browse recipes, view public maker galleries, shop for products. |

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Web Frontend/Backend** | [Next.js](https://nextjs.org/) (Fullstack Framework) |
| **Mobile App** | [React Native / Expo](https://expo.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict typing) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/) |
| **Storage** | [Cloudinary](https://cloudinary.com/) & [Google Cloud Storage](https://cloud.google.com/storage) |
| **AI Components** | [Python](https://www.python.org/), [FastAPI](https://fastapi.tiangolo.com/), [LlamaIndex](https://www.llamaindex.ai/), [OpenAI API](https://openai.com/) |
| **Visuals/UI** | [Vis-Timeline](https://visjs.github.io/vis-timeline/), [Swiper.js](https://swiperjs.com/), [Quill](https://quilljs.com/) |

---

## 📂 Repository Structure

The project is organized as a monorepo-style structure for cohesive development:

- `project/`: Main Next.js web application.
- `kase-mit-liebe-mobile/`: Expo-based mobile application.
- `project/bot_backend/`: Python-based AI service.
- `docs/`: Design documents, ERDs, and technical specifications.

---

## 🛫 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL instance (e.g., [Neon](https://neon.tech/))
- Python 3.9+ (for AI services)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Maryna-Khrystyianyn/Kease-mit-Liebe-Cheese-with-Love-
   cd Kease-mit-Liebe-Cheese-with-Love-
   ```

2. **Web Setup:**
   ```bash
   cd project
   npm install
   npx prisma generate
   npm run dev
   ```

3. **Mobile Setup:**
   ```bash
   cd kase-mit-liebe-mobile
   npm install
   npx expo start
   ```

---

## 📈 Roadmap & Development Status

The project is currently in the **MVP Phase**. 
- [x] Database Schema Design ([logical](docs/ERD_logical_data_model_final.png) | [physical](https://dbdiagram.io/d/68f0c40a2e68d21b41c5476b))
- [x] Core Authentication & Role System
- [x] Recipe Management & Search
- [/] AI Chatbot Integration (In Progress)
- [ ] Advanced Mobile Notifications
- [ ] Complete E-commerce Payment Integration

---

## 🎨 Design Reference
Our UI/UX design is managed in Figma: [Explore the Figma Design](https://www.figma.com/design/3lPi9DrVtBNnbKULPAvOpB/K%C3%A4se-mit-liebe?node-id=0-1&p=f)
