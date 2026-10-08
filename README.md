# social - rebuilt SocialNetwork

The original React social-network idea rebuilt into a working small application: feed, profiles, friends and separate private conversations. The original Bill/Linus/Donald contacts and demo conversation names are retained, alongside a more useful seeded community.

## Run the included version

Install **Node.js 24** (the version used for verification), then extract the ZIP.

- **Windows:** double-click `start.bat`.
- **macOS / Linux:** open a terminal in this folder and run `sh start.sh`.
- Or run `npm start` in this folder on any platform.

Open **http://localhost:3001**. Keep the terminal open while using the app. The compiled frontend is included in `dist`; **no npm dependency installation or external database is needed to run it**. The launcher starts the API and serves the frontend together.

Choose **Explore the demo** for a quick look, or **Create an account** for your own profile. All changes are real and saved in SQLite on this server.

## Working features

- Registration and sign-in with unique handles, salted password hashes and HTTP-only sessions.
- Everyone / friends feed, paginated posts, image attachments and persistent composer drafts.
- Publish, edit and delete your own posts; actual likes, comments and bookmarks.
- Comment threads, comment deletion by the author or post owner, and shareable post links.
- Profile pages, profile editing, uploaded avatar photos, initial avatars, bio and location.
- Friend discovery, outgoing/incoming requests, acceptance, cancellation, removal and friend filtering.
- Separate one-to-one conversations, sending, unread counts and read receipts.
- New messages refresh every 3 seconds while the page is visible. Replies come from another account; no messages are fabricated.
- Notifications for likes, comments, friendship requests/acceptance and messages.
- Search people and posts, saved posts, password changes, sign-out and a personal JSON export.
- Mobile feed navigation, responsive conversation list/chat, accessible focus states and dialogs.

## Try two real accounts

Use your normal browser and a separate private/incognito window. Create a different account in each, then search for the other handle, send a friend request and start a conversation. Keep both windows on the **same server**. Each browser session has its own identity, while the database is shared.

In local demo mode, the seeded handles include `alex`, `jamie`, `morgan`, `sam`, `taylor`, `casey`, `bill`, `linus`, `donald`, `rick`, `elon` and `silvester`. Their initial password is **social-demo-2026**. These are sample accounts, not connections to real people. The Explore button opens Alex's sample account. Changing a demo account's password affects that local account.

## Where data lives

The first launch creates `data/social.sqlite` and `data/uploads/` automatically. Posts, profiles, friendships, sessions, comments and messages persist after closing or restarting the server. Back up the **whole `data` directory** while the server is stopped. The archive contains no test database, session tokens or user uploads.

`SOCIAL_DATA_DIR` changes the data location. `PORT` changes the port (default 3001). `HOST` defaults to `127.0.0.1`; remote access requires choosing an appropriate host and reachable server address.

For a fresh non-demo installation, set `DEMO_MODE=0` **before the first launch with a new data directory**. This prevents sample-account seeding and removes the Explore button. Turning it off on an existing demo database disables the bypass button but does not erase those accounts. Real shared hosting needs HTTPS; set `COOKIE_SECURE=1` when serving through HTTPS. Keep the database directory writable and persistent. This server-based app cannot be hosted solely by uploading its `dist` folder to a static host.

Examples on macOS/Linux:

```sh
# A fresh personal installation without sample accounts:
DEMO_MODE=0 SOCIAL_DATA_DIR=./personal-data npm start

# A different local port:
PORT=3011 npm start
```

PowerShell uses environment variables such as `$env:DEMO_MODE="0"; $env:SOCIAL_DATA_DIR="./personal-data"; npm start`.

## Work on the source

```sh
npm ci
npm run dev
```

The development frontend is at **http://localhost:5174**, with API requests proxied to the server at port 3001. Run `npm run build` after editing to update the included launchable version. Run `npm test` for the 10 API/database integration checks.

- `server/database.mjs`: schema and clearly marked sample data.
- `server/index.mjs`: authentication, permissions, uploads and API routes.
- `src/pages`: feed, profiles, friends, messages, settings and notifications.
- `src/components`: reusable shell, avatars, dialogs, composer and post cards.
- `src/lib`: API access and data hooks.

## Verification and practical limits

Checked on Node 24. Tests exercise real registration/login, password changes, persisted posts and counts, friend request direction, private-message permissions, read receipts, image ownership, invalid inputs, session invalidation and a full server restart. Desktop and mobile browser interactions are also checked.

This is a compact self-contained application, without email verification, password-reset email, video calls, moderation tooling or cloud storage. The chat screen loads the latest 300 messages per conversation; stored earlier messages are retained in SQLite. The directory returns up to 200 matching people. Polling gives small-group live updates without an additional WebSocket service.

The countryside image was generated specifically for this rebuild and is bundled locally. Original contact photos supplied in the project are retained in `public/legacy`. Inter's font license is included in `docs/INTER-LICENSE.txt`.
