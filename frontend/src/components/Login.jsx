import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import SoftBackdrop from './SoftBackdrop'

const Login = () => {
  const [state, setState] = useState("login")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrorMsg('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      let endpoint, body
      if (state === "login") {
        endpoint = '/api/users/login'
        body = {
          email: formData.email,
          password: formData.password
        }
      } else {
        endpoint = '/api/users/register'
        body = {
          name: formData.name,
          email: formData.email,
          password: formData.password
        }
      }

      const response = await axios.post(`http://localhost:5000${endpoint}`, body)

      // Store token
      localStorage.setItem("token", response.data.token)
      
      // Success message
      setSuccessMsg(response.data.message || (state === "login" ? "Logged in successfully!" : "Account created! Please login."))
      
      // Auto switch to login after signup success
      if (state === "register") {
        setTimeout(() => {
          setState("login");
        }, 1500)
      } else {
        // Login → home
        setTimeout(() => {
          navigate('/')
        }, 1500)
      }

    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SoftBackdrop/>
      <div className='min-h-screen flex items-center justify-center'>
        <form onSubmit={handleSubmit} className="w-full sm:w-[380px] text-center 
          bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/70 
          backdrop-blur-xl 
          border border-cyan-500/20 
          rounded-2xl px-8 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
          
          <h1 className="text-3xl mt-10 font-semibold bg-gradient-to-r from-cyan-400 to-cyan-400 bg-clip-text text-transparent">
            {state === "login" ? "Login" : "Sign up"}
          </h1>

          <p className="text-gray-400/80 text-sm mt-2">Please sign in to continue</p>

          {/* Success/Error Messages */}
          {successMsg && (
            <div className="mt-4 p-3 rounded-lg bg-green/20 border border-green/30 text-green-100 text-sm">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mt-4 p-3 rounded-lg bg-red/20 border border-red/30 text-red-100 text-sm">
              {errorMsg}
            </div>
          )}

          {state !== "login" && (
            <div className="flex items-center mt-6 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-cyan-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> 
                <circle cx="12" cy="8" r="5" /> 
                <path d="M20 21a8 8 0 0 0-16 0" /> 
              </svg>
              <input 
                type="text" 
                name="name" 
                placeholder="Name" 
                className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none " 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
          )}

          <div className="flex items-center w-full mt-4 bg-white/5 ring-2 ring-white/10 focus-within:ring-cyan-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> 
              <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /> 
              <rect x="2" y="4" width="20" height="16" rx="2" /> 
            </svg>
            <input 
              type="email" 
              name="email" 
              placeholder="Email id" 
              className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none " 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className=" flex items-center mt-4 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-cyan-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> 
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /> 
              <path d="M7 11V7a5 5 0 0 1 10 0v4" /> 
            </svg>
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full h-11 rounded-full text-white bg-cyan-600 hover:bg-cyan-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (state === "login" ? "Login" : "Sign up")}
          </button>

          <p 
            onClick={() => setState(prev => prev === "login" ? "register" : "login")} 
            className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer" 
          >
            {state === "login" ? "Don't have an account?" : "Already have an account?"}
            <span className="text-cyan-400 hover:underline ml-1">click here</span>
          </p>
        </form>
      </div> 
    </>
  )
}

export default Login

