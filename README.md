# Samadhaan - Smart Civil Governance System

## System Architecture

The project consists of three main components:

1. **User App (Mobile)**: React Native (Expo) app for citizens to file complaints.
2. **Orchestrator (Backend)**: Node.js server to handle API requests and manage complaints.
3. **AI Service (Python)**: FASTAPI service for Zero-Shot Classification of complaints.
4. **Admin Dashboard (Frontend)**: Real-time React dashboard for administrators to view complaints.

## setup & Run Instructions

### 1. AI Service (Classification)

Navigate to the `ai` directory:
```bash
cd ai
pip install -r requirements.txt
python main.py
```
The AI service will start on `http://localhost:8000`. The first run will download the classification model (Approx 1.5GB) from Hugging Face.

### 2. Backend (Orchestrator)

Navigate to the `backend` directory:
```bash
cd backend
npm install
npm start
```
The backend server will start on `http://localhost:5000`.

### 3. User App (Mobile)

Navigate to the `mobile` directory:
```bash
cd mobile
npm install
npx expo start --android
```
Scan the QR code with Expo Go or run on an emulator.
**Note**: If running on Android Emulator, the app connects to `10.0.2.2:5000`. If running on a physical device, ensure your backend is accessible on your local network and modify `mobile/App.js` `BACKEND_URL`.

### 4. Admin Dashboard (Frontend)

Navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
The frontend dashboard will be available at `http://localhost:5173`. Make sure backend is running first.

## Features Implemented

- **Mobile App**:
  - Simple Phone Login
  - Text Complaint Submission
  - "Voice Agent" (Coming Soon placeholder)
- **Backend**:
  - `/api/complaints` endpoints to manage complaints.
  - Integration with AI Service for automatic classification.
- **AI**:
  - Zero-Shot Text Classification into ["Roads", "Sanitation", "Civic"].
- **Frontend**:
  - Live view of incoming complaints with auto-refresh.