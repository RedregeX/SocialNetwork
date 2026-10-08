import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes,scrypt,timingSafeEqual,createHash} from 'node:crypto';
import {promisify} from 'node:util';
import {openDatabase,id,now} from './database.mjs';

const hashPassword=promisify(scrypt),root=fileURLToPath(new URL('../',import.meta.url));
const data=resolve(process.env.SOCIAL_DATA_DIR||resolve(root,'data'));
const demo=process.env.DEMO_MODE!=='0';
const db=openDatabase(data,{demo});
const uploads=resolve(data,'uploads'),dist=resolve(root,'dist');
await mkdir(uploads,{recursive:true});
const port=Number(process.env.PORT)||3001,host=process.env.HOST||'127.0.0.1';
const publicUser=u=>u?{id:u.id,handle:u.handle,name:u.name,bio:u.bio,location:u.location,color:u.color,avatar:u.avatar,createdAt:u.created_at}:null;
const userById=userId=>typeof userId==='string'?db.prepare('SELECT * FROM users WHERE id=?').get(userId):null;
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
const text=(value,label,min,max)=>{if(typeof value!=='string'||value.trim().length<min||value.trim().length>max)fail(400,`${label} must contain ${min}–${max} characters.`);return value.trim();};
const secret=(value,min=1)=>{if(typeof value!=='string'||value.length<min||value.length>128)fail(400,`Password must contain ${min}–128 characters.`);return value;};
const pair=(a,b)=>[a,b].sort();
const notify=(to,actor,type,resource)=>{if(to!==actor)db.prepare('INSERT INTO notifications VALUES(?,?,?,?,?,?,0)').run(id(),to,actor,type,JSON.stringify(resource),now());};
function relation(viewer,target){if(viewer===target)return 'self';const row=db.prepare('SELECT * FROM friendships WHERE a=? AND b=?').get(...pair(viewer,target));return !row?'none':row.status==='accepted'?'friends':row.requested_by===viewer?'outgoing':'incoming';}
function person(viewer,row){return {...publicUser(row),relation:relation(viewer,row.id),postCount:db.prepare('SELECT COUNT(*) AS n FROM posts WHERE author_id=?').get(row.id).n,friendCount:db.prepare("SELECT COUNT(*) AS n FROM friendships WHERE (a=? OR b=?) AND status='accepted'").get(row.id,row.id).n};}
function postFor(viewer,row){return {id:row.id,text:row.text,image:row.image,createdAt:row.created_at,updatedAt:row.updated_at,author:publicUser(userById(row.author_id)),likes:db.prepare('SELECT COUNT(*) AS n FROM likes WHERE post_id=?').get(row.id).n,liked:!!db.prepare('SELECT 1 FROM likes WHERE post_id=? AND user_id=?').get(row.id,viewer),saved:!!db.prepare('SELECT 1 FROM bookmarks WHERE post_id=? AND user_id=?').get(row.id,viewer),commentCount:db.prepare('SELECT COUNT(*) AS n FROM comments WHERE post_id=?').get(row.id).n};}
function cookie(req){const value=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('social_session='))?.slice(15);if(!value||!/^[a-f0-9]{64}$/.test(value))return null;return value;}
function sessionUser(req){const token=cookie(req);if(!token)return null;const digest=createHash('sha256').update(token).digest('hex');const s=db.prepare('SELECT user_id FROM sessions WHERE token_hash=? AND expires_at>?').get(digest,now());return s?userById(s.user_id):null;}
function makeSession(req,res,userId){const token=randomBytes(32).toString('hex');db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(createHash('sha256').update(token).digest('hex'),userId,now()+7*86400000);res.setHeader('Set-Cookie',`social_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${process.env.COOKIE_SECURE==='1'?'; Secure':''}`);}
const limits=new Map();
function rateLimit(req){const key=req.socket.remoteAddress||'local',old=limits.get(key);const item=old&&now()-old.at<900000?old:{at:now(),count:0};item.count++;limits.set(key,item);if(limits.size>2000)for(const [k,v]of limits)if(now()-v.at>900000)limits.delete(k);if(item.count>30)fail(429,'Too many sign-in attempts. Please try again in 15 minutes.');}
async function body(req){const parts=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>7500000)fail(413,'Request is too large.');parts.push(chunk);}if(!size)return {};let value;try{value=JSON.parse(Buffer.concat(parts).toString('utf8'));}catch{fail(400,'Invalid JSON.');}if(!value||typeof value!=='object'||Array.isArray(value))fail(400,'The request must be a JSON object.');return value;}
function json(res,status,value){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value));}
function ownImage(userId,path){if(path===null||path==='')return null;if(typeof path!=='string'||!db.prepare('SELECT path FROM uploads WHERE path=? AND owner_id=?').get(path,userId))fail(400,'Please upload your image first.');return path;}
function getPost(postId){const p=db.prepare('SELECT * FROM posts WHERE id=?').get(postId);if(!p)fail(404,'This post no longer exists.');return p;}
function getThread(threadId,userId){const t=db.prepare('SELECT * FROM conversations WHERE id=?').get(threadId);if(!t||![t.a,t.b].includes(userId))fail(404,'Conversation not found.');return t;}

async function api(req,res,url){
  const path=url.pathname,method=req.method;
  if(!['GET','HEAD'].includes(method)&&req.headers.origin){try{if(new URL(req.headers.origin).host!==req.headers.host)fail(403,'This request came from another site.');}catch(e){if(e.status)throw e;fail(403,'Invalid origin.');}}
  if(path==='/api/health'&&method==='GET')return json(res,200,{ok:true});
  if(path==='/api/session'&&method==='GET'){const u=sessionUser(req);return json(res,200,{user:publicUser(u),demo});}
  if(path==='/api/auth/demo'&&method==='POST'){if(!demo)fail(404,'Demo access is disabled.');const user=db.prepare("SELECT * FROM users WHERE handle='alex'").get();if(!user)fail(404,'Demo account is unavailable.');makeSession(req,res,user.id);return json(res,200,{user:publicUser(user)});}
  if(path==='/api/auth/register'&&method==='POST'){
    rateLimit(req);const input=await body(req),name=text(input.name,'Name',2,60),handle=text(input.handle,'Handle',3,24).toLowerCase(),password=secret(input.password,8);
    if(!/^[a-z0-9_]+$/.test(handle))fail(400,'Use letters, numbers and underscores for your handle.');
    if(db.prepare('SELECT id FROM users WHERE handle=?').get(handle))fail(409,'That handle is already taken.');
    const userId=id(),salt=randomBytes(16).toString('hex'),digest=Buffer.from(await hashPassword(password,salt,64)).toString('hex');
    try{db.prepare('INSERT INTO users(id,handle,name,password,salt,created_at) VALUES(?,?,?,?,?,?)').run(userId,handle,name,digest,salt,now());}catch(e){if(e.message?.includes('UNIQUE constraint'))fail(409,'That handle is already taken.');throw e;}
    makeSession(req,res,userId);return json(res,201,{user:publicUser(userById(userId))});
  }
  if(path==='/api/auth/login'&&method==='POST'){
    rateLimit(req);const input=await body(req),handle=text(input.handle,'Handle',1,24).toLowerCase(),password=secret(input.password),u=db.prepare('SELECT * FROM users WHERE handle=?').get(handle);
    const calculated=Buffer.from(await hashPassword(password,u?.salt||'nonexistent-account-salt',64));
    if(!u||!timingSafeEqual(calculated,Buffer.from(u.password,'hex')))fail(401,'The handle or password is incorrect.');
    makeSession(req,res,u.id);return json(res,200,{user:publicUser(u)});
  }
  if(path==='/api/auth/logout'&&method==='POST'){const token=cookie(req);if(token)db.prepare('DELETE FROM sessions WHERE token_hash=?').run(createHash('sha256').update(token).digest('hex'));res.setHeader('Set-Cookie','social_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');return json(res,200,{ok:true});}
  const user=sessionUser(req);if(!user)fail(401,'Please sign in to continue.');
  if(path==='/api/me'&&method==='PATCH'){
    const input=await body(req),name=text(input.name??user.name,'Name',2,60),bio=text(input.bio??user.bio,'Bio',0,240),location=text(input.location??user.location,'Location',0,60),color=input.color??user.color;
    if(typeof color!=='string'||!/^#[a-fA-F0-9]{6}$/.test(color))fail(400,'Invalid avatar colour.');
    const avatar=input.avatar===undefined||input.avatar===user.avatar?user.avatar:ownImage(user.id,input.avatar);
    db.prepare('UPDATE users SET name=?,bio=?,location=?,color=?,avatar=? WHERE id=?').run(name,bio,location,color,avatar,user.id);return json(res,200,{user:publicUser(userById(user.id))});
  }
  if(path==='/api/me/password'&&method==='POST'){
    const input=await body(req),old=secret(input.current),next=secret(input.next,8),digest=Buffer.from(await hashPassword(old,user.salt,64));
    if(!timingSafeEqual(digest,Buffer.from(user.password,'hex')))fail(400,'Your current password is incorrect.');
    const salt=randomBytes(16).toString('hex'),password=Buffer.from(await hashPassword(next,salt,64)).toString('hex');db.prepare('UPDATE users SET salt=?,password=? WHERE id=?').run(salt,password,user.id);
    const current=createHash('sha256').update(cookie(req)).digest('hex');db.prepare('DELETE FROM sessions WHERE user_id=? AND token_hash<>?').run(user.id,current);return json(res,200,{ok:true});
  }
  if(path==='/api/me/export'&&method==='GET'){
    const posts=db.prepare('SELECT * FROM posts WHERE author_id=? ORDER BY created_at DESC').all(user.id).map(p=>postFor(user.id,p));
    const messages=db.prepare('SELECT * FROM messages WHERE sender_id=? ORDER BY created_at').all(user.id);
    return json(res,200,{exportedAt:now(),profile:publicUser(user),posts,messages,bookmarks:db.prepare('SELECT post_id FROM bookmarks WHERE user_id=?').all(user.id)});
  }
  if(path==='/api/uploads'&&method==='POST'){
    const input=await body(req),match=typeof input.data==='string'&&input.data.match(/^data:image\/(png|jpeg|webp|gif);base64,([A-Za-z0-9+/]+=*)$/);
    if(!match)fail(400,'Choose a PNG, JPG, WebP or GIF image.');
    const bytes=Buffer.from(match[2],'base64');if(bytes.length>5*1024*1024||bytes.length<12)fail(400,'Images must be under 5 MB.');
    const kind=match[1],valid=kind==='png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):kind==='jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:kind==='gif'?/^GIF8[79]a$/.test(bytes.subarray(0,6).toString()):bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP';
    if(!valid)fail(400,'The file is not a valid image.');
    const filename=`${id()}.${kind==='jpeg'?'jpg':kind}`,path=`/uploads/${filename}`;await writeFile(resolve(uploads,filename),bytes);db.prepare('INSERT INTO uploads VALUES(?,?,?)').run(path,user.id,now());return json(res,201,{path});
  }
  if(path==='/api/people'&&method==='GET'){
    const q=(url.searchParams.get('q')||'').slice(0,100).toLowerCase();
    const rows=db.prepare('SELECT * FROM users WHERE id<>? ORDER BY created_at DESC,handle').all(user.id).filter(u=>`${u.name} ${u.handle} ${u.bio}`.toLowerCase().includes(q));
    return json(res,200,{people:rows.slice(0,200).map(u=>person(user.id,u))});
  }
  const userMatch=path.match(/^\/api\/users\/([^/]+)$/);
  if(userMatch&&method==='GET'){const u=userById(userMatch[1]);if(!u)fail(404,'Profile not found.');return json(res,200,{user:person(user.id,u)});}
  const friendMatch=path.match(/^\/api\/friends\/([^/]+)$/);
  if(friendMatch&&method==='POST'){
    const target=userById(friendMatch[1]);if(!target||target.id===user.id)fail(400,'Choose another person.');
    const {action}=await body(req),[a,b]=pair(user.id,target.id),row=db.prepare('SELECT * FROM friendships WHERE a=? AND b=?').get(a,b);
    if(action==='request'){if(row)fail(409,'A connection already exists.');db.prepare('INSERT INTO friendships VALUES(?,?,?,?,?)').run(a,b,user.id,'pending',now());notify(target.id,user.id,'friend_request',{userId:user.id});}
    else if(action==='accept'){if(!row||row.status!=='pending'||row.requested_by===user.id)fail(400,'There is no incoming request to accept.');db.prepare("UPDATE friendships SET status='accepted' WHERE a=? AND b=?").run(a,b);notify(target.id,user.id,'friend_accepted',{userId:user.id});db.prepare("UPDATE notifications SET read=1 WHERE user_id=? AND actor_id=? AND type='friend_request'").run(user.id,target.id);}
    else if(['cancel','decline','remove'].includes(action)){if(!row)fail(404,'Connection not found.');if(action==='remove'&&row.status!=='accepted'||action==='cancel'&&(row.status!=='pending'||row.requested_by!==user.id)||action==='decline'&&(row.status!=='pending'||row.requested_by===user.id))fail(400,'This action is not available.');db.prepare('DELETE FROM friendships WHERE a=? AND b=?').run(a,b);db.prepare("DELETE FROM notifications WHERE type='friend_request' AND ((user_id=? AND actor_id=?) OR (user_id=? AND actor_id=?))").run(user.id,target.id,target.id,user.id);}
    else fail(400,'Unknown friendship action.');
    return json(res,200,{user:person(user.id,target)});
  }
  if(path==='/api/posts'&&method==='GET'){
    const author=url.searchParams.get('author'),scope=url.searchParams.get('scope'),saved=url.searchParams.get('saved')==='1',q=(url.searchParams.get('q')||'').slice(0,100).toLowerCase(),offset=Math.max(0,Math.min(100000,Number(url.searchParams.get('offset'))||0));
    const where=[],args=[];
    if(author){where.push('p.author_id=?');args.push(author);}
    if(saved){where.push('EXISTS(SELECT 1 FROM bookmarks b WHERE b.post_id=p.id AND b.user_id=?)');args.push(user.id);}
    if(scope==='friends'){where.push("(p.author_id=? OR EXISTS(SELECT 1 FROM friendships f WHERE f.status='accepted' AND ((f.a=? AND f.b=p.author_id) OR (f.b=? AND f.a=p.author_id))))");args.push(user.id,user.id,user.id);}
    if(q){where.push("(instr(lower(p.text),?)>0 OR p.author_id IN(SELECT id FROM users WHERE instr(lower(name),?)>0 OR instr(lower(handle),?)>0))");args.push(q,q,q);}
    const rows=db.prepare(`SELECT p.* FROM posts p ${where.length?`WHERE ${where.join(' AND ')}`:''} ORDER BY p.created_at DESC,p.id DESC LIMIT 21 OFFSET ?`).all(...args,offset);
    return json(res,200,{posts:rows.slice(0,20).map(p=>postFor(user.id,p)),hasMore:rows.length>20});
  }
  if(path==='/api/posts'&&method==='POST'){
    const input=await body(req),content=text(input.text??'','Post',0,3000),image=input.image?ownImage(user.id,input.image):null;
    if(!content&&!image)fail(400,'Write something or attach a photo.');
    const postId=id(),time=now();db.prepare('INSERT INTO posts VALUES(?,?,?,?,?,?)').run(postId,user.id,content,image,time,time);return json(res,201,{post:postFor(user.id,getPost(postId))});
  }
  const postMatch=path.match(/^\/api\/posts\/([^/]+)$/);
  if(postMatch){const p=getPost(postMatch[1]);if(method==='GET')return json(res,200,{post:postFor(user.id,p)});if(p.author_id!==user.id)fail(403,'You can only edit your own posts.');if(method==='PATCH'){const input=await body(req),content=text(input.text??p.text,'Post',0,3000),image=input.image===undefined?p.image:input.image===p.image?p.image:ownImage(user.id,input.image);if(!content&&!image)fail(400,'A post cannot be empty.');db.prepare('UPDATE posts SET text=?,image=?,updated_at=? WHERE id=?').run(content,image,now(),p.id);return json(res,200,{post:postFor(user.id,getPost(p.id))});}if(method==='DELETE'){db.prepare('DELETE FROM posts WHERE id=?').run(p.id);return json(res,200,{ok:true});}}
  const reaction=path.match(/^\/api\/posts\/([^/]+)\/(like|bookmark)$/);
  if(reaction&&method==='POST'){
    const p=getPost(reaction[1]),input=await body(req);if(typeof input.active!=='boolean')fail(400,'Choose an active state.');const table=reaction[2]==='like'?'likes':'bookmarks',exists=db.prepare(`SELECT 1 FROM ${table} WHERE post_id=? AND user_id=?`).get(p.id,user.id);
    if(input.active){db.prepare(`INSERT OR IGNORE INTO ${table} VALUES(?,?)`).run(p.id,user.id);if(!exists&&table==='likes')notify(p.author_id,user.id,'like',{postId:p.id});}else db.prepare(`DELETE FROM ${table} WHERE post_id=? AND user_id=?`).run(p.id,user.id);return json(res,200,{post:postFor(user.id,p)});
  }
  const comments=path.match(/^\/api\/posts\/([^/]+)\/comments$/);
  if(comments){const p=getPost(comments[1]);if(method==='GET')return json(res,200,{comments:db.prepare('SELECT * FROM comments WHERE post_id=? ORDER BY created_at,id').all(p.id).map(c=>({id:c.id,text:c.text,createdAt:c.created_at,author:publicUser(userById(c.author_id))}))});if(method==='POST'){const input=await body(req),content=text(input.text,'Comment',1,1000),commentId=id(),time=now();db.prepare('INSERT INTO comments VALUES(?,?,?,?,?)').run(commentId,p.id,user.id,content,time);notify(p.author_id,user.id,'comment',{postId:p.id});return json(res,201,{comment:{id:commentId,text:content,createdAt:time,author:publicUser(user)},post:postFor(user.id,p)});}}
  const commentMatch=path.match(/^\/api\/comments\/([^/]+)$/);
  if(commentMatch&&method==='DELETE'){const c=db.prepare('SELECT * FROM comments WHERE id=?').get(commentMatch[1]);if(!c)fail(404,'Comment not found.');const p=getPost(c.post_id);if(c.author_id!==user.id&&p.author_id!==user.id)fail(403,'You cannot delete this comment.');db.prepare('DELETE FROM comments WHERE id=?').run(c.id);return json(res,200,{post:postFor(user.id,p)});}
  if(path==='/api/conversations'&&method==='GET'){
    const rows=db.prepare('SELECT * FROM conversations WHERE a=? OR b=? ORDER BY updated_at DESC').all(user.id,user.id);
    return json(res,200,{conversations:rows.map(t=>{const last=db.prepare('SELECT * FROM messages WHERE conversation_id=? ORDER BY created_at DESC,rowid DESC LIMIT 1').get(t.id);return {id:t.id,peer:publicUser(userById(t.a===user.id?t.b:t.a)),last:last?{text:last.text,createdAt:last.created_at,senderId:last.sender_id}:null,unread:db.prepare('SELECT COUNT(*) AS n FROM messages WHERE conversation_id=? AND sender_id<>? AND read_at IS NULL').get(t.id,user.id).n};})});
  }
  if(path==='/api/conversations'&&method==='POST'){
    const input=await body(req),peer=userById(input.peerId);if(!peer||peer.id===user.id)fail(400,'Choose another person.');const [a,b]=pair(user.id,peer.id),existing=db.prepare('SELECT id FROM conversations WHERE a=? AND b=?').get(a,b);if(existing)return json(res,200,{id:existing.id});const thread=id();db.prepare('INSERT INTO conversations VALUES(?,?,?,?)').run(thread,a,b,now());return json(res,201,{id:thread});
  }
  const messageMatch=path.match(/^\/api\/conversations\/([^/]+)\/messages$/);
  if(messageMatch){const t=getThread(messageMatch[1],user.id);if(method==='GET'){db.prepare('UPDATE messages SET read_at=? WHERE conversation_id=? AND sender_id<>? AND read_at IS NULL').run(now(),t.id,user.id);db.prepare("UPDATE notifications SET read=1 WHERE user_id=? AND type='message' AND json_extract(resource,'$.conversationId')=?").run(user.id,t.id);return json(res,200,{peer:publicUser(userById(t.a===user.id?t.b:t.a)),messages:db.prepare('SELECT * FROM (SELECT *,rowid AS position FROM messages WHERE conversation_id=? ORDER BY created_at DESC,rowid DESC LIMIT 300) ORDER BY created_at,position').all(t.id).map(m=>({id:m.id,text:m.text,senderId:m.sender_id,createdAt:m.created_at,read:!!m.read_at}))});}if(method==='POST'){const input=await body(req),content=text(input.text,'Message',1,4000),messageId=id(),time=now();db.prepare('INSERT INTO messages VALUES(?,?,?,?,?,NULL)').run(messageId,t.id,user.id,content,time);db.prepare('UPDATE conversations SET updated_at=? WHERE id=?').run(time,t.id);notify(t.a===user.id?t.b:t.a,user.id,'message',{conversationId:t.id});return json(res,201,{message:{id:messageId,text:content,senderId:user.id,createdAt:time,read:false}});}}
  if(path==='/api/notifications'&&method==='GET')return json(res,200,{notifications:db.prepare('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 100').all(user.id).map(n=>({id:n.id,actor:publicUser(userById(n.actor_id)),type:n.type,resource:JSON.parse(n.resource),createdAt:n.created_at,read:!!n.read})),unread:db.prepare('SELECT COUNT(*) AS n FROM notifications WHERE user_id=? AND read=0').get(user.id).n});
  if(path==='/api/notifications/read'&&method==='POST'){const input=await body(req);if(input.id)db.prepare('UPDATE notifications SET read=1 WHERE id=? AND user_id=?').run(input.id,user.id);else db.prepare('UPDATE notifications SET read=1 WHERE user_id=?').run(user.id);return json(res,200,{ok:true});}
  fail(404,'Endpoint not found.');
}
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.ico':'image/x-icon','.woff2':'font/woff2','.json':'application/json'};
const server=createServer(async(req,res)=>{
  try{const url=new URL(req.url,'http://localhost');if(url.pathname.startsWith('/api/'))return await api(req,res,url);if(!['GET','HEAD'].includes(req.method))fail(405,'Method not allowed.');
    const upload=url.pathname.startsWith('/uploads/'),base=upload?uploads:dist,path=upload?url.pathname.slice(8):url.pathname;let file=resolve(base,'.'+decodeURIComponent(path));
    if(file!==base&&!file.startsWith(base+sep))fail(403,'Forbidden');if(url.pathname.endsWith('/'))file=resolve(file,'index.html');
    try{if(!(await stat(file)).isFile())throw new Error();}catch{if(upload||extname(url.pathname))fail(404,'File not found.');file=resolve(dist,'index.html');}
    const bytes=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':extname(file)==='.html'?'no-cache':'public, max-age=86400','Content-Security-Policy':"default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",'Referrer-Policy':'same-origin'});res.end(req.method==='HEAD'?undefined:bytes);
  }catch(e){if(res.headersSent)return res.end();const status=e.status||500;if(status===500)console.error(e.message);json(res,status,{error:status===500?'Something went wrong. Please try again.':e.message});}
});
server.on('error',err=>{console.error(err.code==='EADDRINUSE'?`Port ${port} is in use. Set PORT to another number.`:err.message);db.close();process.exit(1);});
server.listen(port,host,()=>console.log(`social. is ready at http://localhost:${port}${demo?' (local demo enabled)':''}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{server.close(()=>{db.close();process.exit(0);});});
