import React, { useState } from 'react';
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
import photo1 from '../assets/images/photo1.jpg';
import photo2 from '../assets/images/photo2.jpg';
import photo3 from '../assets/images/photo3.jpg';
import photo4 from '../assets/images/photo4.jpg';
import photo5 from '../assets/images/photo5.jpg';
import photo6 from '../assets/images/photo6.jpg';
import photo7 from '../assets/images/photo7.jpg';
import photo8 from '../assets/images/photo8.jpg';
import photo9 from '../assets/images/photo9.jpg';
import photo10 from '../assets/images/photo10.jpg';
import photo13 from '../assets/images/photo13.jpg';
import photo14 from '../assets/images/photo14.jpg';
import photo15 from '../assets/images/photo15.jpg';
import photo16 from '../assets/images/photo16.jpg';
import photo17 from '../assets/images/photo17.jpg';
import photo18 from '../assets/images/photo18.jpg';

const YOUTUBE_CHANNEL = 'https://www.youtube.com/@YourChannelHere';

const galleryImages = [
  { id: 1, src: groupPhoto, title: 'August 93 Club Members', description: 'Our dedicated members in official polo shirts' },
  { id: 2, src: groupPhoto2, title: 'Annual General Meeting', description: 'AGM 2024 — Planning for the future' },
  { id: 3, src: groupPhoto3, title: 'August Retreat 2025', description: 'Service for advancement in action' },
  { id: 4, src: walk1, title: 'Community Walk', description: 'Promoting health and unity in Ohanze' },
  { id: 5, src: walk2, title: 'Health Awareness Walk', description: 'Walking for wellness in our community' },
  { id: 6, src: walk3, title: 'City Walk 2024', description: 'Members participating in community exercise' },
  { id: 7, src: walk4, title: 'Morning Fitness Session', description: 'Club members staying active together' },
  { id: 8, src: walk5, title: 'Walk for Progress', description: 'Symbolic walk representing our journey forward' },
  { id: 9, src: walk6, title: 'Community Bonding Walk', description: 'Strengthening bonds through physical activity' },
  { id: 10, src: walk7, title: 'Igbaga Dance', description: 'Our dancers in action' },
  { id: 11, src: walk8, title: 'Annual Fitness Walk', description: 'Members in action during our yearly walk' },
  { id: 12, src: walk9, title: 'Football Cup', description: 'Cup presented by President 2025: Engr. Solomon Ohia' },
  { id: 13, src: walk10, title: 'Final Walk Session', description: 'Concluding our fitness activities for the season' },
  { id: 14, src: photo1, title: 'Foundation Ceremony 1', description: 'The official foundation-laying ceremony for the new ICT Center in Ohanze' },
  { id: 15, src: photo2, title: 'Foundation Ceremony 2', description: 'Leaders and community members gather for the Secretariat groundbreaking' },
  { id: 16, src: photo3, title: 'Foundation Ceremony 3', description: 'Ceremonial stones are laid to begin construction of the new ICT hub' },
  { id: 17, src: photo4, title: 'Foundation Ceremony 4', description: "Officials and guests celebrate the progress of Ohanze Congress' future home" },
  { id: 18, src: photo5, title: 'Foundation Ceremony 5', description: 'The Secretariat foundation ceremony with prayers and dedication' },
  { id: 19, src: photo6, title: 'Foundation Ceremony 6', description: 'Community leaders plant the first markers for the ICT Center' },
  { id: 20, src: photo7, title: 'Foundation Ceremony 7', description: 'Hands join together as the new Secretariat project begins' },
  { id: 21, src: photo8, title: 'Foundation Ceremony 8', description: 'A moment of unity and purpose during the Secretariat groundbreaking' },
  { id: 22, src: photo9, title: 'Foundation Ceremony 9', description: 'The Ohanze Congress ICT Center foundation-laying event in full view' },
  { id: 23, src: photo10, title: 'Foundation Ceremony 10', description: 'Ceremonial speeches and community support for the development project' },
  { id: 24, src: photo13, title: 'Foundation Ceremony 13', description: 'The groundbreaking for the new Secretariat office building' },
  { id: 25, src: photo14, title: 'Foundation Ceremony 14', description: 'Delegates and dignitaries mark this milestone for the club' },
  { id: 26, src: photo15, title: 'Foundation Ceremony 15', description: 'A strong start for the ICT Center and Secretariat project with Engr. Solomon Ohia' },
  { id: 27, src: photo16, title: 'Foundation Ceremony 16', description: 'Ohanze Congress members celebrate the future Secretariat foundation' },
  { id: 28, src: photo17, title: 'Foundation Ceremony 17', description: 'A powerful display of community and infrastructure development' },
  { id: 29, src: photo18, title: 'Foundation Ceremony 18', description: "Closing image showcasing the beginning of Ohanze Congress's new facility" },
];

const videos = [
  { id: 1, videoId: 'lYO8YQGOobA', title: '2025 Ohanze City Walk Part 1', date: '2025' },
  { id: 2, videoId: 'qrrJoXEKmOU', title: '2025 Ohanze City Walk Part 2', date: '2025' },
  { id: 3, videoId: 'iGF98cSMVW0', title: '2025 Ohanze City Walk Part 3', date: '2025' },
  { id: 4, videoId: 'XZeD6SMLCSM', title: 'Ohanze City Walk 2022', date: '2022' },
];

function Gallery() {
  const [activeTab, setActiveTab] = useState('videos');

  const getThumb = (videoId) => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const getVideoUrl = (videoId) => `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="gallery">
      <div className="page-hero">
        <h1>Our Gallery</h1>
        <p>Moments, memories and the foundation-laying ceremony for the new ICT Center and Secretariat at Ohanze Congress.</p>
      </div>

      <div className="gallery-tabs">
        <button
          className={`gallery-tab ${activeTab === 'photos' ? 'active' : ''}`}
          onClick={() => setActiveTab('photos')}
        >
          Photos
        </button>
        <button
          className={`gallery-tab ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          Videos
        </button>
      </div>

      {activeTab === 'photos' && (
        <div className="photos-section">
          <div className="gallery-grid">
            {galleryImages.map((image) => (
              <div key={image.id} className="gallery-item">
                <div className="gallery-image">
                  <img src={image.src} alt={image.title} loading="lazy" />
                  <div className="gallery-overlay">
                    <h3>{image.title}</h3>
                    <p>{image.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'videos' && (
        <div className="videos-section">
          <div className="videos-intro">
            <h2 className="section-title">Our Videos</h2>
            <p>Watch highlights and events from the August 93 Club on YouTube</p>
          </div>

          <div className="videos-grid">
            {videos.map((video) => (
              <a
                key={video.id}
                href={getVideoUrl(video.videoId)}
                target="_blank"
                rel="noopener noreferrer"
                className="video-card"
              >
                <div className="video-thumb">
                  <img
                    src={getThumb(video.videoId)}
                    alt={video.title}
                    loading="lazy"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="play-btn">
                    <svg viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <p>{video.date}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="youtube-cta">
            <h3>Watch More on YouTube</h3>
            <p>Subscribe to our channel to stay updated with the latest videos from Ohanze Congress</p>
            <a
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="yt-btn"
            >
              <svg className="yt-icon" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Visit Our YouTube Channel
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;