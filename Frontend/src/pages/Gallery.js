import React from 'react';
import './Gallery.css';
import groupPhoto from '../assets/images/group-photo.jpg';
import groupPhoto2 from '../assets/images/group-photo2.jpg';
import groupPhoto3 from '../assets/images/group-photo3.jpg';
import walk1 from '../assets/images/walk1.jpg';
import walk2 from '../assets/images/walk2.jpg';
import walk3 from '../assets/images/walk3.jpg';
import walk4 from '../assets/images/walk4.jpg';
import walk5 from '../assets/images/walk5.jpg';
import walk6 from '../assets/images/walk6.jpg';
import walk7 from '../assets/images/walk7.jpg';
import walk8 from '../assets/images/walk8.jpg';
import walk9 from '../assets/images/walk9.jpg';
import walk10 from '../assets/images/walk10.jpg';

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
      title: 'August Retreat 2025',
      description: 'Service for advancement in action'
    },
    {
      id: 4,
      src: walk1,
      title: 'Community Walk',
      description: 'Promoting health and unity in Ohanze'
    },
    {
      id: 5,
      src: walk2,
      title: 'Health Awareness Walk',
      description: 'Walking for wellness in our community'
    },
    {
      id: 6,
      src: walk3,
      title: 'City Walk 2024',
      description: 'Members participating in community exercise'
    },
    {
      id: 7,
      src: walk4,
      title: 'Morning Fitness Session',
      description: 'Club members staying active together'
    },
    {
      id: 8,
      src: walk5,
      title: 'Walk for Progress',
      description: 'Symbolic walk representing our journey forward'
    },
    {
      id: 9,
      src: walk6,
      title: 'Community Bonding Walk',
      description: 'Strengthening bonds through physical activity'
    },
    {
      id: 10,
      src: walk7,
      title: 'Igbaga Dance',
      description: 'Our Dancers in action'
    },
    {
      id: 11,
      src: walk8,
      title: 'Annual Fitness Walk',
      description: 'Members in action during our yearly walk'
    },
    {
      id: 12,
      src: walk9,
      title: 'Football cup',
      description: 'Football cup being given to our capable players by the President 2025: Engr.Solomon Ohia'
    },
    {
      id: 13,
      src: walk10,
      title: 'Final Walk Session',
      description: 'Concluding our fitness activities for the season'
    }
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