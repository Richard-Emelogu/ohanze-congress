import React from 'react';
import './Leadership.css';

// Import ALL leader images (1-48)
import leader1 from '../assets/images/leader1.jpg';
import leader2 from '../assets/images/leader2.jpg';
import leader3 from '../assets/images/leader3.jpg';
import leader4 from '../assets/images/leader4.jpg';
import leader5 from '../assets/images/leader5.jpg';
import leader6 from '../assets/images/leader6.jpg';
import leader7 from '../assets/images/leader7.jpg';
import leader8 from '../assets/images/leader8.jpg';
import leader9 from '../assets/images/leader9.jpg';
import leader10 from '../assets/images/leader10.jpg';
import leader11 from '../assets/images/leader11.jpg';
import leader12 from '../assets/images/leader12.jpg';
import leader13 from '../assets/images/leader13.jpg';
import leader14 from '../assets/images/leader14.jpg';
import leader15 from '../assets/images/leader15.jpg';
import leader16 from '../assets/images/leader16.jpg';
import leader17 from '../assets/images/leader17.jpg';
import leader18 from '../assets/images/leader18.jpg';
import leader19 from '../assets/images/leader19.jpg';
import leader20 from '../assets/images/leader20.jpg';
import leader21 from '../assets/images/leader21.jpg';
import leader23 from '../assets/images/leader23.jpg';
import leader24 from '../assets/images/leader24.jpg';
import leader25 from '../assets/images/leader25.jpg';
import leader26 from '../assets/images/leader26.jpg';
import leader27 from '../assets/images/leader27.jpg';
import leader28 from '../assets/images/leader28.jpg';
import leader30 from '../assets/images/leader30.jpg';
import leader31 from '../assets/images/leader31.jpg';
import leader32 from '../assets/images/leader32.jpg';
import leader33 from '../assets/images/leader33.jpg';
import leader34 from '../assets/images/leader34.jpg';
import leader35 from '../assets/images/leader35.jpg';
import leader36 from '../assets/images/leader36.jpg';
import leader37 from '../assets/images/leader37.jpg';
import leader38 from '../assets/images/leader38.jpg';
import leader39 from '../assets/images/leader39.jpg';
import leader40 from '../assets/images/leader40.jpg';
import leader41 from '../assets/images/leader41.jpg';
// import leader42 from '../assets/images/leader42.jpg';
import leader43 from '../assets/images/leader43.jpg';
import leader44 from '../assets/images/leader44.jpg';
import leader45 from '../assets/images/leader45.jpg';
import leader46 from '../assets/images/leader46.jpg';
// import leader48 from '../assets/images/leader48.jpg';
// import leader49 from '../assets/images/leader49.jpg';
// import leader50 from '../assets/images/leader50.jpg';

function Leadership() {
  // Big 10 Executive Positions (Congress Excos)
  const congressExcos = [
    {
      name: 'Engr.Solomon Ohia',
      position: 'President',
      image: leader14,
    },
    {
      name: 'Mr.Azubuike Anyanwu',
      position: 'Vice President',
      image: leader33,
    },
    {
      name: 'Mr.Ikenna Onumadu',
      position: 'Secretary-General',
      image: leader40,
    },
    {
      name: 'Mr.Christain Omeonu',
      position: 'Director of Finance',
      image: leader36,
    },
    {
      name: 'Mr.Justice Chimezie Nwakanna',
      position: 'Director of community service',
      image: leader43,
    },
    {
      name: 'Mr.Kelechi Ojogho',
      position: 'Director of Welfare',
      image: null, // leader49 - placeholder
    },
    {
      name: 'Mr.Chimezie Akpulonu',
      position: 'Director of Publicity',
      image: leader37,
    },
    {
      name: 'Barrister Emeka Enwereji',
      position: 'Sargent of Arms',
      image: null, // Using null instead of duplicate leader40
    },
    {
      name: 'Mr.Charles Nwanmah',
      position: 'Assistant Director of Finance',
      image: leader46,
    },
    {
      name: 'Mr.Obioma Ochulor',
      position: 'Assistant Secretary-General',
      image: null, // leader51 - placeholder
    }
  ];

  // Diaspora Chapter
  const diasporaChapter = [
    {
      name: 'Mr.Emenike Ihekoronye',
      position: 'Coordinator',
      image: leader12,
    },
    {
      name: 'Mr.Obinna Onyekwere',
      position: 'Secretary',
      image: leader35,
    }
  ];

  // Home Chapter
  const homeChapter = [
    {
      name: 'Mr.Ikechi Eguzoikpe',
      position: 'Coordinator',
      image: leader8,
    },
    {
      name: 'Elder Ndudim Adindu',
      position: 'Deputy Coordinator',
      image: leader2,
    }
  ];

  // Lagos Chapter
  const lagosChapter = [
    {
      name: 'Elder Chamberlain Nwaorgu',
      position: 'Coordinator',
      image: leader11,
    },
    {
      name: 'Mr.Prince Nwaekpe',
      position: 'Deputy Coordinator',
      image: leader32,
    }
  ];

  // Create a list of all images used in leadership positions
  const usedImages = [
    // Congress Excos
    leader14, leader33, leader40, leader36, leader43, leader37, leader46,
    // Diaspora Chapter
    leader12, leader35,
    // Home Chapter
    leader8, leader2,
    // Lagos Chapter
    leader11, leader32
  ].filter(img => img !== null); // Remove null values

  // All Leader Images available
  const allLeaderImages = [
    leader1, leader2, leader3, leader4, leader5, leader6, leader7, leader8,
    leader9, leader10, leader11, leader12, leader13, leader14, leader15, leader16,
    leader17, leader18, leader19, leader20, leader21, leader23, leader24,
    leader25, leader26, leader27, leader28, leader30, leader31, leader32,
    leader33, leader34, leader35, leader36, leader37, leader38, leader39, leader40,
    leader41, leader43, leader44, leader45, leader46,
  ];

  // Filter out images that are already used in leadership positions
  const delegateImages = allLeaderImages.filter(image => !usedImages.includes(image));

  const delegates = delegateImages.map((image, index) => ({
    name: `Member ${index + 1}`,
    position: 'Delegate',
    image: image
  }));

  return (
    <div className="leadership">
      <div className="leadership-hero">
        <h1>Our Leadership</h1>
        <p>Meet the dedicated team of August 93 Club - Ohanze Congress</p>
      </div>

      {/* Congress Excos - Big 10 */}
      <section className="executives-section">
        <div className="container">
          <h2 className="section-title">Congress Excos (Big 10)</h2>
          <div className="executives-grid">
            {congressExcos.map((executive, index) => (
              <div key={index} className="executive-card">
                <div className="executive-image-wrapper">
                  {executive.image ? (
                    <img src={executive.image} alt={executive.name} className="executive-image" />
                  ) : (
                    <div className="placeholder-image">Image Coming Soon</div>
                  )}
                </div>
                <div className="executive-info">
                  <h3>{executive.name}</h3>
                  <p className="position">{executive.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diaspora Chapter Section */}
      <section className="chapter-section diaspora-chapter">
        <div className="container">
          <h2 className="section-title">Diaspora Chapter</h2>
          <div className="chapter-grid">
            {diasporaChapter.map((leader, index) => (
              <div key={index} className="chapter-card">
                <div className="chapter-image-wrapper">
                  <img src={leader.image} alt={leader.name} className="chapter-image" />
                </div>
                <div className="chapter-info">
                  <h3>{leader.name}</h3>
                  <p className="position">{leader.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Home Chapter Section */}
      <section className="chapter-section home-chapter">
        <div className="container">
          <h2 className="section-title">Home Chapter</h2>
          <div className="chapter-grid">
            {homeChapter.map((leader, index) => (
              <div key={index} className="chapter-card">
                <div className="chapter-image-wrapper">
                  <img src={leader.image} alt={leader.name} className="chapter-image" />
                </div>
                <div className="chapter-info">
                  <h3>{leader.name}</h3>
                  <p className="position">{leader.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lagos Chapter Section */}
      <section className="chapter-section lagos-chapter">
        <div className="container">
          <h2 className="section-title">Lagos Chapter</h2>
          <div className="chapter-grid">
            {lagosChapter.map((leader, index) => (
              <div key={index} className="chapter-card">
                <div className="chapter-image-wrapper">
                  <img src={leader.image} alt={leader.name} className="chapter-image" />
                </div>
                <div className="chapter-info">
                  <h3>{leader.name}</h3>
                  <p className="position">{leader.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delegates Section */}
      <section className="delegates-section">
        <div className="container">
          <h2 className="section-title">Our Delegates</h2>
          <div className="delegates-grid">
            {delegates.map((delegate, index) => (
              <div key={index} className="delegate-card">
                <div className="delegate-image-wrapper">
                  <img src={delegate.image} alt={delegate.name} className="delegate-image" />
                </div>
                <div className="delegate-info">
                  <h4>{delegate.name}</h4>
                  <p className="position">{delegate.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Leadership;