import {useEffect, useState} from 'react';

function Profile() {
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        fetch('/api/test')
            .then(resp => resp.json())
            .then(data => setUserData(data))
    }, []);

    return (
        <div>
            <h1>User Profile</h1>
            {userData && (
                <div>
                    <h2>This is {userData.name}'s Profile</h2>
                </div>
            )}
        </div>
    );
}

export default Profile;