import {useEffect, useState} from 'react';

function Home() {
    const [serverMsg, setServerMsg] = useState("I got nothing!")

    useEffect(() => {
        fetch('/api/test')
            .then(resp => resp.json())
            .then(data => setServerMsg(data.serverMsg))
            .catch(() => setServerMsg("Hmm still waiting!"))
    }, []);

    return (
        <>
            <p>
                Message: {serverMsg}
            </p>
        </>
    );
}

export default Home;