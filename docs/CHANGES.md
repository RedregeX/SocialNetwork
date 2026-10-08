# What changed

## Preserved

The original app's profile, posts, friends, messages/dialogs and social layout. The original contact photos and Bill, Linus, Donald, Elon, Rick and Silvester sample contacts remain. `#/dialogs` opens Messages and `#/profile` opens the signed-in profile.

## Repaired

The original store mutated arrays and re-rendered the entire app manually. New posts reused IDs, empty submissions were allowed, input state was not passed consistently, sidebar links led to missing routes, and all named dialogs shared one global message list. State vanished on refresh. Each workflow now has a functioning screen, stable IDs and validated API actions. SQLite stores real persistent records; sessions identify each user, and conversation access is checked on the server.

## Visual system

Pure white background, green-black text `#17251f`, forest green `#266b4f`, pale green selected surfaces `#f2f7f4`, restrained borders `#e1e8e4`, bundled Inter, thin vector icons and softly rounded post/composer frames. A left navigation rail, readable central feed and lightweight right suggestions rail preserve the social-app skeleton. Mobile uses five bottom navigation items and a single content column. Chats show the directory and conversation side by side on desktop and one at a time on mobile.

The feed concept was checked against the desktop render for pure-white surfaces, navigation order, main heading and tabs, composer controls, author hierarchy, post anatomy, image framing, avatars and the suggestions rail. The interface shows actual persisted counts and disabled button states. Unread badges, search submission, sign-out, photo attachment, menus and detail screens are functional extensions. The reference's countryside photograph was recreated as a separate local production image without an overlay. Profiles reuse it as a neutral cover. Initial avatars are code-native; original portrait assets are preserved for original sample contacts.

## Architecture

React + Vite replace the old Create React App tooling. Small page/component modules use API data rather than a custom mutable global store. A Node server uses built-in HTTP, crypto and SQLite; no cloud credentials, database installation or backend dependency tree is required. The ZIP includes the compiled app so a Node installation is enough to launch it.

Password hashes never reach API responses. Queries are parameterized. Post/comment ownership, upload ownership, conversation membership and friend-request direction are validated server-side. Cross-origin mutations are rejected, sessions expire, uploaded formats/sizes are checked, and private conversation data cannot be read by another account.

## Scope

Local/server-backed small-group social networking, not an externally deployed public service. Sample accounts are explicitly labelled as demo content. There are no automatic replies or fabricated presence indicators. Public deployment requires hosting the Node server and persistent data directory, not just the static frontend. See the README for demo-mode and HTTPS settings, message window/directory limits and unsupported services.
