# Milo AI 🤖💙

An intelligent AI chatbot designed to provide compassionate support for people living with dementia. Milo AI remembers conversations, helps manage daily reminders, and includes a dedicated caregiver dashboard for seamless care coordination.

## 🌟 Features

- **Conversational AI Interface**: Chat with Milo through text or voice interactions
- **Memory Retention**: Maintains conversation history to provide contextual and personalized responses
- **Voice Support**: Talk to Milo naturally using voice input
- **Smart Reminders**: Set and manage reminders for medications, appointments, and daily tasks
- **Caregiver Dashboard**: Dedicated interface for caregivers to:
  - View all active reminders
  - Add new reminders for users
  - Monitor user interactions and wellbeing
- **Dementia-Focused Design**: Built with cognitive accessibility in mind
## Screenshots

<img width="1671" height="855" alt="image" src="https://github.com/user-attachments/assets/00318fb4-b6b4-4412-853a-47d3969bdf50" />


<img width="1394" height="833" alt="Screenshot1" src="https://github.com/user-attachments/assets/bd7afda4-ac7c-450c-afe7-6efa2ae3aeff" />



<img width="1920" height="971" alt="Screenshot4" src="https://github.com/user-attachments/assets/8c68ace4-8135-4e1c-9344-897e05bd2b3e" />


## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js
- **Language**: TypeScript
- **UI**: React components with modern, accessible design

### Backend
- **Framework**: FastAPI
- **Language**: Python
- **Environment**: Virtual environment (venv)
- **AI Integration**: Natural language processing for conversational intelligence

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **pip** (Python package manager)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Akhilnair1306/Milo-Ai.git
cd Milo-Ai
```

### 2. Backend Setup

Navigate to the backend directory and set up the Python virtual environment:

```bash
cd milo-ai-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

Navigate to the frontend directory and install Node modules:

```bash
cd milo-ai-frontend

# Install dependencies
npm install
# or
yarn install
```

## 🏃 Running the Application

### Start the Backend Server

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload
```

The backend API will be available at `http://localhost:8000`

### Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

## 🎯 Usage

1. **For Users with Dementia**:
   - Access the main chat interface
   - Type or speak to Milo for assistance
   - View and manage your personal reminders

2. **For Caregivers**:
   - Navigate to the caregiver dashboard
   - Monitor all reminders and user activities
   - Add new reminders or modify existing ones
   - Track conversation patterns and user engagement

## 📁 Project Structure

```
Milo-Ai/
├── frontend/           # Next.js TypeScript frontend
│   ├── components/     # React components
│   ├── pages/          # Next.js pages
│   ├── styles/         # CSS/styling files
│   └── package.json    # Frontend dependencies
│
└── backend/            # FastAPI backend
    ├── main.py         # Main application entry
    ├── requirements.txt # Python dependencies
    └── venv/           # Virtual environment (not tracked)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👥 Author

**Akhil Nair**
- GitHub: [@Akhilnair1306](https://github.com/Akhilnair1306)

## 🙏 Acknowledgments

- Built with compassion for individuals living with dementia and their caregivers
- Designed to promote independence while ensuring safety and support

## 📧 Contact

For questions, suggestions, or support, please open an issue on GitHub.

---

**Made with ❤️ to support those affected by dementia**
