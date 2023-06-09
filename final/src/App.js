import './App.css';
import axios from 'axios';
import "./login.css"
import './search.css';

import { useEffect, useState,} from 'react';

function App() {
  //////////////////ligin line
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [mainError,setMainError] = useState('')
  const [user,setUser] = useState(null)
  const [accesToken,setAccessToken] = useState('')


  const ClickSubmit = async (e) => {
    try {
        e.preventDefault() // prevent make request
        setMainError('')

        if(!email ||!password){
          setMainError('გთხოვთ შეიყვანოთ მონაცემები!')
          return
        }
        const userInfo = [password,email]

        setUser(userInfo)
        
        localStorage.setItem('user',JSON.stringify(userInfo))


    }catch (e){
      setMainError("მომხმარებლის სახელი ან მეილი არსაწორია")
    } 
  }

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'))

    if(u){
      setUser(u)
    }
    

  },[accesToken])
  ////////////////////search line
  const [search,setSearch] = useState('')
  const [searchError,setSearchError] = useState([])
  const [product,setProduct] = useState([])



const [SerachError, setSerachErrorFix] = useState()


  const SearchClick = async (e) =>{
    try{
      e.preventDefault() 
      setSearchError('')
      setSerachErrorFix("")
      


      const response = await axios.post(
        'https://api2.mymarket.ge/api/ka/products',
        {
          Keyword : search,
          Limit : 12
        }
      )


      setProduct(response.data.data.Prs)


      const total = response.data.data.totalCount
     

     if(total === 0){
      setSerachErrorFix("სასურველი პროდუქტი ვერ მოიძებნა;(")
    }
     

      console.log(response.data.data.Prs)
    }catch{
      setSearchError('error')
    }
    
  }
  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setAccessToken(null)
  }
  

  return (
    <>
      {user? 
      <>
       <div className='search'>
        <div className='wrap'><h1 className='MyMarket'>MY MARKET</h1>
        </div>
        <button className='logOut' onClick={() => logout()}>Sign Out</button>
        <div className='searchDiv'>
          <h1 className='SearchError'>{searchError}</h1>
          <form className='formSearch' onSubmit={SearchClick}>
          <input className='searchInput' type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}/>
          <button className='searchBtn' type='submit'>SEARCH</button>
          </form>
        </div>
        
        <h2 className='searchError'>{SerachError}</h2>
        <div className='productSection'>
      {product.map((item) =>{
        return(
          <div className='product'>
            <img className='productImg' src={item.photos[0].thumbs} alt='idk'/>
            <h1 className='productTiTle'>{item.title}</h1>

            <p className='price'>{item.price}₾</p>
            </div>

        )
      })}
        </div>
      </div>
      </>
      :
      <div className='formSection' >
        <div className='box'>
          <h4 className='logIn'>Log in</h4>
          
          <form className='loginfrom' onSubmit={ClickSubmit}>
            <input className='loginInput' type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input className='loginInput' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button className='submit' type="submit" >Log in</button>
            <h2 className='errorLogin'>{mainError}</h2>
          </form>
        
        </div>
      </div>
      
      }
      </>
  );
}

export default App;
