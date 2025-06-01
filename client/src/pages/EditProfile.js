import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function EditProfile() {
    const { username } = useParams();
    const navigate = useNavigate();
    return (
        <div>
            <div>
                <h1>Edit Profile:</h1>
                <p>{username}</p>
            </div>
            <div>
                <button>Save Changes</button>
                <br></br>
                <button onClick={() => navigate(`/profile/${username}`)}>Done</button>
            </div>
        </div>
    );
}

export default EditProfile;