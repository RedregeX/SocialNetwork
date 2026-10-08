import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {randomUUID,randomBytes,scryptSync} from 'node:crypto';
export const id=()=>randomUUID();
export const now=()=>Date.now();
export function openDatabase(directory,{demo=true}={}){
  mkdirSync(directory,{recursive:true});
  const db=new DatabaseSync(resolve(directory,'social.sqlite'));
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY,handle TEXT UNIQUE NOT NULL COLLATE NOCASE,name TEXT NOT NULL,password TEXT NOT NULL,salt TEXT NOT NULL,bio TEXT NOT NULL DEFAULT '',location TEXT NOT NULL DEFAULT '',color TEXT NOT NULL DEFAULT '#d5e7de',avatar TEXT,created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY,author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,text TEXT NOT NULL,image TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS posts_time ON posts(created_at DESC);
    CREATE TABLE IF NOT EXISTS likes (post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,PRIMARY KEY(post_id,user_id));
    CREATE TABLE IF NOT EXISTS bookmarks (post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,PRIMARY KEY(post_id,user_id));
    CREATE TABLE IF NOT EXISTS comments (id TEXT PRIMARY KEY,post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,text TEXT NOT NULL,created_at INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS comments_post ON comments(post_id,created_at);
    CREATE TABLE IF NOT EXISTS friendships (a TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,b TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,requested_by TEXT NOT NULL REFERENCES users(id),status TEXT NOT NULL CHECK(status IN ('pending','accepted')),created_at INTEGER NOT NULL,PRIMARY KEY(a,b),CHECK(a<b));
    CREATE TABLE IF NOT EXISTS conversations (id TEXT PRIMARY KEY,a TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,b TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,updated_at INTEGER NOT NULL,UNIQUE(a,b),CHECK(a<b));
    CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY,conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,text TEXT NOT NULL,created_at INTEGER NOT NULL,read_at INTEGER);
    CREATE INDEX IF NOT EXISTS messages_thread ON messages(conversation_id,created_at);
    CREATE TABLE IF NOT EXISTS notifications (id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,actor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,type TEXT NOT NULL,resource TEXT NOT NULL,created_at INTEGER NOT NULL,read INTEGER NOT NULL DEFAULT 0);
    CREATE INDEX IF NOT EXISTS notifications_user ON notifications(user_id,created_at DESC);
    CREATE TABLE IF NOT EXISTS uploads (path TEXT PRIMARY KEY,owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,created_at INTEGER NOT NULL);
    PRAGMA user_version=1;`);
  if(demo&&!db.prepare('SELECT id FROM users LIMIT 1').get())seed(db);
  db.prepare('DELETE FROM sessions WHERE expires_at<?').run(now());
  return db;
}
function seed(db){
  const users=[
    ['alex','Alex Morgan','Building small things for the web. Here for good conversations.','Dublin, Ireland','#d5e7de'],
    ['jamie','Jamie Chen','Finding the scenic route. Photography, trails and tiny adventures.','Dublin, Ireland','#d5e7de'],
    ['morgan','Morgan Lee','Making the web a little more useful, one project at a time.','Galway, Ireland','#d5e7de'],
    ['sam','Sam Rivera','Photographer, hiker, good coffee enjoyer.','Cork, Ireland','#f6d7c9'],
    ['taylor','Taylor Brooks','Designer and amateur cook.','Dublin, Ireland','#c3e1ea'],
    ['casey','Casey Kim','Building simple things on the web.','London, UK','#e0d9f5'],
    ['bill','Bill','One of the original project contacts.','Seattle, USA','#d6e7d8','/legacy/bill.jpg'],
    ['linus','Linus','One of the original project contacts.','Helsinki, Finland','#dbe4f5','/legacy/maxresdefault.jpg'],
    ['donald','Donald','One of the original project contacts.','USA','#f5dcca','/legacy/donald.jpg'],
    ['rick','Rick Astley','Music, old favourites and new conversations.','UK','#efe3c4'],
    ['elon','Elon Musk','An original demo conversation, carried over from the old project.','USA','#e4dfed'],
    ['silvester','Silvester Stallone','An original demo contact.','USA','#d1e0ea'],
    ['devon','Devon Park','Sketchbooks and side projects.','Dublin, Ireland','#d7e9eb'],
    ['skye','Skye Bennett','Collecting little moments.','Dublin, Ireland','#e7ddcd']
  ];
  const map={};
  const insert=db.prepare('INSERT INTO users(id,handle,name,bio,location,color,avatar,password,salt,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)');
  db.exec('BEGIN');
  try{
    for(const [handle,name,bio,location,color,avatar] of users){const salt=randomBytes(16).toString('hex');const password=scryptSync('social-demo-2026',salt,64).toString('hex');const userId=id();map[handle]=userId;insert.run(userId,handle,name,bio,location,color,avatar||null,password,salt,now()-86400000*7);}
    const addPost=(author,text,image,hours)=>{const postId=id(),time=now()-hours*3600000;db.prepare('INSERT INTO posts VALUES(?,?,?,?,?,?)').run(postId,map[author],text,image||null,time,time);return postId;};
    const photo=addPost('jamie','Took the long way home. Sometimes the best part of the day is the bit you didn’t plan.','/countryside.webp',2);
    const project=addPost('morgan','Small project update: shipped a new version of the photo gallery today. It’s faster, cleaner and a lot more fun to use. Still a few things to polish, but really happy with how it’s coming together.',null,4);
    addPost('sam','Weekend plan: a long walk, a short coffee, and absolutely no rush. Anyone have a favourite trail near Dublin?',null,7);
    const welcome=addPost('alex','Hello, world! Rebuilt this little corner of the internet. Drop a thought, start a conversation, make yourself at home.',null,10);
    addPost('taylor','A reminder to keep the rough sketches. Sometimes the first idea has something the polished version loses.',null,14);
    addPost('casey','Finally fixed a bug that had been following me around all week. The solution? One missing return. Taking the win anyway.',null,18);
    for(const handle of Object.keys(map).filter(h=>h!=='jamie'&&h!=='alex'))db.prepare('INSERT INTO likes VALUES(?,?)').run(photo,map[handle]);
    for(const [handle,text] of [['sam','That view! Definitely worth the detour.'],['taylor','Adding this to my weekend list.'],['casey','The light is perfect.']])db.prepare('INSERT INTO comments VALUES(?,?,?,?,?)').run(id(),photo,map[handle],text,now()-3600000);
    db.prepare('INSERT INTO comments VALUES(?,?,?,?,?)').run(id(),project,map.alex,'Would love to see the finished gallery!',now()-10800000);
    for(const handle of ['jamie','morgan','bill','linus','donald']){const [a,b]=[map.alex,map[handle]].sort();db.prepare('INSERT INTO friendships VALUES(?,?,?,?,?)').run(a,b,map.alex,'accepted',now()-86400000);}
    for(const [handle,text] of [['jamie','Hey Alex! Did you get a chance to go for that walk?'],['morgan','I’ve got the gallery update ready if you want to take a look.'],['rick','Never gonna give this conversation up.'],['elon','The old demo chat has its own thread now.'],['silvester','Good to see the project working again.']]){const [a,b]=[map.alex,map[handle]].sort(),thread=id();db.prepare('INSERT INTO conversations VALUES(?,?,?,?)').run(thread,a,b,now()-1800000);db.prepare('INSERT INTO messages VALUES(?,?,?,?,?,?)').run(id(),thread,map[handle],text,now()-1800000,null);}
    db.prepare('INSERT INTO comments VALUES(?,?,?,?,?)').run(id(),welcome,map.jamie,'Nice to see this space come together!',now()-1800000);
    db.prepare('INSERT INTO notifications VALUES(?,?,?,?,?,?,?)').run(id(),map.alex,map.jamie,'comment',JSON.stringify({postId:welcome}),now()-1800000,0);
    db.exec('COMMIT');
  }catch(e){db.exec('ROLLBACK');throw e;}
}
