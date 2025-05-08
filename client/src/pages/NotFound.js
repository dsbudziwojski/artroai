import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();
    return (
        <>
            <h1>404 | Page Not Found</h1>
            <button onClick={() => navigate("/home")}>Go to Home Page</button>
        </>
    );
}

export default NotFound;