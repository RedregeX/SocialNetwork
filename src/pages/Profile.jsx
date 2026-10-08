import React,{useState} from 'react';
import {MapPin,Calendar,Pencil,MessageCircle} from 'lucide-react';
import {useResource} from '../lib/hooks.js';
import {Avatar,Loading,ErrorState} from '../components/UI.jsx';
import {FriendButton} from './Friends.jsx';
import {PostFeed} from './Feed.jsx';
export default function Profile({profileId,user,navigate,notify,onFriend,onMessage,peopleVersion}){
  const resource=useResource(`/users/${profileId}`);
  const p=resource.data?.user;
  if(resource.loading)return <Loading label="Loading profile…"/>;if(resource.error)return <ErrorState message={resource.error} onRetry={resource.reload}/>;if(!p)return null;
  const mine=p.id===user.id;
  async function friend(person,action){await onFriend(person,action);resource.reload();}
  return <><div className="profile-cover"><img src="./countryside.webp" alt="Green countryside profile cover"/></div><section className="profile-summary"><div className="profile-top"><Avatar user={mine?user:p} size="large"/><div className="profile-buttons">{mine?<button className="button secondary" onClick={()=>navigate('/settings')}><Pencil size={16}/> Edit profile</button>:<><FriendButton person={p} onFriend={friend}/><button className="button primary" onClick={()=>onMessage(p)}><MessageCircle size={17}/> Message</button></>}</div></div><h1>{mine?user.name:p.name}</h1><p className="profile-handle">@{p.handle}</p><p className="profile-bio">{mine?user.bio:p.bio||'A little space to share a little more.'}</p><div className="profile-details">{(mine?user.location:p.location)?<span><MapPin size={15}/>{mine?user.location:p.location}</span>:null}<span><Calendar size={15}/> Joined {new Date(p.createdAt).toLocaleDateString(undefined,{month:'long',year:'numeric'})}</span></div><div className="profile-stats"><span><strong>{p.postCount}</strong> posts</span>{mine?<button onClick={()=>navigate('/friends')}><strong>{p.friendCount}</strong> friends</button>:<span><strong>{p.friendCount}</strong> friends</span>}</div></section><div className="profile-post-heading"><h2>{mine?'Your posts':`${p.name.split(' ')[0]}’s posts`}</h2></div><PostFeed user={user} navigate={navigate} notify={notify} query={`author=${p.id}`} composer={mine} emptyTitle={mine?'Start your story':'A quiet corner for now'} emptyCopy={mine?'Your first thought belongs right here.':'This person hasn’t shared a post yet.'}/></>;
}
