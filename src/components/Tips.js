import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch, FiArrowLeft, FiDroplet, FiHome, FiClock,
  FiUser, FiChevronDown, FiLogOut
} from 'react-icons/fi';
import waterAnimation from './water-animation.mp4';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Tips = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, current => {
      if (!current) navigate('/login');
      else setUser(current);
    });
    return unsubscribe;
  }, [navigate]);

  // Click-outside to close dropdown
  useEffect(() => {
    const handleClick = e => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // Water-saving tips categories
  const waterTips = [ {
      id: 'bathroom-water',
      title: "🚿 Bathroom Water Tips",
      tips: [
        "Take 5-minute showers (saves 30-50 gallons)",
        "Turn off tap while brushing teeth (saves 8 gal/day)",
        "Install low-flow showerheads (saves 2.5 gal/min)",
        "Fix leaky toilets (can waste 200 gal/day)",
        "Use dual-flush toilets (0.8 gal for liquid/1.6 gal solid)"
      ]
    },
    {
      id: 'bathroom-fixtures',
      title: "🚽 Bathroom Fixtures",
      tips: [
        "Install faucet aerators (saves 1-2 gal/min)",
        "Choose WaterSense labeled fixtures",
        "Install motion-sensor faucets in public restrooms",
        "Use shower timers or smart shower systems",
        "Retrofit older toilets with flush converters"
      ]
    },
    {
      id: 'kitchen-cooking',
      title: "🍳 Kitchen Cooking Tips",
      tips: [
        "Steam vegetables instead of boiling",
        "Reuse pasta water for plants after cooling",
        "Defrost food in fridge overnight",
        "Use pressure cookers for faster cooking",
        "Cook multiple items simultaneously in oven"
      ]
    },
    {
      id: 'kitchen-cleaning',
      title: "🧽 Kitchen Cleaning",
      tips: [
        "Run full dishwasher loads (saves 5-15 gal/load)",
        "Scrape dishes instead of pre-rinsing",
        "Use basin for washing produce",
        "Compost food waste instead of disposal",
        "Use biodegradable soaps for greywater reuse"
      ]
    },
    {
      id: 'laundry-machines',
      title: "🧺 Laundry Machines",
      tips: [
        "Upgrade to HE washer (saves 30%)",
        "Use appropriate load size settings",
        "Clean lint filter after every load",
        "Maintain machines regularly",
        "Front-loaders use less water than top-loaders"
      ]
    },
    {
      id: 'laundry-habits',
      title: "👚 Laundry Habits",
      tips: [
        "Wash full loads (saves 15-45 gal/load)",
        "Use cold water when possible",
        "Reuse towels multiple times",
        "Spot clean instead of full washes",
        "Air dry clothes when possible"
      ]
    },
    {
      id: 'outdoor-gardening',
      title: "🌱 Outdoor Gardening",
      tips: [
        "Use drip irrigation (saves 50%)",
        "Install rain barrels for collection",
        "Plant drought-resistant natives",
        "Use mulch (reduces evaporation 70%)",
        "Group plants by water needs (hydrozoning)"
      ]
    },
    {
      id: 'outdoor-cleaning',
      title: "🧹 Outdoor Cleaning",
      tips: [
        "Sweep driveways instead of hosing",
        "Use bucket for car washing",
        "Use brooms for patio cleaning",
        "Collect pet washing runoff for plants",
        "Use eco-friendly cleaners for outdoor surfaces"
      ]
    },
    {
      id: 'appliances',
      title: "🔌 Water-Efficient Appliances",
      tips: [
        "Choose ENERGY STAR rated appliances",
        "Install instant hot water heaters",
        "Use tankless water heaters",
        "Select water-efficient ice makers",
        "Install water-cooled air conditioners"
      ]
    },
    {
      id: 'community',
      title: "🏘️ Community Water Saving",
      tips: [
        "Support water recycling programs",
        "Participate in conservation rebates",
        "Report public water leaks",
        "Advocate for water-smart landscaping",
        "Join neighborhood conservation challenges"
      ]
    },
    {
      id: 'industrial',
      title: "🏭 Industrial Conservation",
      tips: [
        "Implement closed-loop water systems",
        "Reuse process water where possible",
        "Install water-efficient cooling towers",
        "Conduct regular leak detection surveys",
        "Optimize equipment cleaning cycles"
      ]
    },
    {
      id: 'tech',
      title: "📱 Water-Saving Technology",
      tips: [
        "Install smart water meters",
        "Use soil moisture sensors for irrigation",
        "Try water usage tracking apps",
        "Install automatic shut-off valves",
        "Use AI-powered leak detection systems"
      ]
    } ];

  const filtered = waterTips.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tips.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={styles.container}>
      <div style={styles.waterAnimation}>
        <video autoPlay loop muted style={styles.video}>
          <source src={waterAnimation} type="video/mp4" />
        </video>
      </div>

      {/* Navbar */}
      <div style={styles.navBar}>
        <div style={styles.logoContainer}>
          <FiDroplet size={28} style={styles.logoIcon} />
          <h1 style={styles.logoText}>AquaGuard</h1>
        </div>

        <div style={styles.navTabs}>
          <button style={styles.navTab} onClick={() => navigate('/chat')}>
            <FiHome size={18} /> Chat
          </button>
          <button style={{ ...styles.navTab, ...styles.activeTab }}>
            <FiClock size={18} /> Tips
          </button>
        </div>

        {/* Profile UI */}
        <div style={styles.profileContainer} ref={profileRef}>
          <button
            style={styles.profileButton}
            onClick={() => setShowProfileDropdown(prev => !prev)}
            aria-haspopup="true"
            aria-expanded={showProfileDropdown}
          >
            <FiUser size={20} />
            <span style={styles.profileName}>{user?.displayName || user?.email}</span>
            <FiChevronDown
              size={16}
              style={{
                transform: showProfileDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            />
          </button>

          {showProfileDropdown && (
            <div style={styles.dropdownMenu} role="menu">
              <div style={styles.dropdownHeader}>
                <FiUser size={18} style={styles.dropdownIcon} />
                <span style={styles.dropdownName}>{user?.displayName || user?.email}</span>
              </div>
              <button
                style={styles.dropdownSignOut}
                onClick={handleSignOut}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d62828'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e63946'}
              >
                <FiLogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div style={styles.contentArea}>
        <div style={styles.contentContainer}>
          <div style={styles.searchBox}>
            <FiSearch style={styles.searchIcon} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search water saving tips..."
              style={styles.searchInput}
            />
          </div>

          {!selectedCategory && filtered.map(cat => (
            <div
              key={cat.id}
              style={styles.categoryCard}
              onClick={() => setSelectedCategory(cat)}
            >
              <h3 style={styles.categoryTitle}>{cat.title}</h3>
              <p style={styles.tipCount}>{cat.tips.length} tips available</p>
            </div>
          ))}

          {selectedCategory && (
            <div style={styles.tipsView}>
              <button style={styles.backButton} onClick={() => setSelectedCategory(null)}>
                <FiArrowLeft style={styles.backIcon} /> Back to Categories
              </button>
              <h2 style={styles.selectedCategoryTitle}>{selectedCategory.title}</h2>
              <ul style={styles.tipsList}>
                {selectedCategory.tips.map((tip, idx) => (
                  <li key={idx} style={styles.tipItem}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Full styles matching Chat.js exactly:
const styles = {
  container: { position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI', Roboto, sans-serif", backgroundColor: '#f5f7fa' },
  waterAnimation: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.7, filter: 'blur(1px)' },
  video: { width: '100%', height: '100%', objectFit: 'cover' },
  navBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: '72px', backgroundColor: '#0077b6', boxShadow: '0 2px 15px rgba(0,0,0,0.1)', position: 'relative', zIndex: 10 },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoIcon: { color: '#fff' },
  logoText: { fontSize: '1.5rem', fontWeight: '600', color: '#fff', margin: 0 },
  navTabs: { display: 'flex', gap: '8px', flex: 1, justifyContent: 'center', maxWidth: '500px' },
  navTab: { background: 'transparent', border: 'none', color: '#fff', padding: '12px 24px', fontSize: '0.95rem', borderRadius: '8px', cursor: 'pointer' },
  activeTab: { backgroundColor: '#fff', color: '#000', zIndex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
  profileContainer: { position: 'relative' },
  profileButton: { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', color: '#fff', fontSize: '0.95rem', fontWeight: '500' },
  profileName: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' },
  dropdownMenu: { position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: '220px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', color: '#333', padding: '12px', zIndex: 20 },
  dropdownHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  dropdownIcon: { color: '#0077b6' },
  dropdownName: { fontWeight: '600', fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis' },
  dropdownSignOut: { backgroundColor: '#e63946', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'background-color 0.2s ease' },
  contentArea: { flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', justifyContent: 'center', zIndex: 1 },
  contentContainer: { width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column' },
  searchBox: { position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto 30px' },
  searchIcon: { position: 'absolute', left: '18px', top: '16px', color: '#0077b6' },
  searchInput: { width: '100%', padding: '16px 20px 16px 50px', border: '2px solid #00b4d8', borderRadius: '12px', fontSize: '1rem', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  categoryCard: { backgroundColor: '#fff', padding: '24px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #00b4d8', cursor: 'pointer', textAlign: 'center' },
  categoryTitle: { margin: '0 0 12px', color: '#0077b6', fontSize: '1.3rem', fontWeight: '600' },
  tipCount: { margin: 0, color: '#666', fontSize: '0.95rem' },
  tipsView: { backgroundColor: '#fff', borderRadius: '16px', padding: '30px', boxShadow: '0 5px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '800px', border: '2px solid #00b4d8' },
  backButton: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', background: 'transparent', border: '2px solid #0077b6', color: '#0077b6', borderRadius: '12px', cursor: 'pointer', fontWeight: '500', marginBottom: '25px' },
  backIcon: { marginRight: '5px' },
  selectedCategoryTitle: { fontSize: '1.8rem', fontWeight: '600', color: '#0077b6', margin: '0 0 25px' },
  tipsList: { paddingLeft: '24px', margin: 0 },
  tipItem: { marginBottom: '16px', fontSize: '1.05rem', color: '#333', lineHeight: 1.6 }
};

export default Tips;
