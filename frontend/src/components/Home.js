import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {

  return (
    <div>
      <nav>
        <ul>
            <Link to={'/Login'}><li>Login</li></Link>
            <Link to={'/Signup'}><li>Sign Up</li></Link>
        </ul>
      </nav>
    </div>
  )
}

export default Home
