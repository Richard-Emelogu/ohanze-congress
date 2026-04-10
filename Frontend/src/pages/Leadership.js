import React, { useState } from 'react';
import './Leadership.css';

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
import leader43 from '../assets/images/leader43.jpg';
import leader44 from '../assets/images/leader44.jpg';
import leader45 from '../assets/images/leader45.jpg';
import leader46 from '../assets/images/leader46.jpg';
import leader47 from '../assets/images/leader47.jpg';
import leader48 from '../assets/images/leader48.jpg';
import leader49 from '../assets/images/leader49.jpg';
import leader50 from '../assets/images/leader50.jpg';
import leader51 from '../assets/images/leader51.jpg';
import leader52 from '../assets/images/leader52.jpg';
import leader53 from '../assets/images/leader53.jpg';

const congressExcos = [
  { name: 'Engr. Solomon Ohia', position: 'President', image: leader14 },
  { name: 'Mr. Azubuike Anyanwu', position: 'Vice President', image: leader33 },
  { name: 'Mr. Ikenna Onumadu', position: 'Secretary-General', image: leader40 },
  { name: 'Mr. Christian Omeonu', position: 'Director of Finance', image: leader36 },
  { name: 'Mr. Justice Chimezie Nwakanna', position: 'Director of Community Service', image: leader43 },
  { name: 'Mr. Kelechi Ojogho', position: 'Director of Welfare', image: leader50 },
  { name: 'Mr. Chimezie Akpulonu', position: 'Director of Publicity', image: leader37 },
  { name: 'Barrister Emeka Enwereji', position: 'Sergeant at Arms', image: leader49 },
  { name: 'Mr. Charles Nwanmah', position: 'Asst. Director of Finance', image: leader46 },
  { name: 'Mr. Obioma Ochulor', position: 'Asst. Secretary-General', image: leader51 },
];

const diasporaChapter = [
  { name: 'Mr. Emenike Ihekoronye', position: 'Coordinator', image: leader12 },
  { name: 'Mr. Obinna Onyekwere', position: 'Secretary', image: leader35 },
];

const homeChapter = [
  { name: 'Mr. Ikechi Eguzoikpe', position: 'Coordinator', image: leader8 },
  { name: 'Elder Ndudim Adindu', position: 'Deputy Coordinator', image: leader2 },
];

const lagosChapter = [
  { name: 'Elder Chamberlain Nwaorgu', position: 'Coordinator', image: leader11 },
  { name: 'Mr. Prince Nwaekpe', position: 'Deputy Coordinator', image: leader32 },
];

const delegates = [
  { name: 'Mr. Ebere Nwakanma', image: leader3 },
  { name: 'Mr. Aguwamba Munachi', image: leader4 },
  { name: 'Mr. Nnam Obia', image: leader5 },
  { name: 'Mr. Tochukwu Emelogu', image: leader52 },
  { name: 'Mr. Michael Dimiri', image: leader53 },
  { name: 'Mr. Ihuoma Emelogu', image: leader6 },
  { name: 'Mr. Nwangwa Ogechi', image: leader7 },
  { name: 'Mr. Kelechi Imeoria', image: leader9 },
  { name: 'Mr. Chidi Ojogho', image: leader10 },
  { name: 'Mr. Onyekachi Dineya', image: leader13 },
  { name: 'Mr. Nelson Aaron', image: leader15 },
  { name: 'Mr. Ikechi Aaron', image: leader16 },
  { name: 'Mrs. Nnenna Uba', image: leader17 },
  { name: 'Mr. Boniface Nwosu', image: leader18 },
  { name: 'Mr. Sopuruchi Owen', image: leader19 },
  { name: 'Mr. Ronald Nwambu', image: leader20 },
  { name: 'Mr. Stanley Elewachi', image: leader21 },
  { name: 'Mr. Charles Onuha', image: leader23 },
  { name: 'Mr. Nkemjika Nnabugwu', image: leader24 },
  { name: 'Mr. Enyinnaya Ohia', image: leader25 },
  { name: 'Mr. Goodluck Nwanganga', image: leader26 },
  { name: 'Mr. Chijindu Amaechi', image: leader27 },
  { name: 'Mr. Chinwe Ikpeaba', image: leader28 },
  { name: 'Mr. Nworgu Kenneth', image: leader30 },
  { name: 'Mrs. Chinwe Emeanuwa', image: leader31 },
  { name: 'Mr. Kenneth Ochulor', image: leader34 },
  { name: 'Mrs. Oluchi Atubi', image: leader38 },
  { name: 'Mr. Ihekoronye Enyeribe', image: leader39 },
  { name: 'Mrs. Ngozi Atubi', image: leader41 },
  { name: 'Mr. Chidiadi Alaribe', image: leader44 },
  { name: 'Mr. Izuchukwu Adindu', image: leader45 },
  { name: 'Mr. Maraizu Nwoguu', image: leader47 },
  { name: 'Mr. Ahamefule Emelogu', image: leader48 },
  { name: 'Mr. Ebere Nwakanma', image: leader1 },
];

function ChapterSection({ title, members, bg }) {
  return (
    <section className="chapter-section" style={{ background: bg }}>
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <div className="chapter-grid">
          {members.map((leader, i) => (
            <div key={i} className="chapter-card">
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
  );
}

function Leadership() {
  const [showAllDelegates, setShowAllDelegates] = useState(false);
  const visibleDelegates = showAllDelegates ? delegates : delegates.slice(0, 12);

  return (
    <div className="leadership">
      <div className="page-hero">
        <h1>Our Leadership</h1>
        <p>Meet the dedicated team behind August 93 Club — Ohanze Congress</p>
      </div>

      {/* Congress Excos */}
      <section className="executives-section">
        <div className="container">
          <h2 className="section-title">Congress Excos — Big 10</h2>
          <div className="executives-grid">
            {congressExcos.map((exec, i) => (
              <div key={i} className="executive-card">
                <div className="executive-image-wrapper">
                  {exec.image
                    ? <img src={exec.image} alt={exec.name} className="executive-image" />
                    : <div className="placeholder-image">Photo coming soon</div>
                  }
                </div>
                <div className="executive-info">
                  <h3>{exec.name}</h3>
                  <p className="position">{exec.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ChapterSection title="Diaspora Chapter" members={diasporaChapter} bg="#ffffff" />
      <ChapterSection title="Home Chapter" members={homeChapter} bg="#f7f6f4" />
      <ChapterSection title="Lagos Chapter" members={lagosChapter} bg="#ffffff" />

      {/* Delegates */}
      <section className="delegates-section">
        <div className="container">
          <h2 className="section-title">Our Delegates</h2>
          <div className="delegates-grid">
            {visibleDelegates.map((d, i) => (
              <div key={i} className="delegate-card">
                <div className="delegate-image-wrapper">
                  <img src={d.image} alt={d.name} className="delegate-image" loading="lazy" />
                </div>
                <div className="delegate-info">
                  <h4>{d.name}</h4>
                  <p className="position">Delegate</p>
                </div>
              </div>
            ))}
          </div>
          {delegates.length > 12 && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                onClick={() => setShowAllDelegates(!showAllDelegates)}
                style={{
                  padding: '0.75rem 2rem',
                  background: showAllDelegates ? 'transparent' : 'linear-gradient(135deg,#c41e3a,#7a0a0a)',
                  color: showAllDelegates ? '#7a0a0a' : 'white',
                  border: '1.5px solid #c41e3a',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s',
                  letterSpacing: '0.3px',
                }}
              >
                {showAllDelegates ? 'Show Less' : `View All ${delegates.length} Delegates`}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Leadership;