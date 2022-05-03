import React from 'react'
import steve from'../../../images/SteveJobs.jpg';

function ProfileInfo(props) {
    return (
        <div className="aboutme">
            <img src={steve} alt="photo" class="steve"/>
            <div className="info">
                <p class="name">Steve Jobs</p>
                <div className="worknplace">
                    <p className="from">Lives in California</p>
                    <p className="job">Works at Apple</p>
                </div>
            </div>
        </div>
    );
  }
  
  export default ProfileInfo;