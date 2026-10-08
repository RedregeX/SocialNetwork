import React,{useState,useEffect,useCallback,useRef} from 'react';
import {X,MessageSquare} from 'lucide-react';
import {api} from './lib/api.js';
import {useRoute,usePoll} from './lib/hooks.js';
import Auth from './components/Auth.jsx';
import {Sidebar,Topbar,RightRail} from './components/Shell.jsx';
import {Loading,ErrorState,Modal,Empty} from './components/UI.jsx';
import Feed,{Bookmarks,PostDetail,PostFeed} from './pages/Feed.jsx';
import Friends,{SearchResults} from './pages/Friends.jsx';
import Profile from './pages/Profile.jsx';
import Messages from './pages/Messages.jsx';
import Settings from './pages/Settings.jsx';
import Notifications from './pages/Notifications.jsx';

export default function App(){
  const [user,setUser]=useState(null),[boot,setBoot]=useState(true),[error,setError]=useState(''),[demo,setDemo]=useState(false),[people,setPeople]=useState([]),[peopleLoading,setPeopleLoading]=useState(true),[notifications,setNotifications]=useState([]),[notificationCount,setNotificationCount]=useState(0),[messageCount,setMessageCount]=useState(0),[toast,setToast]=useState(''),[logout,setLogout]=useState(false),[route,navigate]=useRoute();const toastTimer=useRef(null),sessionRevision=useRef(0);
  const notify=useCallback(message=>{setToast(message);clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(''),4500);},[]);
  async function bootstrap(){setBoot(true);setError('');try{const session=await api('/session');setUser(session.user);setDemo(session.demo);}catch(e){setError(e.message);}finally{setBoot(false);}}
  useEffect(()=>{bootstrap();function expired(){sessionRevision.current++;setUser(null);setPeople([]);notify('Your session ended. Please sign in again.');}window.addEventListener('social:unauthorized',expired);return()=>{clearTimeout(toastTimer.current);window.removeEventListener('social:unauthorized',expired);};},[]);
  const refreshActivity=useCallback(async()=>{if(!user)return;const revision=sessionRevision.current;const results=await Promise.allSettled([api('/notifications'),api('/conversations')]);if(revision!==sessionRevision.current)return;if(results[0].status==='fulfilled'){setNotifications(results[0].value.notifications);setNotificationCount(results[0].value.unread);}if(results[1].status==='fulfilled')setMessageCount(results[1].value.conversations.reduce((s,c)=>s+c.unread,0));},[user?.id]);
  async function getPeople(initial=false){if(!user)return;const revision=sessionRevision.current;if(initial)setPeopleLoading(true);try{const result=await api('/people');if(revision===sessionRevision.current)setPeople(result.people);}catch(e){if(initial)notify(e.message);}finally{if(revision===sessionRevision.current)setPeopleLoading(false);}}
  useEffect(()=>{if(user){getPeople(true);refreshActivity();}else{setPeople([]);setNotifications([]);setNotificationCount(0);setMessageCount(0);}},[user?.id]);
  usePoll(()=>{if(user){refreshActivity();getPeople();}},15000);
  useEffect(()=>{if(!route.startsWith('/messages/'))window.scrollTo({top:0,behavior:'instant'});},[route]);
  async function friend(person,action){try{const result=await api(`/friends/${person.id}`,{method:'POST',body:{action}});setPeople(ps=>ps.map(p=>p.id===person.id?result.user:p));refreshActivity();notify(action==='request'?`Friend request sent to ${person.name}.`:action==='accept'?`You and ${person.name} are now friends.`:action==='remove'?'Friend removed.':action==='cancel'?'Request cancelled.':'Request declined.');}catch(e){notify(e.message);}}
  async function message(person){try{const result=await api('/conversations',{method:'POST',body:{peerId:person.id}});navigate(`/messages/${result.id}`);}catch(e){notify(e.message);}}
  async function signOut(){try{await api('/auth/logout',{method:'POST'});sessionRevision.current++;setUser(null);setLogout(false);navigate('/feed');notify('You’ve signed out.');}catch(e){notify(e.message);}}
  function signIn(u){sessionRevision.current++;setUser(u);navigate('/feed');}
  const [path,queryString]=route.split('?'),query=new URLSearchParams(queryString).get('q')||'';
  const isMessages=path.startsWith('/messages'),isProfile=path.startsWith('/profile');
  const props={user,navigate,notify},peopleProps={people,navigate,onFriend:friend,onMessage:message};
  let page;
  if(path==='/feed'||path==='/')page=<Feed {...props}/>;
  else if(isMessages)page=<Messages {...props} {...peopleProps} threadId={path.split('/')[2]||null} onUnreadRefresh={refreshActivity}/>;
  else if(path==='/friends')page=<Friends {...peopleProps} loading={peopleLoading}/>;
  else if(path==='/bookmarks')page=<Bookmarks {...props}/>;
  else if(isProfile)page=<Profile key={path} {...props} profileId={path.split('/')[2]||user?.id} onFriend={friend} onMessage={message}/>;
  else if(path==='/settings')page=<Settings key={user?.id} {...props} setUser={setUser} onLogout={()=>setLogout(true)}/>;
  else if(path==='/notifications')page=<Notifications {...props} notifications={notifications} refresh={refreshActivity}/>;
  else if(path==='/search')page=<SearchResults {...peopleProps} query={query}><PostFeed {...props} key={query} query={`q=${encodeURIComponent(query)}`} emptyTitle="No matching posts" emptyCopy="Try another word, name or phrase."/></SearchResults>;
  else if(path.startsWith('/post/'))page=<PostDetail {...props} key={path} postId={path.split('/')[2]}/>;
  else page=<Empty title="This page wandered off" action="Back to your feed" onAction={()=>navigate('/feed')}>Try another link, or head back home.</Empty>;
  return <>{boot?<div className="boot-screen"><div className="wordmark"><MessageSquare size={27}/>social.</div><Loading label="Making a little space for you…"/></div>:error?<div className="boot-screen"><ErrorState message={error} onRetry={bootstrap}/></div>:!user?<Auth demo={demo} onLogin={signIn}/>:<div className="app-shell"><Sidebar user={user} route={path} navigate={navigate} unread={messageCount} onLogout={()=>setLogout(true)}/><div className="app-body"><Topbar key={user.id} navigate={navigate} notificationCount={notificationCount} user={user}/><div className={`workspace ${isMessages?'message-workspace':''}`}><main className={`main-content ${isMessages?'full-width':''}`}>{page}</main>{!isMessages?<RightRail people={people} navigate={navigate} onFriend={friend} user={user}/>:null}</div></div></div>}{logout?<Modal title="Sign out?" onClose={()=>setLogout(false)}><p className="muted">Your posts, conversations and profile will be here when you come back.</p><div className="dialog-actions"><button className="button secondary" onClick={()=>setLogout(false)}>Stay here</button><button className="button primary" onClick={signOut}>Sign out</button></div></Modal>:null}{toast?<div className="toast" role="status">{toast}<button aria-label="Close notification" onClick={()=>setToast('')}><X size={17}/></button></div>:null}</>;
}
