import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { profile } from '../services/api'
import { GiHemp } from "react-icons/gi";
import { VscAccount } from "react-icons/vsc";
import { FaKey } from "react-icons/fa";
import { BsCalendarEvent } from "react-icons/bs";
import logo from '../Images/logo.png';

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    profile()
      .then(res => setProfileData(res.data))
      .catch(() => {/* profile call failed, still show basic info */})
      .finally(() => setLoadingProfile(false))
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const data = profileData || user

  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  return (
    <div className="dashboard-layout">
      {/* Top Bar */}
      <header className="topbar">
        <div className="topbar-logo">
          <div className="logo-icon"><img src={logo} alt="Logo" /></div>
          <span className="logo-text"></span>
        </div>
        <div className="topbar-user">
          <div className="user-badge">
            <div className="user-avatar">{initials}</div>
            <div>
              <strong>{user?.name}</strong>
              <span style={{ display: 'block', fontSize: '0.75rem' }}>{user?.email}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            ↩ Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main fade-in">
        {/* Welcome */}
        <section className="welcome-section">
          <div className="greeting">Dashboard</div>
          <h1>Welcome , {user?.name?.split(' ')[0]} <GiHemp /></h1>
          <p>You're securely logged in. Here's your account overview.</p>
        </section>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)' }}><VscAccount /></div>
            <div className="stat-label">Account Status</div>
            <div className="stat-value" style={{ color: 'var(--success)', fontSize: '1.1rem' }}>
              ● Active
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)' }}><FaKey /></div>
            <div className="stat-label">Role</div>
            <div className="stat-value" style={{ fontSize: '1.1rem' }}>
              <span className="role-badge">{data?.role || 'User'}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(251,191,36,0.15)' }}><BsCalendarEvent /></div>
            <div className="stat-label">Member Since</div>
            <div className="stat-value" style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
              {loadingProfile ? '…' : formatDate(profileData?.createdAt)}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-card">
          <h3>Profile Information</h3>
          {[
            { key: 'User ID', val: profileData?.id ? `#${profileData.id}` : '—' },
            { key: 'Full Name', val: data?.name || '—' },
            { key: 'Email Address', val: data?.email || '—' },
            { key: 'Role', val: data?.role || 'User' },
            { key: 'Joined', val: formatDate(profileData?.createdAt) },
            { key: 'IP Address', val: profileData?.ipAddress || user?.ip || '—' }
          ].map(({ key, val }) => (
            <div className="profile-row" key={key}>
              <span className="key">{key}</span>
              <span className="val">
                {key === 'Role'
                  ? <span className="role-badge">{val}</span>
                  : loadingProfile && key !== 'Full Name' && key !== 'Email Address'
                    ? <span style={{ color: 'var(--text-muted)' }}>Loading…</span>
                    : val
                }
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
