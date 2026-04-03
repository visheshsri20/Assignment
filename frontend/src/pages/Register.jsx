import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/api'
import logo from '../Images/logo.png';
import { TbPassword } from "react-icons/tb";
import { TbLockPassword } from "react-icons/tb";
import { BiError } from "react-icons/bi";
import { CiMail } from "react-icons/ci";
import { VscAccount } from "react-icons/vsc";
import { FaRegEye } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (!form.confirm) e.confirm = 'Please confirm your password'
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setAlert(null)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      setAlert({ type: 'success', msg: 'Account created! Redirecting to login…' })
      setTimeout(() => navigate('/login'), 1800)
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.'
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
        <h1 className="brand-title">Register</h1>
        <p className="brand-subtitle">
          Create a new account
        </p>
        <div className="brand-dots">
          <div className="brand-dot active" />
          <div className="brand-dot" />
          <div className="brand-dot" />
        </div>
      </div>

      {/* Form Panel */}
      <div className="auth-panel">
        <div className="auth-card fade-in">
          <h2>Create Account</h2>
          <p className="subtitle">Fill in your details to get started</p>

          {alert && (
            <div className={`alert alert-${alert.type}`}>
              {alert.type === 'error' ? '⚠' : '✓'} {alert.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon"><VscAccount /></span>
                <input
                  type="text" name="name"
                  placeholder="Enter your full name"
                  value={form.name} onChange={handleChange}
                  className={errors.name ? 'error-input' : ''}
                />
              </div>
              {errors.name && <div className="error-msg"><BiError /> {errors.name}</div>}
            </div>

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
                  placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange}
                  className={errors.password ? 'error-input' : ''}
                />
                <button type="button" className="toggle-pw" onClick={() => setShowPw(v => !v)}
                  aria-label="Toggle password visibility">
                  {showPw ? <TbPassword /> : <FaRegEye />}
                </button>
              </div>
              {errors.password && <div className="error-msg"><BiError /> {errors.password}</div>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><TbLockPassword /></span>
                <input
                  type={showConfirm ? 'text' : 'password'} name="confirm"
                  placeholder="Repeat your password"
                  value={form.confirm} onChange={handleChange}
                  className={errors.confirm ? 'error-input' : ''}
                />
                <button type="button" className="toggle-pw" onClick={() => setShowConfirm(v => !v)}
                  aria-label="Toggle confirm password visibility">
                  {showConfirm ?<TbPassword />  : <FaRegEye />}
                </button>
              </div>
              {errors.confirm && <div className="error-msg"><BiError /> {errors.confirm}</div>}
            </div>

            <button
              type="submit"
              className={`btn-primary${loading ? ' loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <div className="auth-link-row">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
