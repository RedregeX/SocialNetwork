export async function api(path,{body,signal,...options}={}){
  let response;
  try{response=await fetch(`/api${path}`,{...options,signal,credentials:'same-origin',headers:body!==undefined?{'Content-Type':'application/json',...options.headers}:options.headers,body:body!==undefined?JSON.stringify(body):undefined});}catch(e){if(e.name==='AbortError')throw e;throw new Error('Cannot reach the server. Check that the start window is still running.');}
  const payload=await response.json().catch(()=>({error:'The server returned an unreadable response.'}));
  if(!response.ok){const error=Object.assign(new Error(payload.error||'The request failed.'),{status:response.status});if(response.status===401&&!path.startsWith('/auth')&&path!=='/session')window.dispatchEvent(new Event('social:unauthorized'));throw error;}
  return payload;
}
export function readImage(file){return new Promise((resolve,reject)=>{if(!/^image\/(jpeg|png|webp|gif)$/.test(file.type))return reject(new Error('Choose a JPG, PNG, WebP or GIF image.'));if(file.size>5*1024*1024)return reject(new Error('Images must be under 5 MB.'));const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('This image could not be read.'));reader.readAsDataURL(file);});}
export async function uploadImage(file){const data=await readImage(file);return (await api('/uploads',{method:'POST',body:{data}})).path;}
export function download(name,value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function relativeTime(time){const delta=Math.max(0,Date.now()-time),minutes=Math.floor(delta/60000);return minutes<1?'Just now':minutes<60?`${minutes}m`:minutes<1440?`${Math.floor(minutes/60)}h`:minutes<10080?`${Math.floor(minutes/1440)}d`:new Date(time).toLocaleDateString(undefined,{month:'short',day:'numeric'});}
