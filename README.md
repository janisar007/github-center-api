# GitHub Center - Backend

This is the backend service for **GitHub Center**, built with **Node.js**, **Express.js**, **MongoDB**, and **Clerk Authentication**.  
It provides secure APIs for managing GitHub accounts, repositories, groups, Personal Access Tokens (PAT), and user authentication.

---

## 🚀 Overview

The backend is responsible for:
- Handling authentication with Clerk.
- Listening to Clerk webhooks to store user information in MongoDB upon registration.
- Integrating with the GitHub API to fetch repository, workflow, and pull request data.
- Managing multiple GitHub accounts per user.
- Organizing repositories into custom groups.
- Storing and encrypting GitHub Personal Access Tokens (PATs).

---

## ✨ Features

### **Authentication & User Management**
- User authentication via **Clerk**.
- Clerk **webhook** automatically stores new users in MongoDB when they register.
- Secure storage of user data.

### **GitHub Account Management**
- Add, remove, and reset GitHub accounts.
- View detailed information about connected GitHub accounts.

### **Repository Grouping**
- Create, update, and delete groups.
- Add or remove repositories from groups.

### **Personal Access Token (PAT) Management**
- Create and store encrypted PATs.
- Update PATs or rename them.
- Retrieve stored PAT details securely.

### **Repository & Workflow Management**
- Fetch repositories from the GitHub API.
- View already selected repositories.
- Add or remove repositories from selection.
- Retrieve PR and workflow details for repositories.

---

## 🛠 Tech Stack

- **Node.js** + **Express.js** — REST API framework.
- **MongoDB** — Database for storing users, groups, accounts, and tokens.
- **Clerk** — Authentication and user management.
- **Ngrok** — For local webhook testing.
- **Crypto** — For encrypting Personal Access Tokens.

---

## 📦 Installation & Setup

### **1. Clone the repository**
    ```bash
        git clone https://github.com/your-username/github-center-backend.git
        cd github-center-backend

### **2. Clone the repository**
    ```bash
        git clone https://github.com/your-username/github-center-backend.git
        cd github-center-backend
