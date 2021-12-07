import React, { useState,useEffect,useReducer } from 'react';
import draftToMarkdown from 'draftjs-to-markdown';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import userPic from './img/pic.jpg';
import { instance } from '../apis/axios_instance';



const getColor = {
  'color-#EF4444':'text-red-500',
  'color-#D1D5DB':'text-grey-300',
  'color-#FCD34D':'text-yellow-300',
  'color-#10B981':'text-green-500',
  'color-#3B82F6':'text-blue-500',
  'color-#6366F1':'text-indego-500',
  'color-#8B5CF6':'text-purple-500',
  'color-#EC4899':'text-pink-500',
  'color-#000000':'text-black',
}

const getFontSize = {
  'fontsize-8':'text-xs',
  'fontsize-9':'text-xs',
  'fontsize-10':'text-sm',
  'fontsize-11':'text-sm',
  'fontsize-12':'text-base',
  'fontsize-13':'text-base',
  'fontsize-14':'text-lg',
  'fontsize-16':'text-lg',
  'fontsize-18':'text-xl',
  'fontsize-24':'text-2xl',
  'fontsize-30':'text-3xl',
  'fontsize-36':'text-4xl',
  'fontsize-48':'text-5xl',
  'fontsize-60':'text-6xl',
  'fontsize-72':'text-7xl',
  'fontsize-96':'text-8xl',
}





const ShowEditorContent=(props)=>{

    const [likePressed,setLikePressed] = useState(false);
    const [isFollowing,setFollowing] = useState(false);
    const [data,setData] = useState(null);
    const [bookmarkPressed, setBookmarkPressed] =  useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user'));




    useEffect(()=>{
    console.log(getBlogID())
      instance.get('/singleBlog/getBlog',{ params:{
        blogID: getBlogID()
      }}).then((res)=>{
        console.log(res.data)
        setData({
          editorState:JSON.parse(res.data.blogContent),
          title: res.data.blogTitle,
          date: res.data.date,
          views: res.data.views,
          author: res.data.userName,
          authorID: res.data.user,
          likes: res.data.likes,
          coverImageURL: res.data.coverImage,
          blogID:res.data.blogID

        })

        const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        if(bookmarks)
          setBookmarkPressed( bookmarks.includes(res.data.blogID))

        const followingList = JSON.parse(localStorage.getItem('following'));
        if (followingList)
          setFollowing(followingList.includes(res.data.user))

        
        
      })
    },[])

    const getBlogID=()=>{
      const st = props.match.params.blogTitle.replaceAll("-", " ");
      return st.substr(st.lastIndexOf(" ") + 1)
    }

 




    
  if (props.match.params.draftID){
    const d = JSON.parse(localStorage.getItem(props.match.params.draftID));
    setData(d)
    console.log(localStorage.getItem('blog'))
  }

    let html='';

  data && data.editorState.blocks.forEach((obj,index)=>{
    
      let localhtml =  obj.text;
      let increaseLength = 0; 
      let stylesObject=[];
      
      console.log("length: "+localhtml.length)

      if(obj.entityRanges.length!==0){
        obj.entityRanges.forEach((entity)=>{
           const key = entity.key;
           console.log(key)
           const entityMap = data.entityMap[key];

           if(entityMap['type']==="LINK"){
             localhtml = `<a class=" underline text-gr"  target="${entityMap['data']['targetOption']}" href="${entityMap['data']['url']}" >${localhtml}</a>`
           }

        })
      }

      if(obj.text.length===0){
        localhtml = `<div class="pt-4 "></div>`
      }


      if(obj.inlineStyleRanges.length!==0){
        obj.inlineStyleRanges.forEach(style=>{

          console.log(increaseLength)
       
          const styleType = style.style==='BOLD'?'strong':style.style==='UNDERLINE'?'ins':
          style.style==='ITALIC'?'i':style.style==='STRIKETHROUGH'?'del':'';

         const styleProperties = style.style.match(/fontsize-/)?getFontSize[style.style]:style.style.match(/color-#/)?getColor[style.style]:
            style.style === 'fontfamily-Times New Roman' ? 'font-timeNewRoman' : style.style.match(/fontfamily-/) ? `font${style.style.substring(10,  style.style.length)}`:''

          //  style.style === 'fontfamily-Times New Roman' ? 'font-timeNewRoman' : style.style.match(/fontfamily-charter/) ?'font-Georgia':
          //    style.style.match(/fontfamily-/) ? `font${style.style.substring(10, style.style.indexOf(",") == -1 ? style.style.length: style.style.indexOf(",") == -1)}`:''

        

          if(styleType!==''){
            let flag = false;
           
             stylesObject = stylesObject.map(obj=>{
                    if(obj.offset===style.offset && obj.len===style.length){
                       flag = true;
                       obj.styleOpenTag += `<${styleType}>`
                       obj.styleClosingTag += `</${styleType}>`
                    }

                    return {...obj};
              })

            if(stylesObject.length===0 || !flag)
                stylesObject.push({offset:style.offset,len:style.length,styleOpenTag:`<${styleType}>`,styleClosingTag:`</${styleType}>`})
            
            }


            if(styleProperties!==''){
              let flag = false;
             
               stylesObject = stylesObject.map(obj=>{
                      if(obj.offset===style.offset && obj.len===style.length){
                         flag = true;
                         obj.styleOpenTag += `<span class='${styleProperties}'>`
                         obj.styleClosingTag += `</span>`
                      }
  
                      return {...obj};
                })
  
              if(stylesObject.length===0 || !flag)
                  stylesObject.push({offset:style.offset,len:style.length,styleOpenTag:`<span class='${styleProperties}'>`,styleClosingTag:`</span>`})
              
              }

          
        
        

          // const os = style.offset + increaseLength;
         
          // const len = style.length + os;
         
          // let  newText ='';
          // if(styleType!==''){
          //   console.log(os,len)
          //   newText = localhtml.substring(0,os)+`<${styleType}>`+localhtml.substring(os,len)+`</${styleType}>`+localhtml.substring(len,localhtml.length);
          //   increaseLength += newText.length>0&&newText.charAt(newText.length-1) ==='>'? styleType.length+2 : styleType.length *2 + 5; 

          // }
          // if(styleProperties!==''){
          //   console.log(os,len)
          //   newText = localhtml.substring(0,os)+`<span class='${styleProperties}'>`+localhtml.substring(os,len)+`</span>`+localhtml.substring(len,localhtml.length);
          //  //increaseLength +=  styleProperties.length+22; 
          //  increaseLength += newText.length>0&&newText.charAt(newText.length-1) ==='>'? styleProperties.length+15 : styleProperties.length +22

          // }
          // console.log(newText)
          // if(newText.length!==0)
          //  localhtml = newText
         
         // increaseLength += newText.length>0&&newText.charAt(newText.length-1) ==='>'? styleType.length+2 : styleType.length *2 + 5; 

        })

          
      }
     console.log(stylesObject)

     if(stylesObject.length!==0){
         let  newText ='';
         let increaseLength = 0; 
         stylesObject.forEach(obj=>{
          const os = obj.offset + increaseLength;         
           const len = obj.len + os;
           console.log(os,len)
          console.log("testing: "+localhtml.substring(0,os) + obj.styleOpenTag + localhtml.substring(os,len)+obj.styleClosingTag +localhtml.substring(len,localhtml.length))
           localhtml = localhtml.substring(0,os) + obj.styleOpenTag + localhtml.substring(os,len)+obj.styleClosingTag +localhtml.substring(len,localhtml.length);
          increaseLength += obj.styleOpenTag.length + obj.styleClosingTag.length;

         })
        
        // localhtml = newText;
     }


      console.log(localhtml)

      
      if(obj.data['text-align']){
       localhtml = `<p class='text-${obj.data['text-align']}'>${localhtml}</p>`
      }
    
      if(obj.type==='header-one')
      localhtml = `<h1 class="mb-8 text-4xl font-bold">${localhtml}</h1>\n`;
      else if(obj.type==='header-two')
      localhtml = `<h2 class="mb-8 text-2xl font-bold">${localhtml}</h2>\n`;
      else if(obj.type==='header-three')
      localhtml = `<h3 class="mb-8 text-xl font-bold">${localhtml}</h3>\n`;
      else if(obj.type.match(/header-/))
      localhtml = `<h4 class="mb-8 text-lg font-bold">${localhtml}</h4>\n`;
      else if(obj.type==='unordered-list-item'){
       if(  index===0 || data.editorState.blocks[index-1].type!=='unordered-list-item'   ){
        localhtml = `<ul class="list-disc pl-6  pb-3">\n<li>${localhtml}</li>` 
      }else
        localhtml =`<li>${localhtml}</li>` 
       }
      else if(obj.type==='ordered-list-item'){

        if(  index===0 || data.editorState.blocks[index-1].type!=='ordered-list-item'   ){
          localhtml = `<ol class="list-decimal pl-6  pb-3">\n<li>${localhtml}</li>` 
       }else
          localhtml =`<li>${localhtml}</li>` 
      }
      else if(obj.type==='code'){
        localhtml = `<div class="p-2 font-mono bg-gray-100 text-lg font-normal inline-block">${localhtml}</div>`
      }


      if(obj.type==='ordered-list-item' && index=== data.editorState.blocks.length-1 
      || 
      data.editorState.blocks[index+1]&&data.editorState.blocks[index+1].type!=='ordered-list-item'&& obj.type==='ordered-list-item' 
      ){
       localhtml +='</ol>\n'
    }    
    
    if(obj.type==='unordered-list-item' && index=== data.editorState.blocks.length-1 
    || 
    data.editorState.blocks[index+1]&&data.editorState.blocks[index+1].type!=='unordered-list-item'&& obj.type==='unordered-list-item' 
    ){
     localhtml +='</ul>\n'
  } 

      html += '<p class="pt-5">'+ localhtml + '</p>\n';
      

    })

    console.log('html: '+html)
   // console.log(draftToMarkdown(data))
    function createMarkup() {
        return {__html: html}
      }

      const pressLikeButton = ()=>{
        instance.put('/blog/update-like-counter',{
          blogID: getBlogID()
        })

        setLikePressed(!likePressed?true:false);

      } 

      const pressBookmarkButton = (blogID) =>{
        setBookmarkPressed(!bookmarkPressed?true:false);
        let favList=[]
        favList = JSON.parse(localStorage.getItem('bookmarks'));
        if(!bookmarkPressed)
          localStorage.setItem('bookmarks',JSON.stringify(!favList?[blogID]:[...favList,blogID]))
        else
         {
          favList = favList.filter((value)=>  value!=blogID)
          localStorage.setItem('bookmarks', JSON.stringify(favList))
         }
      }   
      
      const pressFollowButton = (user) =>{
        setFollowing(!isFollowing?true:false);
        let folList = []
        folList = JSON.parse(localStorage.getItem('following'));
        if (!isFollowing)
          localStorage.setItem('following', JSON.stringify(!folList ? [user] : [...folList, user]))
        else {
          folList = folList.filter((value) => value != user)
          localStorage.setItem('following', JSON.stringify(folList))
        }
    }   

  if (!data)
     return <div>loading...</div>
     
    return <div className="pt-10  flex flex-col justify-center items-center  ">
      <div className="w-1/2">
        <div className="font-Cambria mb-8 text-5xl font-bold">{data.title}</div>
        <div className="flex ml-2">
            <img alt="user_avatar" src={userPic} className="w-12 rounded-full "/>
            <div className="ml-2">
             <div className="flex items-center">
               <div className="font-semibold font-Arial text-base">{data.author}</div>
              <button onClick={() => { pressFollowButton(data.authorID)}}className="ml-4 rounded-xl px-3 py-px text-white  bg-green-600 hover:bg-green-700" >{isFollowing?'Following':'Follow'}</button>
              </div>
               <div className=" text-base text-gray-400 font-normal">Posted on <span>{data.date}</span>
               <span className="ml-1 mr-1 text-sm">&#46;</span>4 min Read </div>
            </div>
            <div className="flex ml-auto mr-10 space-x-4">
               <div className="flex items-center">
                 <button><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                 </svg></button>
                 <div className="ml-0.5 text-gray-400 text-sm">{data.views}</div>
               </div>
               <div className="flex items-center">
                <button className="" onClick={() => pressLikeButton()}>{ !likePressed?
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                   </svg>:
                   <svg  xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                   <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                   </svg>}
                 </button>
                 <div className="ml-0.5 text-gray-400 text-sm">{data.likes}</div>
               </div>  
               <button onClick={()=>pressBookmarkButton(data.blogID)}>{ !bookmarkPressed?
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                 </svg>:
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                 </svg>
                 }
               </button>
            </div>
        </div>
        <div className="flex justify-center">
          <img className="h-80 w-full mt-10" src={data.coverImageURL}/>
        </div>
        <div className="mt-5 mb-10" dangerouslySetInnerHTML={createMarkup()} />
      </div>
     
    </div>
   
}

export default ShowEditorContent;