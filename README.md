# TheraBot - An AI Therapist Chatbot

An AI-powered web application designed to provide emotional support and mental health guidance using OpenAI API.

## Features

- **Conversational AI:** Powered by GPT-4-turbo (OpenAI)
- **Sentiment Analysis:** Detects user emotions
- **Responsive Web Interface:** Built with Next.js and TailwindCSS
- **Anonymous user interactions**
- **Uses history for context**

## Tech Stack

- **Framework:** Next.js, TypeScript, TailwindCSS
- **AI Models:** OpenAI GPT-4-turbo
- **NLP Tools:** Sentiment.js

## Installation

### Clone the Repository

```sh
git clone https://github.com/dinakajoy/TheraBot.git ai-therapist-chatbot
cd ai-therapist-chatbot
```

### Install Dependencies

```sh
npm install
```

### Set Up Environment Variables

Create a `.env` file in the root directory and add:
```sh
OPENAI_API_KEY=your_openai_api_key
```

### Run the Application

#### Development Mode

```sh
npm run dev
```

#### Production Mode

```sh
npm run build && npm start
```

## How It Works

1. User inputs a message.
2. **Sentiment Analysis** determines mood (positive, negative, neutral).
3. **AI Model (GPT-4-turbo)** generates an appropriate response.
4. Response is displayed in a chat UI.

---
**Disclaimer:** This chatbot is not a substitute for professional mental health support. If you need help, please consult a licensed therapist.
