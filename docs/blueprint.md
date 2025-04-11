# **App Name**: LetterLink

## Core Features:

- Letter Submission: Allow anonymous senders to submit letters with a unique ID and return address (stored securely).
- Letter Tracking: Enable senders to track letter status (received, replying, reply_done) using their unique ID.
- Volunteer Reply: Allow logged-in volunteers to view received letters (excluding return address) and mark them as 'replying' or 'reply_done'.
- Manager Dashboard: Implement a dashboard for managers to view all letters, statuses, repliers, and feedback.
- AI Reply Assistant: Implement an AI tool that suggests appropriate responses or tone for the replier, based on the content of the original letter.
- Audio Letter Submission: Allow senders to submit recordings of their letters, which are then converted to text for submission.
- Data Analysis Dashboard: Implement a data analysis dashboard to automatically categorize letters by distinct topics and emotions.

## Style Guidelines:

- Primary color: Light, calming blue (#B0E2FF) for trust and reliability.
- Secondary color: Soft gray (#F0F0F0) for backgrounds and neutral elements.
- Accent: Teal (#008080) for interactive elements and highlights.
- Clear and readable sans-serif font for all text elements.
- Simple, outlined icons for a clean and modern look.
- Clean, card-based layout for letter display and management.

## Original User Request:
Build a Firebase app that supports the following three user roles:

🔹 1. Anonymous Letter Sender

The sender is anonymous and not logged in.

When sending a letter by mail, they include a custom unique ID (e.g., myCode1234) along with their return address.

The unique ID will be used to track the status of their letter.

The sender can use this unique ID on a public tracking page to:

Check the status of their letter:
received, replying, reply_done

Submit one-time feedback after receiving a reply.

🔹 2. Replier (Volunteer)

Logged-in user (authenticated via Firebase Auth).

Can view the list of received letters (excluding return address).

Can select a letter to start replying:

Upon selecting, the status becomes replying.

After mailing a handwritten reply, they mark the status as reply_done.

Each letter can be replied to only once.

Repliers can see feedback received only for the letters they replied to.

🔹 3. Manager

Logged-in admin account.

Can view all letters, statuses, repliers, and submitted feedback.

Basic dashboard or table view.

## Data Storage in Firebase

The application will use Firebase services for data storage and management.

### Firestore

Firestore will serve as the primary database. The data will be structured into two main collections:

- **Letters Collection:**
  - Each document represents a letter.
  - Fields: `content`, `uniqueId`, `returnAddress` (securely stored), `status`, `reply`, `feedback`, `replierId`, `topics` (AI), `emotions` (AI), `suggestedResponses` (AI).
- **Users Collection:**
  - Documents for Repliers and Managers.
  - Fields: `userId`, `role` (`replier` or `manager`), `contactInformation`, (optionally) assigned `letterIds`.

### Cloud Storage

Audio files for letter submissions will be stored in Firebase Cloud Storage.

- Each audio file will be stored with a unique identifier, potentially linked to the letter's `uniqueId`.
- The corresponding letter document in Firestore will store a reference (URL or path) to the audio file in Cloud Storage.

🔸 Firestore Database Requirements:

Collection: letters

senderId: string (user-submitted ID)

status: "received" | "replying" | "reply_done"

createdAt: timestamp

replyerId: string (nullable)

replyNote: optional string

feedback: object with fields:

message: string

rating: number (1–5)

Collection: users

userId: string

role: "replier" | "manager"

nickname: optional string

🔸 Constraints & Rules:

senderId must be unique.

A sender can only submit feedback once per letter.

A letter can only be replied to once.

Repliers can only view their own feedback.

Managers can view everything.

🔸 Optional Features:

Auto-generate simple sender IDs if user doesn’t have one.

Add a feedback submission deadline (e.g., within 30 days of reply_done).

Create the Firebase data model, UI wireframes for each role (if supported), and authentication logic accordingly. Use Firebase Auth + Firestore and we will be seeking adding features via python scripts, and note this may be a mobile app environmet (end users)
  