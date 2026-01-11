# 🎮 Minute Market – Architecture Documentation

## 1. Project Overview
Minute Market is a time-based web game designed to simulate market investment decisions under pressure.
Players must make quick decisions between Safe Investment and High Risk Investment within a 60-second
game session. The game dynamically adjusts difficulty, tracks analytics, and maintains a leaderboard.

The project demonstrates frontend game logic, UI/UX design, backend API handling, and basic system
architecture concepts.

---

## 2. Technology Stack

### Frontend
- HTML5 – Structure of the game UI
- CSS3 – Styling, animations, glassmorphism UI
- JavaScript (Vanilla) – Game logic, timer, scoring, events

### Backend
- Node.js
- Express.js
- CORS middleware

### Data Storage
- In-memory data structures (Leaderboard, Score)
- Architecture is scalable to databases like MongoDB/MySQL

---

## 3. System Architecture

The system follows a simple client-server architecture:

- The frontend handles user interaction, game logic, and UI updates.
- The backend provides APIs for score handling and leaderboard management.
- Communication happens via HTTP requests.

User → Browser (Frontend) → Express Server → In-Memory Data

---

## 4. ERD (Entity Relationship Diagram)

### Entities

#### Player
- playerId
- name
- age
- role

#### GameSession
- sessionId
- startTime
- endTime
- finalScore
- coinsEarned
- maxScore

#### Investment
- investmentId
- type (Safe / Risk)
- scoreChange
- timestamp

#### Leaderboard
- rankId
- playerName
- score
- resultTitle

### Relationships
- One Player can have multiple GameSessions
- One GameSession can have multiple Investments
- One Player can appear multiple times in the Leaderboard

Refer to **ERD.png** for visual representation.

---

## 5. DRD (Data Relationship Diagram)

The DRD represents how data flows across the system:

1. Player enters details (Name, Age, Role)
2. Game session is initialized
3. User performs Safe or Risk investments
4. Score, coins, and combo values are updated
5. Market events affect the score
6. Final score is sent to the leaderboard
7. Leaderboard data is displayed

Refer to **DRD.png** for the complete data flow.

---

## 6. User Journey / Flow Diagram

The user journey represents the complete gameplay experience:

1. User opens the game
2. Enters player details
3. Starts the game
4. Timer begins (60 seconds)
5. User performs investment actions
6. Shop and bonus events appear
7. Game ends automatically
8. Result and leaderboard are shown
9. User can restart or exit

Refer to **user-flow.png** for visual flow.

---

## 7. Core Functional Modules

### Login Module
- Collects player information
- Validates input before starting game

### Timer Module
- Manages 60-second gameplay
- Ends game automatically

### Investment Module
- Safe Investment: low risk, stable gain
- Risk Investment: high reward or loss

### Economy Module
- Coins earned based on score
- Shop items and mystery crate

### Analytics Module
- Tracks user actions
- Stores session statistics

### Leaderboard Module
- Displays top scores
- Updates after each game session

---

## 8. Non-Functional Requirements
- Responsive design
- Smooth animations
- Fast performance
- Simple and scalable architecture

---

## 9. Future Enhancements
- Persistent database integration
- Multiplayer support
- Authentication system
- Cloud deployment

---

## 10. Conclusion
Minute Market is a well-structured interactive web game that demonstrates core concepts of
frontend development, backend integration, and software architecture.
