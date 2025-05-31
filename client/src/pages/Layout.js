import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();

    return (
        <div>
            <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", borderBottom: "1px solid #ccc" }}>
                <div>
                    <Link to="/home" style={{ marginRight: "1rem" }}>Feed</Link>
                    <Link to="/profile">Profile</Link>
                </div>
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: "0.5rem", width: "250px" }}
                />
            </nav>

            <Outlet context={{ searchQuery }} />
        </div>
    );
}