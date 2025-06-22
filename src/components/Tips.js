import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiArrowLeft, FiDroplet, FiHome, FiInfo, FiClock } from 'react-icons/fi';

const Tips = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const waterTips = [
        {
            id: 'bathroom',
            title: "🚿 Bathroom Tips",
            tips: [
                "Take 5-minute showers (saves 30-50 gallons)",
                "Turn off tap while brushing teeth (saves 8 gal/day)",
                "Install low-flow showerheads (saves 2.5 gal/min)",
                "Fix leaky toilets (can waste 200 gal/day)",
                "Use water-saving toilets (1.6 gal/flush vs 3.5-7)"
            ]
        },
        {
            id: 'kitchen',
            title: "🍽️ Kitchen Tips",
            tips: [
                "Run full dishwasher loads (saves 5-15 gal/load)",
                "Soak pots instead of running water",
                "Keep drinking water in fridge",
                "Wash veggies in bowl, reuse water for plants",
                "Defrost food in fridge overnight"
            ]
        },
        {
            id: 'laundry',
            title: "👕 Laundry Tips",
            tips: [
                "Wash full loads (saves 15-45 gal/load)",
                "Use cold water when possible",
                "Upgrade to HE washer (saves 30%)",
                "Reuse towels multiple times",
                "Pretreat stains to avoid rewashing"
            ]
        },
        {
            id: 'outdoor',
            title: "🌳 Outdoor Tips",
            tips: [
                "Water plants early morning",
                "Use drip irrigation (saves 50%)",
                "Collect rainwater for gardening",
                "Plant drought-resistant natives",
                "Use mulch (reduces evaporation 70%)"
            ]
        }
    ];

    const filteredCategories = waterTips.filter(category => 
        category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.tips.some(tip => tip.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div style={styles.page}>
            {/* Header with consistent navigation */}
            <div style={styles.header}>
                <div style={styles.logo}>
                    <FiDroplet size={32} />
                    <h1 style={styles.title}>AquaGuard</h1>
                </div>
                <p style={styles.subtitle}>Water Conservation Tips</p>
            </div>

            {/* Navigation Tabs - matches other components */}
            <div style={styles.navTabs}>
                <button 
                    style={styles.tabButton}
                    onClick={() => navigate('/chat')}
                >
                    <FiHome style={styles.icon} /> Chat
                </button>
                <button 
                    style={styles.tabButton}
                    onClick={() => navigate('/usage')}
                >
                    <FiInfo style={styles.icon} /> Usage
                </button>
                <button style={{ ...styles.tabButton, ...styles.activeTab }}>
                    <FiClock style={styles.icon} /> Tips
                </button>
            </div>

            {/* Content Area */}
            <div style={styles.content}>
                {/* Search Box */}
                <div style={styles.searchBox}>
                    <FiSearch style={styles.searchIcon} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search water saving tips..."
                        style={styles.searchInput}
                    />
                </div>

                {/* Categories View */}
                {!selectedCategory && (
                    <div style={styles.categoryGrid}>
                        {filteredCategories.map(category => (
                            <div 
                                key={category.id}
                                style={styles.categoryCard}
                                onClick={() => setSelectedCategory(category)}
                            >
                                <h3 style={styles.categoryTitle}>{category.title}</h3>
                                <p style={styles.tipCount}>{category.tips.length} tips available</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tips View */}
                {selectedCategory && (
                    <div style={styles.tipsView}>
                        <button 
                            style={styles.backButton}
                            onClick={() => setSelectedCategory(null)}
                        >
                            <FiArrowLeft style={styles.backIcon} /> Back to Categories
                        </button>
                        
                        <h2 style={styles.selectedCategoryTitle}>{selectedCategory.title}</h2>
                        
                        <ul style={styles.tipsList}>
                            {selectedCategory.tips.map((tip, index) => (
                                <li key={index} style={styles.tipItem}>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: '#f5f9fa'
    },
    header: {
        textAlign: 'center',
        padding: '20px',
        background: 'linear-gradient(to right, #0077b6, #00b4d8)',
        color: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
    },
    title: {
        fontSize: '2rem',
        margin: 0,
        fontWeight: '600',
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
    },
    subtitle: {
        fontSize: '1.1rem',
        margin: '5px 0 0',
        opacity: '0.9'
    },
    navTabs: {
        display: 'flex',
        justifyContent: 'center',
        background: 'linear-gradient(to right, #0065a3, #0097c7)',
        padding: '10px 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
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
        gap: '8px'
    },
    activeTab: {
        background: 'rgba(255,255,255,0.2)',
        fontWeight: '600'
    },
    icon: {
        marginRight: '5px'
    },
    content: {
        flex: 1,
        maxWidth: '1200px',
        width: '100%',
        margin: '20px auto',
        padding: '0 20px',
        boxSizing: 'border-box'
    },
    searchBox: {
        position: 'relative',
        marginBottom: '25px',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    searchIcon: {
        position: 'absolute',
        left: '15px',
        top: '12px',
        color: '#0077b6'
    },
    searchInput: {
        width: '100%',
        padding: '12px 20px 12px 45px',
        border: '1px solid #b2dfdb',
        borderRadius: '30px',
        fontSize: '1rem',
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    categoryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        padding: '10px'
    },
    categoryCard: {
        background: 'white',
        borderRadius: '10px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e0f2f7',
        ':hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
        }
    },
    categoryTitle: {
        margin: '0 0 10px',
        color: '#0077b6',
        fontSize: '1.2rem'
    },
    tipCount: {
        margin: 0,
        color: '#666',
        fontSize: '0.9rem'
    },
    tipsView: {
        background: 'white',
        borderRadius: '10px',
        padding: '25px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto'
    },
    backButton: {
        padding: '10px 15px',
        background: 'transparent',
        border: '1px solid #0077b6',
        color: '#0077b6',
        borderRadius: '30px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px',
        transition: 'all 0.3s ease',
        ':hover': {
            background: '#e6f4f9'
        }
    },
    backIcon: {
        marginRight: '5px'
    },
    selectedCategoryTitle: {
        color: '#0077b6',
        margin: '0 0 20px',
        fontSize: '1.5rem'
    },
    tipsList: {
        paddingLeft: '20px',
        margin: 0
    },
    tipItem: {
        marginBottom: '12px',
        lineHeight: '1.5',
        color: '#333'
    }
};

export default Tips;