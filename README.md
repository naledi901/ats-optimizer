# 🚀 ATS Optimizer (SA Edition)

![ATS Score](https://img.shields.io/badge/ATS%20Score-98%2F100-green?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live%20Beta-orange?style=for-the-badge)

**The #1 AI-Powered CV Builder for the South African Job Market.**

ATS Optimizer is a full-stack SaaS application that helps job seekers build professional, ATS-friendly Curricula Vitae (CVs). It leverages **Google Gemini AI** to rewrite bullet points and **Puppeteer** to generate high-quality, ATS-readable PDFs.

👉 **[Live Demo](https://ats-optimizer-1-nr3c.onrender.com)** 

---

## 📸 Screenshots

### **Professional Dashboard**
![App Preview](frontend/public/app-preview.png)

---

## ✨ Key Features

* **🇿🇦 South African Standard:** Templates designed specifically for SA recruiters (single column, concise, clear hierarchy).
* **🤖 AI Content Enhancement:** Uses **Google Gemini AI** to rewrite generic experience into impactful, result-oriented bullet points.
* **📄 High-Fidelity PDF Generation:** Backend-side rendering with **Puppeteer** ensures perfectly formatted, selectable text that passes ATS bots.
* **🔐 Secure Authentication:** User accounts managed via **Firebase Auth** with persistent data storage in **Firestore**.
* **💳 Payment Integration:** **Paystack** integration for premium subscription tiers (30-Day Access Pass).
* **📱 Responsive Design:** Fully mobile-optimized interface using **Tailwind CSS**.

---

## 🛠️ Tech Stack

### **Frontend**
* **React (Vite):** Fast, component-based UI.
* **TypeScript:** Type safety for robust code.
* **Tailwind CSS:** Modern, responsive styling.
* **Firebase SDK:** Authentication and real-time database connection.

### **Backend**
* **Node.js & Express:** REST API server.
* **Puppeteer:** Headless Chrome for server-side PDF generation.
* **Google Gemini API:** Generative AI for text optimization.
* **Firebase Admin SDK:** Secure server-side database operations.

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### **Prerequisites**
* Node.js (v18 or higher)
* npm or yarn
* A Firebase project
* A Google Gemini API Key

### **1. Clone the Repository**
```bash
git clone [https://github.com/your-username/ats-optimizer.git](https://github.com/your-username/ats-optimizer.git)
cd ats-optimizer
