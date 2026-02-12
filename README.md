# 🧀 Käse mit Liebe ❤️

https://kease-mit-liebe-cheese-with-love.vercel.app/

**Eine Plattform für Käser und Käseliebhaber.**  
„Käse mit Liebe“ ist ein digitaler Treffpunkt für Menschen, die Käse lieben, ihn zu Hause herstellen oder es einfach ausprobieren möchten.
Hier finden Nutzer geprüfte Rezepte, alle notwendigen Zutaten außer Milch, Unterstützung während des Herstellungsprozesses und eine Community aus Gleichgesinnten.
Eigene Erfahrungen können dokumentiert, geteilt und über eine Zeitleiste verfolgt werden, sodass man jederzeit sieht, welcher Käse wann reif ist.

---

## 🚀 Projektstatus

Dieses Projekt befindet sich aktuell in der **Entwicklungsphase (MVP)**.  
Ziel: Aufbau der Grundstruktur mit Authentifizierung, Rezeptverwaltung, Käsetagebuch und Onlineshop.

---

## ✅ Actueller Fortschritt

[Trello](https://trello.com/invite/b/695b86ae7e00340881f103c7/ATTI09c7e3a0032cda64cb62f78e935769bcF12F0330/🧀-kase-mit-liebe-❤️)

- Prisma wurde installiert und erfolgreich mit der Neon-Datenbank verbunden.

- [ERD - logical Data model ](docs/ERD_logical_data_model_final.png)

- [ERD - physical Data Model](https://dbdiagram.io/d/68f0c40a2e68d21b41c5476b)

- [Figma design - in process](https://www.figma.com/design/3lPi9DrVtBNnbKULPAvOpB/K%C3%A4se-mit-liebe?node-id=0-1&p=f)

## 🧩 Hauptfunktionen

### 🔐 Rollen & Zugriffsrechte

| Rolle                          | Beschreibung                                                                                 |
| ------------------------------ | -------------------------------------------------------------------------------------------- |
| **Administrator**              | Rezepte und Produkte verwalten, Bestellungen bearbeiten, Status ändern                       |
| **Registrierter Nutzer**       | Eigene Käsepartien erstellen, Reifung verfolgen, Rezepte ansehen und zu Favoriten hinzufügen |
| **Nicht registrierter Nutzer** | Rezepte & allgemeine Informationen ansehen, Produkte kaufen                                  |

---

### 🧀 Kernfunktionen

- **🧾 Käsetagebuch:** persönliche Einträge für jede Käsepartie
- **🕓 Reifungszeitachse:** zeigt an, wann welcher Käse reif ist
- **🛒 Onlineshop:** Zutaten, Starterkulturen, Ausrüstung & Zusatzstoffe
- **📸 Persönliche Seiten:** Galerie hergestellter Käse für jeden Käsemacher
- **📚 Rezeptdatenbank:** Rezepte hinzufügen, durchsuchen & speichern
- **🤖 AI-Chatbot (RAG):** intelligenter Assistent mit Wissensdatenbank für Rezepte, Reifung & Käseherstellung

## 🛠️ Technologie-Stack

| Technologie                                                  | Zweck                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------ |
| [Next.js](https://nextjs.org/)                               | Frontend & Backend (Fullstack Framework)               |
| [TypeScript](https://www.typescriptlang.org/)                | Typsicherheit im gesamten Projekt                      |
| [PostgreSQL](https://www.postgresql.org/)                    | Relationale Datenbank                                  |
| [Prisma](https://www.prisma.io/)                             | ORM für Datenbankzugriff                               |
| [Tailwind CSS](https://tailwindcss.com/)                     | Styling & responsive Design                            |
| [Swiper.js](https://swiperjs.com/)                           | Bildergalerien & Slider                                |
| [Framer Motion](https://www.framer.com/motion/)              | Animationen im UI                                      |
| [Quill / React‑Quill](https://quilljs.com/)                  | Rich‑Text‑Editor                                       |
| [Cloudinary](https://github.com/colbyfayock/next-cloudinary) | Cloudinary‑Cloud‑Speicher für Bilder                   |
| [Google Cloud Storage](https://cloud.google.com/storage)     | Cloud‑Speicher für Dateien & Bilder                    |
| [Vis‑Timeline](https://visjs.github.io/vis-timeline/)        | Interaktive Zeitachsen & Datenvisualisierung           |
| [Python](https://www.python.org/)                            | Backend‑Logik für AI‑Chatbot                           |
| [FastAPI](https://fastapi.tiangolo.com/)                     | API‑Framework für Chatbot‑Server                       |
| [LlamaIndex](https://www.llamaindex.ai/)                     | Retrieval‑Augmented Generation (RAG) für den Chatbot   |
| [OpenAI](https://openai.com/)                                | KI‑Modell für die Generierung von Antworten im Chatbot |
