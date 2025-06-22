import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiDroplet, FiHome, FiInfo, FiClock } from 'react-icons/fi';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import waterAnimation from './water-animation.mp4';

const Usage = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(12 * 365 * 24 * 60 * 60); // 12 years in seconds

  const waterData = {
    personalUsage: 85,
    averageUsage: 100,
    earthWater: {
      fresh: 2.5,
      available: 0.3,
    },
    depletionTime: 12,
    usageBreakdown: [
      { name: 'Shower', value: 25 },
      { name: 'Toilet', value: 20 },
      { name: 'Laundry', value: 15 },
      { name: 'Dishes', value: 10 },
      { name: 'Outdoor', value: 30 }
    ],
    futureProblems: [
      { year: '2025', problem: '40% of cities face water shortages' },
      { year: '2030', problem: 'Global water demand exceeds supply by 40%' },
      { year: '2040', problem: '1 in 4 children will live in water-scarce areas' },
      { year: '2050', problem: '5.7 billion people face water scarcity' }
    ],
    conservationImpact: [
      { measure: 'Low-flow showerhead', savings: 20 },
      { measure: 'Dual-flush toilet', savings: 30 },
      { measure: 'Efficient dishwasher', savings: 15 },
      { measure: 'Rainwater harvesting', savings: 35 }
    ]
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const years = Math.floor(seconds / (365 * 24 * 60 * 60));
    const days = Math.floor((seconds % (365 * 24 * 60 * 60)) / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const mins = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    return `${years}y ${days}d ${hours}h ${mins}m ${secs}s`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.waterAnimation}>
        <video autoPlay loop muted style={styles.video}>
          <source src={waterAnimation} type="video/mp4" />
        </video>
      </div>

      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <FiDroplet size={32} />
            <h1 style={styles.title}>AquaGuard</h1>
          </div>
          <p style={styles.subtitle}>Water Usage Statistics</p>
        </div>
      </div>

      <div style={styles.navTabs}>
        <button style={styles.tabButton} onClick={() => navigate('/chat')}>
          <FiHome style={styles.icon} /> Chat
        </button>
        <button style={{ ...styles.tabButton, ...styles.activeTab }}>
          <FiInfo style={styles.icon} /> Usage
        </button>
        <button style={styles.tabButton} onClick={() => navigate('/tips')}>
          <FiClock style={styles.icon} /> Tips
        </button>
      </div>

      <div style={styles.content}>
        <button style={styles.backButton} onClick={() => navigate('/chat')}>
          <FiArrowLeft size={18} /> Back to Chat
        </button>

        <div style={styles.grid}>
          {/* Personal Usage Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Your Water Consumption</h2>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: 'You', value: waterData.personalUsage },
                    { name: 'Average', value: waterData.averageUsage }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Gallons per day', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Water Usage">
                    <Cell fill="#0077b6" />
                    <Cell fill="#00b4d8" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p style={styles.tipText}>
              {waterData.personalUsage < waterData.averageUsage
                ? "🌱 Great job! You're using less than average."
                : "💧 Try reducing your usage by taking shorter showers and fixing leaks."}
            </p>
          </div>

          {/* Water Breakdown Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Your Water Usage Breakdown</h2>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={waterData.usageBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {waterData.usageBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Earth's Water Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Earth's Water Status</h2>
            <div style={styles.waterStats}>
              <div style={styles.statItem}>
                <div style={styles.statValue}>{waterData.earthWater.fresh}%</div>
                <div style={styles.statLabel}>Fresh Water</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statValue}>{waterData.earthWater.available}%</div>
                <div style={styles.statLabel}>Accessible Fresh Water</div>
              </div>
            </div>
            <div style={styles.depletionWarning}>
              <h3 style={styles.warningTitle}>⏳ Water Depletion Countdown</h3>
              <div style={styles.timer}>{formatTime(timeLeft)}</div>
              <p style={styles.warningText}>
                At current consumption rates, severe water shortages could occur in approximately {waterData.depletionTime} years.
              </p>
            </div>
          </div>

          {/* Future Problems Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Future Water Problems</h2>
            <div style={styles.problemsList}>
              {waterData.futureProblems.map((item, index) => (
                <div key={index} style={styles.problemItem}>
                  <div style={styles.problemYear}>{item.year}</div>
                  <div style={styles.problemText}>{item.problem}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Conservation Impact Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Conservation Impact</h2>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={waterData.conservationImpact}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <XAxis dataKey="measure" />
                  <YAxis label={{ value: 'Water Savings (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="savings" name="Water Savings">
                    {waterData.conservationImpact.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// STYLES OBJECT (unchanged from your original)
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  waterAnimation: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    opacity: 0.3,
    filter: 'blur(1px) contrast(1.2)',
    pointerEvents: 'none',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  header: {
    textAlign: 'center',
    padding: '20px',
    background: 'linear-gradient(to right, #0077b6, #00b4d8)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    position: 'relative',
    zIndex: 1,
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  title: {
    fontSize: '2.5rem',
    margin: '0',
    fontWeight: '600',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  subtitle: {
    fontSize: '1.2rem',
    margin: '0',
    opacity: '0.9',
  },
  navTabs: {
    display: 'flex',
    justifyContent: 'center',
    background: 'linear-gradient(to right, #0077b6, #00b4d8)',
    padding: '10px 0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'relative',
    zIndex: 1,
  },
  tabButton: {
    padding: '12px 24px',
    margin: '0 10px',
    border: 'none',
    background: 'transparent',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '30px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  activeTab: {
    background: 'rgba(255,255,255,0.2)',
    fontWeight: '600',
  },
  icon: {
    marginRight: '5px',
  },
  content: {
    flex: 1,
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '20px',
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 1,
    overflowY: 'auto',
  },
  backButton: {
    padding: '10px 15px',
    background: 'transparent',
    border: '1px solid #0077b6',
    color: '#0077b6',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px',
    paddingBottom: '20px',
  },
  card: {
    background: 'rgba(255,255,255,0.9)',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    color: '#0077b6',
    marginTop: '0',
    marginBottom: '20px',
    fontSize: '1.4rem',
    fontWeight: '600',
  },
  chartContainer: {
    flex: 1,
    minHeight: '300px',
  },
  tipText: {
    background: '#e8f5e9',
    padding: '12px',
    borderRadius: '8px',
    color: '#2e7d32',
    fontSize: '0.9rem',
    marginTop: '20px',
    textAlign: 'center',
  },
  waterStats: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
  },
  statItem: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#00838f',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#546e7a',
  },
  depletionWarning: {
    background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
    padding: '15px',
    borderRadius: '8px',
    marginTop: 'auto',
  },
  warningTitle: {
    color: '#e65100',
    marginTop: '0',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  timer: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '10px 0',
    color: '#d84315',
  },
  warningText: {
    color: '#5d4037',
    fontSize: '0.9rem',
  },
  problemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  problemItem: {
    display: 'flex',
    gap: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #e0e0e0',
  },
  problemYear: {
    fontWeight: 'bold',
    color: '#0077b6',
    minWidth: '60px',
  },
  problemText: {
    color: '#455a64',
  },
};

export default Usage;
