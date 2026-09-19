import { useEffect, useRef, useState } from "react";
import "./App.css";
import Camera from "./components/Camera";

function App() {
  const [emotion, setEmotion] = useState("");

  const audioRef = useRef(null);

  const [playingSong, setPlayingSong] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  console.log("App Emotion:", emotion);

  // =====================================================
  // SONG RECOMMENDATIONS
  // =====================================================

  const recommendations = {
    happy: {
      title: "YOUR MOOD FEELS HAPPY.",
      subtitle:
        "Bright energy. Good vibes. Keep it going.",
      songs: [
        {
          title: "Good Energy",
          artist: "Moodify Selection",
          type: "UPBEAT",
          file: "/songs/happy.mp3",
        },
        {
          title: "Feel Good",
          artist: "Moodify Selection",
          type: "HAPPY",
          file: "/songs/happy.mp3",
        },
        {
          title: "Weekend Drive",
          artist: "Moodify Selection",
          type: "VIBES",
          file: "/songs/happy.mp3",
        },
      ],
    },

    sad: {
      title: "A QUIETER MOMENT.",
      subtitle:
        "Take it slow. Here are some calmer sounds.",
      songs: [
        {
          title: "Soft Rain",
          artist: "Moodify Selection",
          type: "CALM",
          file: "/songs/calm.mp3",
        },
        {
          title: "Midnight Thoughts",
          artist: "Moodify Selection",
          type: "AMBIENT",
          file: "/songs/calm.mp3",
        },
        {
          title: "Slow Days",
          artist: "Moodify Selection",
          type: "CHILL",
          file: "/songs/calm.mp3",
        },
      ],
    },

    angry: {
      title: "FEELING THE ENERGY.",
      subtitle:
        "Turn that intensity into rhythm and movement.",
      songs: [
        {
          title: "Power Mode",
          artist: "Moodify Selection",
          type: "ENERGY",
          file: "/songs/energy.mp3",
        },
        {
          title: "Run It",
          artist: "Moodify Selection",
          type: "POWER",
          file: "/songs/energy.mp3",
        },
        {
          title: "High Voltage",
          artist: "Moodify Selection",
          type: "INTENSE",
          file: "/songs/energy.mp3",
        },
      ],
    },

    neutral: {
      title: "A BALANCED MOMENT.",
      subtitle:
        "Clean sounds for a clear state of mind.",
      songs: [
        {
          title: "Deep Focus",
          artist: "Moodify Selection",
          type: "FOCUS",
          file: "/songs/focus.mp3",
        },
        {
          title: "Minimal Flow",
          artist: "Moodify Selection",
          type: "MINIMAL",
          file: "/songs/focus.mp3",
        },
        {
          title: "Quiet Space",
          artist: "Moodify Selection",
          type: "AMBIENT",
          file: "/songs/focus.mp3",
        },
      ],
    },

    surprised: {
      title: "THAT LOOKED UNEXPECTED.",
      subtitle:
        "Let's match that energy with something fun.",
      songs: [
        {
          title: "New Wave",
          artist: "Moodify Selection",
          type: "FRESH",
          file: "/songs/energy.mp3",
        },
        {
          title: "Electric Mood",
          artist: "Moodify Selection",
          type: "ENERGY",
          file: "/songs/energy.mp3",
        },
        {
          title: "Wild Ride",
          artist: "Moodify Selection",
          type: "FUN",
          file: "/songs/energy.mp3",
        },
      ],
    },

    fearful: {
      title: "TAKE A BREATH.",
      subtitle:
        "Something softer for a more comfortable moment.",
      songs: [
        {
          title: "Peaceful Space",
          artist: "Moodify Selection",
          type: "CALM",
          file: "/songs/calm.mp3",
        },
        {
          title: "Slow Breathing",
          artist: "Moodify Selection",
          type: "AMBIENT",
          file: "/songs/calm.mp3",
        },
        {
          title: "Soft Light",
          artist: "Moodify Selection",
          type: "CHILL",
          file: "/songs/calm.mp3",
        },
      ],
    },

    disgusted: {
      title: "LET'S CHANGE THE VIBE.",
      subtitle:
        "Fresh sounds to shift the atmosphere.",
      songs: [
        {
          title: "Fresh Start",
          artist: "Moodify Selection",
          type: "FRESH",
          file: "/songs/calm.mp3",
        },
        {
          title: "Clean Air",
          artist: "Moodify Selection",
          type: "CHILL",
          file: "/songs/calm.mp3",
        },
        {
          title: "New Direction",
          artist: "Moodify Selection",
          type: "VIBES",
          file: "/songs/calm.mp3",
        },
      ],
    },
  };

  // =====================================================
  // CURRENT RECOMMENDATION
  // =====================================================

  const currentRecommendation =
    recommendations[emotion] || recommendations.neutral;

  // =====================================================
  // PLAY / PAUSE SONG
  // =====================================================

  const toggleSong = (song) => {
    if (!audioRef.current) {
      return;
    }

    // Same song -> Pause
    if (
      playingSong === song.title &&
      isPlaying
    ) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // Stop previous song
    audioRef.current.pause();

    // Reset previous audio
    audioRef.current.currentTime = 0;

    // Load selected song
    audioRef.current.src = song.file;

    audioRef.current
      .play()
      .then(() => {
        setPlayingSong(song.title);
        setIsPlaying(true);
      })
      .catch((error) => {
        console.log("Audio play error:", error);
      });
  };

  // =====================================================
  // AUDIO ENDED
  // =====================================================

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handleEnded = () => {
      setIsPlaying(false);
      setPlayingSong("");
    };

    audio.addEventListener(
      "ended",
      handleEnded
    );

    return () => {
      audio.removeEventListener(
        "ended",
        handleEnded
      );
    };
  }, []);

  // =====================================================
  // EMOTION CHANGE
  // =====================================================

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setPlayingSong("");
    setIsPlaying(false);
  }, [emotion]);

  // =====================================================
  // SCROLL FUNCTION
  // =====================================================

  const scrollToExperience = () => {
    document
      .getElementById("experience")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="app">

      {/* =================================================
          AUDIO PLAYER
      ================================================= */}

      <audio ref={audioRef} />


      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="navbar">

        <div className="logo">
          MOODIFY<span>®</span>
        </div>

        <div className="nav-links">

          <a href="#experience">
            Experience
          </a>

          <a href="#how">
            How it works
          </a>

          <a href="#about">
            About
          </a>

        </div>

        <button
          className="nav-btn"
          onClick={scrollToExperience}
        >
          Try it <span>↗</span>
        </button>

      </nav>


      {/* =================================================
          HERO
      ================================================= */}

      <main className="hero">

        <div className="hero-left">

          <div className="hero-tag">

            <span></span>

            AI POWERED MUSIC EXPERIENCE

          </div>


          <h1>

            YOUR
            <br />

            <span>MOOD.</span>

            <br />

            YOUR
            <br />

            MUSIC.

          </h1>


          <p className="hero-description">

            Moodify reads your facial expression
            and creates a music experience
            around your moment.

          </p>


          <div className="hero-actions">

            <button
              className="primary-btn"
              onClick={scrollToExperience}
            >

              TRY MOOD DETECTION

              <span>↗</span>

            </button>


            <div className="hero-note">

              <span>●</span>

              CAMERA BASED
              <br />

              EXPRESSION ANALYSIS

            </div>

          </div>

        </div>


        {/* =================================================
            CAMERA
        ================================================= */}

        <div className="hero-right">

          <div className="camera-card-label">

            <span>01</span>

            LIVE EXPERIENCE

          </div>


          <div className="face-card">

            <Camera
              onEmotionChange={setEmotion}
            />

          </div>


          <div className="camera-card-footer">

            <span>
              MOODIFY / 2026
            </span>

            <span>
              LIVE SCAN ↗
            </span>

          </div>

        </div>

      </main>


      {/* =================================================
          MARQUEE
      ================================================= */}

      <section className="marquee">

        <div>

          DISCOVER YOUR MOOD
          &nbsp;&nbsp;✦&nbsp;&nbsp;

          DISCOVER YOUR MUSIC
          &nbsp;&nbsp;✦&nbsp;&nbsp;

          FIND YOUR SOUND
          &nbsp;&nbsp;✦&nbsp;&nbsp;

          DISCOVER YOUR MOOD
          &nbsp;&nbsp;✦&nbsp;&nbsp;

          DISCOVER YOUR MUSIC

        </div>

      </section>


      {/* =================================================
          EXPERIENCE
      ================================================= */}

      <section
        className="intro"
        id="experience"
      >

        <div className="section-number">

          01 / EXPERIENCE

        </div>


        <div className="intro-content">

          <div>

            <h2>

              MUSIC SHOULD
              <br />

              <span>
                FEEL PERSONAL.
              </span>

            </h2>

          </div>


          <div className="intro-right">

            <p>

              Your face tells a story.
              Moodify turns that expression
              into a personalized music journey.

            </p>


            <div className="intro-stat">

              <strong>01</strong>

              <span>

                LIVE
                <br />

                DETECTION

              </span>

            </div>


            <div className="intro-stat">

              <strong>02</strong>

              <span>

                MOOD
                <br />

                ANALYSIS

              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          RECOMMENDATIONS
      ================================================= */}

      <section className="recommendation-section">

        <div className="section-number">

          01.5 / YOUR RECOMMENDATION

        </div>


        <div className="recommendation-heading">

          <div>

            <p className="recommendation-small">

              {emotion
                ? `EXPRESSION DETECTED / ${emotion.toUpperCase()}`
                : "WAITING FOR EXPRESSION"}

            </p>


            <h2>

              {emotion
                ? currentRecommendation.title
                : "YOUR SOUND IS"}

              <br />

              <span>

                {emotion
                  ? "MADE FOR THIS MOMENT."
                  : "WAITING."}

              </span>

            </h2>

          </div>


          <p>

            {emotion
              ? currentRecommendation.subtitle
              : "Start the camera above and Moodify will create a recommendation based on the detected expression."}

          </p>

        </div>


        {/* =================================================
            SONG CARDS
        ================================================= */}

        <div className="song-grid">

          {currentRecommendation.songs.map(
            (song, index) => (

              <div
                className="song-card"
                key={song.title}
              >

                <div className="song-top">

                  <span>
                    0{index + 1}
                  </span>

                  <span>
                    {song.type}
                  </span>

                </div>


                <div className="song-icon">

                  {playingSong === song.title &&
                  isPlaying
                    ? "❚❚"
                    : "♫"}

                </div>


                <div className="song-info">

                  <h3>
                    {song.title}
                  </h3>

                  <p>
                    {song.artist}
                  </p>

                </div>


                <button
                  className="song-play"
                  onClick={() =>
                    toggleSong(song)
                  }
                >

                  {playingSong === song.title &&
                  isPlaying
                    ? "PAUSE"
                    : "PLAY"}

                  <span>↗</span>

                </button>

              </div>

            )
          )}

        </div>

      </section>


      {/* =================================================
          HOW IT WORKS
      ================================================= */}

      <section
        className="how-section"
        id="how"
      >

        <div className="section-number">

          02 / HOW IT WORKS

        </div>


        <h2>

          FROM EXPRESSION
          <br />

          <span>
            TO SOUND.
          </span>

        </h2>


        <div className="process-grid">

          <div className="process-card">

            <span>01</span>

            <div className="process-icon">
              ◉
            </div>

            <h3>
              SCAN
            </h3>

            <p>

              Allow Moodify to access your
              camera and detect your
              facial expression.

            </p>

          </div>


          <div className="process-card">

            <span>02</span>

            <div className="process-icon">
              ✦
            </div>

            <h3>
              UNDERSTAND
            </h3>

            <p>

              Our model estimates the
              expression visible in
              the camera feed.

            </p>

          </div>


          <div className="process-card dark-card">

            <span>03</span>

            <div className="process-icon">
              ♫
            </div>

            <h3>
              DISCOVER
            </h3>

            <p>

              Turn your detected mood
              into a personalized music
              recommendation.

            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          MOOD SECTION
      ================================================= */}

      <section className="mood-section">

        <div className="section-number">

          03 / YOUR SOUND

        </div>


        <div className="mood-heading">

          <h2>

            EVERY MOOD
            <br />

            HAS A <span>SOUND.</span>

          </h2>


          <p>

            Different moments.
            Different energy.
            One soundtrack made for you.

          </p>

        </div>


        <div className="mood-grid">

          <div className="mood-card happy">

            <span>01</span>

            <h3>
              HAPPY
            </h3>

            <p>
              Bright · Upbeat · Feel good
            </p>

            <div>
              ♫
            </div>

          </div>


          <div className="mood-card calm">

            <span>02</span>

            <h3>
              CALM
            </h3>

            <p>
              Soft · Ambient · Slow
            </p>

            <div>
              ♫
            </div>

          </div>


          <div className="mood-card energy">

            <span>03</span>

            <h3>
              ENERGY
            </h3>

            <p>
              Power · Rhythm · Motion
            </p>

            <div>
              ♫
            </div>

          </div>


          <div className="mood-card focus">

            <span>04</span>

            <h3>
              FOCUS
            </h3>

            <p>
              Deep · Minimal · Flow
            </p>

            <div>
              ♫
            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          ABOUT
      ================================================= */}

      <section
        className="about-section"
        id="about"
      >

        <div className="section-number">

          04 / ABOUT MOODIFY

        </div>


        <div className="about-content">

          <h2>

            TECHNOLOGY
            <br />

            <span>
              THAT LISTENS.
            </span>

          </h2>


          <p>

            Moodify combines computer vision
            and music recommendation to create
            a more personal way of discovering
            what to listen to.

          </p>

        </div>

      </section>


      {/* =================================================
          FINAL CTA
      ================================================= */}

      <section className="final-cta">

        <p>
          READY WHEN YOU ARE.
        </p>


        <h2>

          FIND YOUR
          <br />

          <span>
            SOUND.
          </span>

        </h2>


        <button
          onClick={scrollToExperience}
        >

          START EXPERIENCE ↗

        </button>

      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="footer">

        <span>
          MOODIFY®
        </span>

        <span>
          AI × MUSIC × EMOTION
        </span>

        <span>
          2026
        </span>

      </footer>

    </div>
  );
}

export default App;