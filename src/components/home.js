import react,{useEffect,useState} from 'react';
import { Redirect } from "react-router-dom";
import { instance } from '../apis/axios_instance';
import userPic from './img/pic.jpg';
import SavedDraft from './savedDrafts';
import EditorUi from './EditorUi';
import BLogList from './blogList';
import history from '../history';





const Home = ()=>{
const [user,setUser] = useState(null);
const [ selectedMenu, setSelectedMenu]  = useState('home');
const [redirect,setredirect] = useState(null);

const currentUser = JSON.parse(localStorage.getItem('user'));

   const getMenuComponent = ()=>{
        switch (selectedMenu) {
             case 'savedDrafts':
                  return <SavedDraft />
                  break;
             case 'home':
                  return <BLogList />
                  break;
             case 'bookmarks':
                  return <BLogList bookmarkList={JSON.parse(localStorage.getItem('bookmarks'))} />
                  break;
             case 'blogPosts':
                  return <BLogList user={currentUser.email} />
                  break;
             default:
                  break;
        }
    }

     const route=()=>{
          instance.get('/api/test')
     }

     const logout=()=>{
          instance.get('/api/logout').then((res)=>{
               setredirect('/signin')

          })
     }

     if (redirect) {
          console.log('redirect2')
    
          return <Redirect to={redirect} />
        }
    
     return <div className="flex flex-col h-screen w-screen bg-gray-50">
          <div className="flex items-center  pl-5 h-16 bg-purple-600 w-full text-white">
               <div> BlogNow</div>
               <div className="ml-auto pr-5 flex items-center">
                    <img alt="user_avatar" src={currentUser.pic} className="w-9 rounded-full " />
                    <div className="font-normal pl-2 text-base">{currentUser.name}</div>
                    <button onClick={() => logout()} className="ml-5 rounded-sm  px-3 py-1 hover:bg-purple-700">Logout</button>
               </div>
          </div>
          <div className="flex h-full overflow-y-auto">
               <div className="w-1/6 h-full pt-5  bg-gray-100  text-base font-semibold">
                    <div onClick={() => setSelectedMenu('home')} className={"mb-3 flex hover:bg-gray-200 cursor-pointer py-2 pl-5 items-center " + (selectedMenu == 'home' ? 'bg-gray-300' : '')}>
                         <svg  xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                         </svg>
                        <div className="ml-2 ">Home</div>
                    </div>
                    <div onClick={() => { setSelectedMenu('newBLogPost'); history.push('/editor/write')}} className={"mb-3 flex hover:bg-gray-200 cursor-pointer py-2 pl-5 items-center " + (selectedMenu == 'newBLogPost' ? 'bg-gray-300' : '')}>
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                              <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                         </svg>
                         <div className="ml-2 ">New Blog Post</div>
                    </div>
                    <div onClick={() => setSelectedMenu('blogPosts')} className={"mb-3 flex hover:bg-gray-200 cursor-pointer py-2 pl-5 items-center " + (selectedMenu == 'blogPosts' ? 'bg-gray-300' : '')}>
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                         </svg>
                         <div className="ml-2">Blog Posts</div>
                    </div>
                    <div onClick={() => setSelectedMenu('savedDrafts')} className={"mb-3 flex hover:bg-gray-200 cursor-pointer py-2 pl-5 items-center " + ( selectedMenu == 'savedDrafts'?' bg-gray-300':'')}>
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                         </svg>
                        <div className="ml-2">Saved Drafts</div>
                    </div>
                    <div onClick={() => setSelectedMenu('bookmarks')} className={"mb-3 flex hover:bg-gray-200 cursor-pointer py-2 pl-5 items-center " + (selectedMenu == 'bookmarks' ? 'bg-gray-300' : '')}>
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                         </svg>
                         <div className="ml-2">Bookmarks</div>
                    </div>
                    <div onClick={() => setSelectedMenu('statistics')} className={"mb-3 flex hover:bg-gray-200 cursor-pointer py-2 pl-5 items-center " + (selectedMenu == 'statistics' ? 'bg-gray-300' : '')}>
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                         </svg>
                         <div className="ml-2">Statistics</div>
                    </div>
             </div>
               <div className="h-full w-full  overflow-y-auto">
                {  getMenuComponent() }
             </div>
          </div>
          
          
     </div>
}

export default Home