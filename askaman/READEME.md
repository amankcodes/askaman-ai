# AskAman

AskAman is an AI-powered interactive developer portfolio that allows recruiters, interviewers, and visitors to explore Aman's professional profile through natural-language conversation.

Instead of navigating through a traditional portfolio, users can simply ask questions about Aman's skills, projects, experience, education, and professional background.

## Features

- AI-powered conversational portfolio
- Gemini API integration
- Context-aware responses about Aman
- Recruiter-focused contact flow
- Direct contact information handling
- Project and technical-skill exploration
- Resume download
- GitHub, LinkedIn, LeetCode and HackerRank integration
- Responsive dark-themed UI
- Spring Boot REST backend
- Static frontend served through Spring Boot

## Tech Stack

**Backend**
- Java 17
- Spring Boot
- REST APIs
- Maven

**Frontend**
- HTML
- CSS
- JavaScript

**AI**
- Google Gemini API

## Architecture

```text
User
  ↓
AskAman Web Interface
  ↓
Spring Boot REST API
  ↓
GeminiService
  ↓
Google Gemini API
  ↓
Context-aware response
  ↓
User

Project Structure
askaman/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/aman/askaman/
│       │       ├── controller/
│       │       ├── dto/
│       │       ├── service/
│       │       └── config/
│       │
│       └── resources/
│           ├── static/
│           └── application.properties
│
├── pom.xml
└── README.md
Running Locally
1. Clone the repository
git clone https://github.com/amankcodes/askaman.git
cd askaman
2. Configure environment variables

Set the required environment variables for the Gemini API and email functionality.

GEMINI_API_KEY=your_gemini_api_key
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_gmail_app_password

Never commit API keys, passwords, or other secrets to GitHub.

3. Run the application

Using Maven:

./mvnw spring-boot:run

On Windows:

mvnw.cmd spring-boot:run

The application runs on:

http://localhost:8080
Security

API keys, email credentials and other secrets are provided through environment variables and should never be committed to the repository.

Author

Aman Kumar

Java Backend Developer | Spring Boot | REST APIs

GitHub: https://github.com/amankcodes
LinkedIn: https://www.linkedin.com/in/dev-aman-kr17/
LeetCode: https://leetcode.com/u/amankr_2005/
HackerRank: https://www.hackerrank.com/profile/amankr17

This is enough. **Don't make the README 500 lines long.** A recruiter should understand the project in 30 seconds.

---

# 2. VERY IMPORTANT before pushing

You have already used:

- Gemini API key
- Gmail App Password
- Email address

So **do not push those values** to GitHub. GitHub explicitly warns against committing passwords/API keys. :contentReference[oaicite:1]{index=1}

Check your `application.properties`.

It should use environment variables, something like:

```properties
gemini.api.key=${GEMINI_API_KEY}
gemini.model=${GEMINI_MODEL:gemini-2.5-flash}

spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}

And make sure .gitignore contains:

# IntelliJ
.idea/
*.iml

# Maven
target/

# Environment
.env
.env.*

# OS
.DS_Store
Thumbs.db