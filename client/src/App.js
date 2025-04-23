import {useEffect, useState} from 'react';

function App() {
  const [serverMsg, setServerMsg] = useState("I got nothing!")

  useEffect(() => {
    fetch('/test')
        .then(resp => resp.json())
        .then(data => setServerMsg(data.serverMsg))
        .catch(() => setServerMsg("Hmm still waiting!"))
    }, []);

  return (
    <>
      {serverMsg}
    </>
  );
}

export default App;
