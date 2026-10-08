import React,{useState,useEffect} from 'react';
import {Bookmark,Search,MessageCircle} from 'lucide-react';
import {api} from '../lib/api.js';
import {useResource} from '../lib/hooks.js';
import {Loading,ErrorState,Empty} from '../components/UI.jsx';
import Composer from '../components/Composer.jsx';
import PostCard from '../components/PostCard.jsx';

export function PostFeed({user,navigate,notify,query='',composer=false,emptyTitle='Nothing here yet',emptyCopy='Start the conversation with your first post.'}){
  const resource=useResource(`/posts?${query}`),[loadingMore,setLoadingMore]=useState(false);
  function update(p){resource.setData(d=>d?{...d,posts:d.posts.map(x=>x.id===p.id?p:x)}:d);}
  function remove(id){resource.setData(d=>d?{...d,posts:d.posts.filter(x=>x.id!==id)}:d);}
  async function more(){if(loadingMore)return;setLoadingMore(true);try{const result=await api(`/posts?${query}&offset=${resource.data.posts.length}`);resource.setData(d=>({...result,posts:[...d.posts,...result.posts.filter(p=>!d.posts.some(x=>x.id===p.id))]}));}catch(e){notify(e.message);}finally{setLoadingMore(false);}}
  return <>{composer?<Composer key={user.id} user={user} notify={notify} onCreated={post=>resource.setData(d=>d?{...d,posts:[post,...d.posts]}:{posts:[post],hasMore:false})}/>:null}{resource.loading?<Loading label="Loading posts…"/>:resource.error?<ErrorState message={resource.error} onRetry={resource.reload}/>:!resource.data?.posts.length?<Empty icon={query.includes('saved=1')?Bookmark:MessageCircle} title={emptyTitle}>{emptyCopy}</Empty>:<div className="feed-list">{resource.data.posts.map(post=><PostCard key={post.id} post={post} user={user} onUpdate={update} onDelete={remove} navigate={navigate} notify={notify}/>)}{resource.data.hasMore?<button className="button secondary load-more" disabled={loadingMore} onClick={more}>{loadingMore?'Loading…':'More posts'}</button>:<p className="feed-end">You’re all caught up.</p>}</div>}</>;
}
export default function Feed({user,navigate,notify}){const [tab,setTab]=useState('everyone');return <><div className="page-title"><h1>Your feed</h1><p>A little closer to your people.</p></div><div className="tabs"><button className={tab==='everyone'?'active':''} onClick={()=>setTab('everyone')}>Everyone</button><button className={tab==='friends'?'active':''} onClick={()=>setTab('friends')}>Friends</button></div><PostFeed key={tab} user={user} navigate={navigate} notify={notify} query={tab==='friends'?'scope=friends':''} composer/></>;}
export function Bookmarks(props){return <><div className="page-title"><h1>Bookmarks</h1><p>The things you wanted to come back to.</p></div><PostFeed {...props} query="saved=1" emptyTitle="Keep something good" emptyCopy="Tap the bookmark on a post and it will be saved here."/></>;}
export function PostDetail({postId,...props}){const resource=useResource(`/posts/${postId}`);return <><div className="page-title"><h1>A conversation</h1><p>One thought can start something.</p></div>{resource.loading?<Loading/>:resource.error?<ErrorState message={resource.error} onRetry={resource.reload}/>:resource.data?<PostCard post={resource.data.post} {...props} expandComments onUpdate={p=>resource.setData({post:p})} onDelete={()=>props.navigate('/feed')}/>:null}</>;}
