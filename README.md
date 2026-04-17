# 🐾 Animal Care Locator, Reporting & Appointment Booking System  

A full-stack **MERN + Google Places API** application that allows citizens to **report injured/aggressive street animals**, helps admins **manage rescue operations**, and enables users to **find nearby veterinary clinics** and **book appointments**.

This project is designed for real-world use with a modern UI and smooth workflows.

---

## ⭐ Features Overview

---

### 🆘 1. Citizen Animal Reporting System  
Citizens can report:

- Injured animals  
- Aggressive or struck animals  
- Animals in danger  
- Street pets needing help  

Each report includes:

- 📍 Location  
- 📝 Description  
- ⚠ Severity (Aggressive / Injured / Struck)  
- 📸 Photos  
- 📞 Contact details  
- 🕒 Timestamp  

#### 🛠 Admin Dashboard  
Admins can:

- View all active reports  
- Open detailed report view (modal)  
- Check all photos  
- Update status:  
  **Pending → In-Progress → Resolved / Dismissed**  
- Manage cases live  

UI updates instantly due to optimized React state management.

---

### 🐶 2. Nearby Vet Finder (Real Clinics)

Powered by **Google Places API** + **User Geolocation**.

User can see:

- Real veterinary clinics near them  
- Distance in kilometers  
- Photos  
- Ratings + reviews  
- Open/closed status  
- Address  

#### 📝 Clinic Details Modal  
Fetched dynamically using **Google Place Details API**:

- Phone number  
- Website  
- Opening hours  
- User reviews  
- High-quality photos  

---

### 📅 3. Appointment Booking System

Users can:

- Select a nearby vet  
- Enter animal details  
- Pick urgency level  
- Choose date & time  
- Book appointment  

Includes a beautiful success animation and toast notifications.

---

### 🎨 4. Modern UI / UX

Built using:

- React + TypeScript  
- Tailwind CSS  
- shadcn/ui  
- Lucide Icons  
- Framer Motion  
- Vite  

Fully responsive and mobile-friendly.

---

## 🧱 Tech Stack

### **Frontend**
- React 18  
- Vite  
- TypeScript  
- Tailwind CSS  
- shadcn/ui  
- Axios  
- Sonner (toast notifications)  

### **Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- Google Places API  
- Multer (photo uploads)  

---

---

## ▶️ Running the Project

### **Frontend**
```bash
cd client
npm install
npm run dev

```
### **Backend**
```bash
cd server
npm install
npm run dev
```

🧪 Workflow Summary

👤 Citizen

Report an injured/aggressive animal

Upload photos

Track the case

🛡 Admin

Monitor cases

View report details

Update case status

Mark as resolved or dismissed

👨‍⚕️ User

Find nearby clinics

Open clinic details

Book appointments

🌟 Future Enhancements

Firebase/Cloudinary image storage

Role-based admin authentication

Push notifications

Real-time map view

Rescue team assignment system

⭐ Support

If you like this project, consider starring the GitHub repository!

📧 Contact

For any help or collaboration, feel free to reach out.

Built with ❤️ for helping animals in need.
