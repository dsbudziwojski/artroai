import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [serverMsg, setServerMsg] = useState("I got nothing!")
    const navigate = useNavigate();
    useEffect(() => {
        fetch('/api/test')
            .then(resp => resp.json())
            .then(data => setServerMsg(data.serverMsg))
            .catch(() => setServerMsg("Hmm still waiting!"))
    }, []);

    return (
        <>
            <h1>Message: {serverMsg}</h1>
            <button onClick={() => navigate("/profile")}>User Profile</button>
        </>
    );
}

export default Home;