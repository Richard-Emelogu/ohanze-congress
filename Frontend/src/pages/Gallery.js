import React from 'react';
import './Gallery.css';
import groupPhoto from '../assets/images/group-photo.jpg';
import groupPhoto2 from '../assets/images/group-photo2.jpg';
import groupPhoto3 from '../assets/images/group-photo3.jpg';
// import groupPhoto4 from '../assets/images/group-photo4.jpg';
// import groupPhoto5 from '../assets/images/group-photo5.jpg';
// import groupPhoto6 from '../assets/images/group-photo6.jpg';

function Gallery() {
  const galleryImages = [
    {
      id: 1,
      src: groupPhoto,
      title: 'August 93 Club Members - Group Photo',
      description: 'Our dedicated members in official polo shirts'
    },
    {
      id: 2,
      src: groupPhoto2,
      title: 'Annual General Meeting',
      description: 'AGM 2024 - Planning for the future'
    },
    {
      id: 3,
      src: groupPhoto3,
      title: 'Community Outreach',
      description: 'Service for advancement in action'
    },
    // {
    //   id: 4,
    //   src: groupPhoto4,
    //   title: 'Cultural Festival',
    //   description: 'Celebrating our rich heritage'
    // },
    // {
    //   id: 5,
    //   src: groupPhoto5,
    //   title: 'Youth Empowerment Program',
    //   description: 'Investing in the next generation'
    // },
    // {
    //   id: 6,
    //   src: groupPhoto6,
    //   title: 'Leadership Summit',
    //   description: 'Strategic planning session'
    // }
  ];

  return (
    <div className="gallery">
      <div className="gallery-hero">
        <h1>Our Gallery</h1>
        <p>Moments and memories from August 93 Club - Ohanze Congress</p>
      </div>

      <div className="container">
        <div className="gallery-grid">
          {galleryImages.map((image) => (
            <div key={image.id} className="gallery-item">
              <div className="gallery-image">
                <img src={image.src} alt={image.title} />
                <div className="gallery-overlay">
                  <h3>{image.title}</h3>
                  <p>{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Gallery;