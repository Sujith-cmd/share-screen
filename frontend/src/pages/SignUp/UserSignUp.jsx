import React, { useRef, useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux'
import "./styles.scss"
import { fetchDataFromBackPost } from '../../utils/api.js'
import { setCurrentUser } from '../../store/homeSlice'


const UserSignup = () => {
  const usernameContent=useRef()
  const emailContent=useRef()
  const passwordContent=useRef()
  const isTheatreContent=useRef()
  const [formData, setFormData] = useState({})
  const { currentUser }=useSelector((state)=> state.home)
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const handleChange = (e) => {
    console.log(formData);
    if(e.target.name=="isTheatre"){
      if(e.target.value=="true"){

        setFormData({...formData,[e.target.name]:true})
      }else{
        setFormData({...formData,[e.target.name]:false})

      }
    }else{

      setFormData({...formData,[e.target.name]:String(e.target.value)})
    }
    
  }
  const handleSubmit = async (e) =>{
    e.preventDefault();
    // setFormData({
    //   username: usernameContent.current.value,
    //   email: emailContent.current.value,
    //   password: passwordContent.current.value,
    //   isTheatre:isTheatreContent.current.value
    // });
    //  console.log(formData);
    try {
    //   dispatch(signInStart())
      const res= await fetch('http://localhost:5000/api/users/signup',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(formData)
      })
          let data=await res.json();
          console.log(data);
         
          navigate('/userSignin')

      // fetchDataFromBackPost('http://localhost:5000/api/vendors/signup', 
      //   formData
      // )
      // .then(response=> {
      //  console.log("response");
      //  console.log(response);
      //  //    dispatch(signInSuccess(response.data.rest))
       
       
      // }).catch(error=>{
      //   console.log("error");
      //   console.log(error);
      //   // dispatch(signInFailure(error))
        
      //   return
      // });
      
      
      
    } catch (error) {
    //   dispatch(signInFailure(error))
    console.log("Catch error");
    console.log(error);
      
    }
   
  };
    
  
  return (
     <div className="homePage">      
              <form className='form' onSubmit={handleSubmit} >
                 <h1 className='form-heading'>User Sign Up</h1>
                 <div className='form-content'>

                     <input ref={usernameContent} className='form-input' type="text" placeholder='Enter username' name='username' onChange={handleChange}/>
                     <input ref={emailContent} className='form-input' type="email" placeholder='Enter email' name='email' onChange={handleChange}/>
                     <input ref={passwordContent} type="password" className='form-input' placeholder='Enter password' name='password'onChange={handleChange}/>
                     <input type="password" className='form-input' placeholder='Enter password' name='password2' />
                    
                     <button className='form-butto' >SignUp</button>
                  </div>
                
              </form>
              <div className='bottom-links'>
                  <p className='bottom-link-p'>Already have an account?</p>
                  <Link to="/userSignin"> <span className='bottom-link-signup'>SignIn</span></Link>
              </div>
           
      </div>
  )
}
export default UserSignup