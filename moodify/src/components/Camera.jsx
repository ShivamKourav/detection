import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

function Camera({ onEmotionChange }) {
  const videoRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [emotion, setEmotion] = useState("");
  const [captured, setCaptured] = useState(false);
  const [error, setError] = useState("");

  // ================= START CAMERA =================

  const startCamera = async () => {
    try {
      setError("");

      // Load models
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");

      setModelLoaded(true);

      // Open camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      videoRef.current.srcObject = stream;

      setCameraOn(true);
      setCaptured(false);
      setEmotion("");
      onEmotionChange("");
    } catch (err) {
      console.log(err);
      setError("Camera or face detection could not start.");
    }
  };

  // ================= DETECT EXPRESSION =================

  const detectExpression = async () => {
    if (
      !videoRef.current ||
      !cameraOn ||
      !modelLoaded ||
      captured
    ) {
      return;
    }

    const result = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 320,
          scoreThreshold: 0.5,
        })
      )
      .withFaceExpressions();

    if (!result) {
      setEmotion("");
      onEmotionChange("");
      return;
    }

    const expressions = result.expressions;

    const sortedExpressions = Object.entries(
      expressions
    ).sort((a, b) => b[1] - a[1]);

    const detectedEmotion = sortedExpressions[0][0];

    console.log(
      "Live Expression:",
      detectedEmotion
    );

    setEmotion(detectedEmotion);

    onEmotionChange(detectedEmotion);
  };

  // ================= CAPTURE MOOD =================

  const captureMood = async () => {
    if (!videoRef.current) {
      return;
    }

    try {
      setError("");

      const result = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320,
            scoreThreshold: 0.5,
          })
        )
        .withFaceExpressions();

      // No face found
      if (!result) {
        setError(
          "Face not detected. Please look at the camera."
        );
        return;
      }

      const expressions = result.expressions;

      const sortedExpressions = Object.entries(
        expressions
      ).sort((a, b) => b[1] - a[1]);

      const detectedEmotion = sortedExpressions[0][0];

      console.log(
        "CAPTURED EXPRESSION:",
        detectedEmotion
      );

      // Lock expression
      setEmotion(detectedEmotion);
      onEmotionChange(detectedEmotion);

      // Freeze detection
      setCaptured(true);

      // Stop camera
      if (videoRef.current.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());

        videoRef.current.srcObject = null;
      }

      setCameraOn(false);
    } catch (err) {
      console.log(err);
      setError("Could not capture your expression.");
    }
  };

  // ================= RESET =================

  const resetCamera = () => {
    setEmotion("");
    setCaptured(false);
    setCameraOn(false);
    setError("");

    onEmotionChange("");
  };

  // ================= LIVE DETECTION =================

  useEffect(() => {
    if (
      !cameraOn ||
      !modelLoaded ||
      captured
    ) {
      return;
    }

    const interval = setInterval(() => {
      detectExpression();
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [
    cameraOn,
    modelLoaded,
    captured,
  ]);

  // ================= CLEANUP =================

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="camera-component">

      {/* ================= CAMERA AREA ================= */}

      <div className="camera-video-area">

        {/* BEFORE CAMERA */}

        {!cameraOn && !captured && (
          <div className="camera-placeholder">

            <div className="camera-icon">
              ◉
            </div>

            <h3>
              READY TO DETECT
            </h3>

            <p>
              Allow camera access to discover
              your current mood.
            </p>

            <button
              className="camera-start-btn"
              onClick={startCamera}
            >
              START CAMERA ↗
            </button>

          </div>
        )}

        {/* CAMERA */}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`camera-video ${
            cameraOn ? "show-camera" : ""
          }`}
        />

        {/* LIVE CAMERA UI */}

        {cameraOn && !captured && (
          <>
            <div className="face-detection-box">

              <span className="scan-corner tl"></span>
              <span className="scan-corner tr"></span>
              <span className="scan-corner bl"></span>
              <span className="scan-corner br"></span>

            </div>

            <div className="camera-status">

              <span></span>

              {emotion
                ? `EXPRESSION: ${emotion.toUpperCase()}`
                : "SEARCHING FACE"}

            </div>

            {/* CAPTURE BUTTON */}

            <button
              className="capture-mood-btn"
              onClick={captureMood}
            >
              CAPTURE MY MOOD ↗
            </button>
          </>
        )}

        {/* CAPTURED STATE */}

        {captured && (
          <div className="captured-overlay">

            <div className="captured-icon">
              ✓
            </div>

            <p>
              MOOD CAPTURED
            </p>

            <h3>
              {emotion.toUpperCase()}
            </h3>

            <span>
              RECOMMENDATION LOCKED
            </span>

          </div>
        )}

      </div>

      {/* ================= EMOTION RESULT ================= */}

      {emotion && (
        <div className="emotion-result">

          <p>
            {captured
              ? "CAPTURED EXPRESSION"
              : "LIVE EXPRESSION"}
          </p>

          <h2>
            {emotion.toUpperCase()}
          </h2>

        </div>
      )}

      {/* ================= RESET BUTTON ================= */}

      {captured && (
        <button
          className="reset-camera-btn"
          onClick={resetCamera}
        >
          ↻ RESET & SCAN AGAIN
        </button>
      )}

      {/* ================= ERROR ================= */}

      {error && (
        <p className="camera-error">
          {error}
        </p>
      )}

    </div>
  );
}

export default Camera;