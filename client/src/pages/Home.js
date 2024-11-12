// Home.jsx

import { useContext, useEffect } from 'react'
import NavBar from '../components/NavBar'
import { Context } from '../context/Context'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const nav = useNavigate()
    const { sendEmergencyAlert, socket } = useContext(Context)

    return (
        <>
            <div className='home-bg'>
                    <div className='home-title '>CodeCopter</div>
                <div className="">
                    <button onClick={()=>nav('/emergency')}className='emergency-button'>Emergency</button>
                </div>
            </div>
        </>
    )
}

export default Home
