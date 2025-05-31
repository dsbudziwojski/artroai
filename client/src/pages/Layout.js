import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();

    return (
        <div>
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", borderBottom: "1px solid #ccc" }}>
                <div>
                    <Link 
                        to="/home" 
                        style={{ 
                            marginRight: "1rem",
                            border: '2px solid #333',
                            backgroundColor: 'transparent',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            color: 'inherit',
                            cursor: 'pointer'
                        }}
                    >
                        Feed
                    </Link>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: "0.5rem", width: "250px", border: '2px solid #333', borderRadius: '4px', backgroundColor: 'transparent' }}
                    />
                    <button
                        onClick={() => window.location.href = '/profile/oh-a-cai'}
                        style={{
                            border: '2px solid #333',
                            backgroundColor: 'transparent',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        My Profile
                    </button>
                </div>
            </nav>

            <Outlet context={{ searchQuery }} />
        </div>
    );
}