import { useNavigate } from 'react-router-dom';

function LostPassword() {
    const navigate = useNavigate();
    return (
        <>
            <h1>That's a you problem buddy</h1>
            <button onClick={() => navigate("/")}>Go back to Login</button>
        </>
    );
}

export default LostPassword;