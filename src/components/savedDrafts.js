import React,{useState} from 'react';
import userPic from './img/pic.jpg';



const SavedDraft = ()=>{

    const storageLength  = localStorage.length;
    const [draftArray,setDraftArray] = useState(null);
    const userName = JSON.parse(localStorage.getItem('user')).name
     let localDraftArray = [];

     if(draftArray==null){
    for( var index=0;index<storageLength;index++){
        const key  = localStorage.key(index);
        if(!key.match(/blog-draft-/))
          continue;

         const item = JSON.parse(localStorage.getItem(key))
         const date = new Date(item.date).toLocaleDateString('en-us', { year:"numeric", month:"long", day:"numeric"}) 
        localDraftArray.push({key,title:item.title,date});

       
    }
       console.log(localDraftArray)
       setDraftArray(localDraftArray)
  }

    



    const removeDraft=(key) =>{
    const newItems =  draftArray.filter((val)=>{
       if(val.key!==key)
         return val
     })  
     console.log(newItems)
      setDraftArray(newItems);
      localStorage.removeItem(key);

    }

    return <div className="flex flex-col  bg-gray-50">
    {/* <div className="flex items-center  pl-5 h-16 bg-purple-600 w-full text-white">
      <div> BlogNow</div>
      <div className="ml-auto pr-10 flex items-center">
      <img alt="user_avatar" src={userPic} className="w-9 rounded-full "/>
      <div className="font-normal pl-2 text-base">{userName}</div>
      </div>
    </div> */}
    <div>
        {/* <div>Saved Draft</div> */}
        <div className="mx-40 my-10">
        <div className="flex justify-between  border-b-2 py-5 px-3 text-lg font-medium text-gray-300">
            <div>Title</div>
            <div className="flex w-72 justify-between"> 
                <div className="">Last Edited</div>
                <div className="mr-20">Published</div>
            </div>
        </div>
         {
            draftArray!==null&&draftArray.map((item)=>{
                console.log(item.date)
                return <div  key={item.key} className="flex justify-between px-3 py-3 border-b-2 font-Cambria">
                          <a href={`editor/write/${item.key}`}>{item.title}</a>
                          <div className="flex w-72 justify-between">
                            <div className="">{item.date}</div>
                            <div className="">None</div>
                            <button onClick={() => removeDraft(item.key)} className="px-2 py-0.5 bg-red-500 text-white rounded-sm hover:bg-red-600">Remove</button>
                          </div>
                          
                        </div>
            })
         }
        </div>
    </div>
    </div>
    
    
}

export default SavedDraft;