import React, { useState ,useEffect,com} from 'react';

import draftToMarkdown from 'draftjs-to-markdown';
import history from '../history';
import { instance } from '../apis/axios_instance';
import axios from 'axios';


const BlogList = ({ bookmarkList, user }) => {
    console.log(bookmarkList,user)
    const [blogList,setBlogList] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('user'));


     useEffect(()=>{
           if (user === undefined && bookmarkList === undefined) {
               console.log('1')
               instance.get('/blog/getAllBlogs', { params: {user: currentUser.email }}).then((res) => {
        console.log(res.data)
        setBlogList(res.data)
    })}
           else if (user != 'undefined' && bookmarkList === undefined){
               console.log('2')
               instance.get('/blog/getUserBlogs', { params: { user } }).then((res) => {
              console.log(res.data)
              setBlogList(res.data)
          })
      }
           else if ( bookmarkList && bookmarkList.length !=0 ){
               console.log('3')
               instance.get('/blog/getAllBlogs', { params: { blogList: bookmarkList } }).then((res) => {
              console.log(res.data)
              setBlogList(res.data)
          })
           } else setBlogList([])
          
       
     }, [bookmarkList,user])


    const removeBlog = (blogID) => {
        console.log(blogID)
         const newBlogList = blogList.filter((item) => { if (blogID !== item.blogID) return {...item}; })
         instance.put('/blog/removeBlog',{blogID,user:currentUser.email}).then(res=>{
               if(res.status=200){
                   setBlogList(newBlogList)
               }
         })
         
    }
 
    return <div className="flex py-5 justify-center">
       <div className="flex flex-col  w-7/12 bg-gray-50 ">
        {
            blogList.map((item)=>{
                console.log(item.user !== currentUser.email ? 'hidden' : '')
                return <div className="flex h-62 py-5 justify-center flex-col  cursor-pointer border-b-2">
                <div onClick={() => history.push( `/${item.userName}/${item.blogTitle.replaceAll(" ", "-")}-${item.blogID}`)}
                      key={item.blogID} className=" ">
                    <div className="flex items-center">
                       <div className="font-semibold text-base">{item.userName}</div>
                        <div className=" text-sm ml-1  text-gray-400 font-normal">&#46; {item.date}</div>
                    </div>
                    <div className="flex mt-2 justify-between ">
                        <div className="w-4/6 ">
                         <div className="text-2xl font-bold font-Arial">{item.blogTitle}</div>
                            <div className="font-Cambria h-28 text-lg overflow-clip overflow-hidden ...">
                             {
                                draftToMarkdown(JSON.parse(item.blogContent))
                             }
                          </div>
                        </div>
                        <div className="">
                              <img className="w-40 h-32" src={item.coverImage}/>
                        </div>
                    </div>
                    </div>
                    <div className={`flex items-center ${item.user !== currentUser.email ? 'hidden' : ''}`  }>
                        <button onClick={()=> history.push(`/editor/edit/${item.blogID}`)} className="mr-3">
                            <div className="flex border-2 px-1.5 rounded-sm py-0.5 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                <div>Edit</div>
                            </div>
                        </button>
                        <button className="z-10" onClick={() => removeBlog(item.blogID)}>
                            <div className="flex bg-red-500 text-white px-1.5 rounded-sm py-0.5 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <div>Remove</div>
                            </div>
                        </button>
                       
                    </div>
                 
                </div>
            })
        }

      </div>
    </div>
}

export default BlogList;
