import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as loginApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import logo from '../Images/logo.png';
import { TbPassword } from "react-icons/tb";
import { CiMail } from "react-icons/ci";
import { BiError } from "react-icons/bi";
import { TbLockPassword } from "react-icons/tb";
import { FaRegEye } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false })
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    setErrors(er => ({ ...er, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setAlert(null)
    try {
      const res = await loginApi({
        email: form.email,
        password: form.password,
        rememberMe: form.rememberMe
      })
      login(res.data, form.rememberMe)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.'
      setAlert({ type: 'error', msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      {/* Brand Panel */}
      <div className="auth-brand">
        <div className="brand-logo"><img src={logo} alt="Logo" /></div>
        <h1 className="brand-title">Welcome</h1>
        <p className="brand-subtitle">
          Sign in to access your dashboard and continue where you left off.
        </p>
        <div className="brand-dots">
          <div className="brand-dot" />
          <div className="brand-dot active" />
          <div className="brand-dot" />
        </div>
      </div>

      {/* Form Panel */}
      <div className="auth-panel">
        <div className="auth-card fade-in">
          <h2>Sign In</h2>
          <p className="subtitle">Enter your credentials to access your account</p>

          {alert && (
            <div className={`alert alert-${alert.type}`}>
              ⚠ {alert.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon"><CiMail /></span>
                <input
                  type="email" name="email"
                  placeholder="Enter your email"
                  value={form.email} onChange={handleChange}
                  className={errors.email ? 'error-input' : ''}
                  autoComplete="email"
                />
              </div>
              {errors.email && <div className="error-msg"><BiError /> {errors.email}</div>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><TbLockPassword /></span>
                <input
                  type={showPw ? 'text' : 'password'} name="password"
                  placeholder="Enter your password"
                  value={form.password} onChange={handleChange}
                  className={errors.password ? 'error-input' : ''}
                  autoComplete="current-password"
                />
                <button
                  type="button" className="toggle-pw"
                  onClick={() => setShowPw(v => !v)}
                  aria-label="Toggle password visibility"
                >
                 {showPw ? <TbPassword /> : <FaRegEye />}
                </button>
              </div>
              {errors.password && <div className="error-msg"><BiError /> {errors.password}</div>}
            </div>

            {/* Remember Me */}
            <div className="checkbox-row">
              <input
                type="checkbox" id="rememberMe" name="rememberMe"
                checked={form.rememberMe} onChange={handleChange}
              />
              <label htmlFor="rememberMe">Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              className={`btn-primary${loading ? ' loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="auth-link-row">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
