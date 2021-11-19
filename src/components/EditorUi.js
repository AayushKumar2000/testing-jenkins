import React, { useState, useEffect} from 'react';
import MyEditor from './editor'
import { convertToRaw } from 'draft-js';
import userPic from './img/pic.jpg';
import axios from 'axios';



const EditorUi = (props) =>{
  let newTime=null,draftTime=null;
  

   draftTime = (localStorage.getItem('lastSaveDraftTime'));
   newTime = Math.floor((Math.abs(new Date() - new Date(draftTime))/60000));

 const user = JSON.parse(localStorage.getItem('user'))
 const savedDraft =  JSON.parse(localStorage.getItem(props.match.params.draftID))
  
console.log(newTime)
  const [wordCount, setWordCount] = useState(0);
  const [blogID, setBlofID] = useState(Date.now())
  const [editorState,setEditorState] = useState(null); 
  const [title,setTitle] = useState(savedDraft?savedDraft.title:"");
  const [draftSavedTime,setDraftSavedTime] = useState(0)
  const [ visibilityType, setVisibilityType] = useState('PUBLIC');
  const [publishStatus, setPublishStatus] = useState("Publish");
  const [copyStatus,setCopyStatus] = useState("Copy URL")

  const editorContent = (state)=>{
    console.log(state)
    setEditorState(state)
    let wordCount=0;

    if(state.blocks[0].text.length===0){
      setWordCount(wordCount)
    }
    
    state.blocks.forEach(({text})=>{
      if(text.length!==0 && text.trim()!=="")
       wordCount+= text.match(/(\w+)/g).length;
    })
    setWordCount(wordCount)
    
    
  }

  const onPublishPress = ()=>{
    setPublishStatus("Publishing...")
    console.log(JSON.stringify(editorState))
    axios.post('/blog/publish',{
      "blogID": blogID,
      "blogContent": JSON.stringify(editorState),
      "user": user.name,
      "type":visibilityType.toUpperCase(),
      "title": title

    }).then((res)=>{
      if(res.status===201)
       setPublishStatus('Published')

    })
    
  }

  const copyBlogLink=()=>{
    let hostName = window.location.hostname;
    if(hostName==="localhost")
      hostName+= ":"+window.location.port

    navigator.clipboard.
    writeText(`${hostName}/${user.name}/${title.trim().replaceAll(" ","-")}-${blogID}`);

    setCopyStatus("URL Copied")
  }

 


  const saveLocal = () =>{
    const draftName = props.match.params.draftID ? props.match.params.draftID.substr(11) : blogID
          localStorage.setItem(`blog-draft-${draftName}`,(JSON.stringify({ title, editorState, date: new Date()+""})));
          const time = new Date();
          localStorage.setItem('lastSaveDraftTime',new Date()+"")
          setDraftSavedTime(0)
            setTimeout(()=>setDraftSavedTime(draftSavedTime+1), 1000*60);


  }

   
 

  return <div className="flex flex-col h-screen w-screen bg-gray-50">
     <div className="flex items-center  pl-5 h-16 bg-purple-600 w-full text-white">
       <div> BlogNow</div>
       <div className="ml-auto pr-10 flex items-center">
       <img alt="user_avatar" src={userPic} className="w-9 rounded-full "/>
        <div className="font-normal pl-2 text-base">{user.name}</div>
       </div>
     </div>
     <div className="bg-gray-200 h-15 ">
        <textarea value={title} onChange={(event)=>setTitle(event.target.value)} placeholder="Write Title here" className="pl-6 placeholder-gray-300 placeholder- text-2xl font-semibold  w-full border-none outline-none border-transparent " id="title" name="title" />
     </div>

     <div className="flex h-full w-full ">
         <div className="h-full w-4/5">{
            props.match.params.draftID &&!savedDraft? <div className="text-xl pl-5 font-bold  font-timeNewRoman">No Saved Draft Found</div>:
              <MyEditor editorContent={editorContent} draftID={props.match.params.draftID}/>
          }
          </div>

         <div  className="flex w-1/5 h-full flex-col p-2 border-4 border-gray-100">
           <button disabled={wordCount===0?'disabled':''} type="button"  onClick={()=>saveLocal()} className="disabled:opacity-50  px-8 py-1 bg-gray-300 inline-block shadow-sm hover:bg-gray-400 rounded-md">Save Draft</button>
           <div className="text-gray-300 mt-1 ml-1">{draftSavedTime?`Last saved ${draftSavedTime} minutes ago`:""}</div>
           <div className="mt-3">
             <div className="flex align-middle">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <div className="ml-2">Visibility:<span className="ml-2 font-semibold">
              <select onChange={(event) => setVisibilityType(event.target.value)} className="p-0 pr-7 pl-2 pb-0.5 rounded-md form-select   border-gray-200 bg-white font-semibold" name="visibility" id="visibility">
                      <option  value="Public">Public</option>
                      <option  value="Private">Private</option>
                    </select>
                 </span></div>
             </div>             
             <div className="flex align-middle mt-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
               </svg>
               <div className="ml-2">Last Published:<span className="ml-2 font-semibold">Today</span></div>
             </div>
           </div>
           <div className="mt-auto pl-1">Words: <span>{wordCount}</span></div>
           <button  onClick={()=>onPublishPress()} type="button" disabled={wordCount===0?'disabled':''} className="disabled:opacity-50    mt-2 px-8 py-1 mb-3 bg-green-400 text-white rounded-md shadow-sm hover:bg-green-500">
            {publishStatus}</button>
            {
              publishStatus!=="Published"?<div></div>:<button
            className=" flex justify-center text-base font-medium bg-blue-400 text-white py-1.5 rounded-md shadow-sm mb-3 hover:bg-blue-500"
            onClick={() => copyBlogLink()}><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
                {copyStatus}</button>
            }
         </div>
     </div>
  </div>
}

export default EditorUi;