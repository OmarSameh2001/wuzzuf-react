import React, { useState, useRef, useEffect } from 'react';
import { AxiosApi } from '../../services/Api';
import '../../styles/user/interview.css';
import { 
    FaCamera, 
    FaMicrophone, 
    FaVideo, 
    FaRedo, 
    FaPaperPlane, 
    FaExclamationCircle,
    FaCheckCircle,
    FaTrophy
  } from "react-icons/fa"
const VideoInterview = () => {
    const applicationId = 3; 
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions] = useState([
        "what is database , and what is the difference between SQL and No SQl databases?",
        "What have you learned in your IT career that makes you feel you are a very well candidate to join our company?",
    ]);
    const [interviewFinished, setInterviewFinished] = useState(false);
    const [interviewScore, setInterviewScore] = useState(null);
    const [error, setError] = useState('');
    const [stream, setStream] = useState(null);
    const [detailedScores, setDetailedScores] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [countdown, setCountdown] = useState(null)
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null)
    const [animateQuestion, setAnimateQuestion] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    // Camera setup
    useEffect(() => {
        async function startCamera() {
            try {
                const cameraStream = await navigator.mediaDevices.getUserMedia({ 
                    video: true, 
                    audio: true 
                });
                
                // Verify audio access
                const audioTracks = cameraStream.getAudioTracks();
                if (audioTracks.length === 0) {
                    setError('Microphone access is required!');
                    return;
                }
                
                videoRef.current.srcObject = cameraStream;
                setStream(cameraStream);
            } catch (err) {
                setError('Error accessing camera/microphone');
            }
        }

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        let timer
        if (countdown !== null && countdown > 0) {
          timer = setTimeout(() => setCountdown(countdown - 1), 1000)
        } else if (countdown === 0) {
          startRecording()
          setCountdown(null)
        }
    
        return () => {
          if (timer) clearTimeout(timer)
        }
      }, [countdown])
    
      const startCountdown = () => {
        setCountdown(3)
      }
      

    const startRecording = () => {
        if (!stream) {
            setError('No camera/microphone access');
            return;
        }
        setRecordedChunks([]);
        setVideoPreviewUrl(null)
        const mediaRecorder = new MediaRecorder(stream, { 
            mimeType: 'video/webm;codecs=vp9,opus' 
        });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                setRecordedChunks(prev => [...prev, event.data]);
            }
        };
        mediaRecorder.onstop = () => {
            console.log('Recording stopped.');
            setRecording(false);
            // Optional: you could create the blob here for preview or upload
            // const blob = new Blob(recordedChunks, { type: 'video/webm' });
        };
        mediaRecorder.start();
        setRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
            setRecording(false)
        }
    };

    const uploadVideo = async (videoBlob) => {
        setProcessing(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('video', videoBlob, `interview_${applicationId}.webm`);
            formData.append('question', questions[currentQuestionIndex]);
            formData.append('application_id', applicationId);
            
            const response = await AxiosApi.post(
                `applications/${applicationId}/submit_video/`,
                formData
            );
    
            setDetailedScores(response.data);
            setInterviewScore(response.data.total_score);
            
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setRecordedChunks([]);
                setVideoPreviewUrl(null)
            } else {
                setInterviewFinished(true);
            }
    
        } catch (error) {
            setError(error.response?.data?.error || error.message);
        } finally {
            setProcessing(false);
        }
    };

    const retryRecording = () => {
        setRecordedChunks([]);
        setVideoPreviewUrl(null)
        setRecording(false);
    };

    if (error) {
        return (
          <div className="container">
            <div className="alert alert-error animate-slide-in">
              <FaExclamationCircle className="alert-icon" />
              <div>
                <h4 className="alert-title">Error</h4>
                <p className="alert-description">{error}</p>
              </div>
            </div>
          </div>
        )
      }
    
      if (interviewFinished && interviewScore) {
        return (
          <div className="container">
            <div className="card animate-fade-in">
              <div className="card-header">
                <div className="trophy-container">
                  <FaTrophy className="trophy-icon" />
                </div>
                <h2 className="card-title">Interview Completed</h2>
                <p className="card-subtitle">Great job! Here's your performance summary</p>
              </div>
              <div className="card-content">
                <div className="score-grid">
                  <ScoreItem label="Answer Relevance" value={interviewScore.answer_score} />
                  <ScoreItem label="Pronunciation" value={interviewScore.pronunciation_score} />
                  <ScoreItem label="Eye Contact" value={interviewScore.eye_contact_score} />
                  <ScoreItem label="Attire" value={interviewScore.attire_score} />
                  <div className="total-score animate-scale-in">
                    <h3 className="total-score-title">Total Score</h3>
                    <div className="total-score-value">{interviewScore.total_score}%</div>
                    <div className="score-message">
                      {interviewScore.total_score >= 80
                        ? "Excellent! You did great in this interview."
                        : interviewScore.total_score >= 60
                          ? "Good job! You performed well in this interview."
                          : "Thanks for completing the interview. Keep practicing!"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    
      return (
        <div className="container">
          <div className="card animate-fade-in">
            <div className="card-header">
              <h2 className="card-title">Video Interview</h2>
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
    
            <div className="card-content">
              <div className={`question-container ${animateQuestion ? "animate-slide-in" : ""}`}>
                <h3 className="question-counter">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h3>
                <p className="question-text">{questions[currentQuestionIndex]}</p>
              </div>
    
              <div className="video-container">
                {videoPreviewUrl ? (
                  <video src={videoPreviewUrl} controls className="video-element animate-fade-in" />
                ) : (
                  <video ref={videoRef} autoPlay muted className="video-element" />
                )}
    
                {countdown !== null && (
                  <div className="countdown-overlay">
                    <span className="countdown-number animate-scale-pulse">{countdown}</span>
                  </div>
                )}
    
                {recording && (
                  <div className="recording-indicator">
                    <span className="recording-dot"></span>
                    <span className="recording-text">Recording</span>
                  </div>
                )}
    
                {showSuccessMessage && (
                  <div className="success-overlay animate-fade-in">
                    <div className="success-content animate-scale-in">
                      <FaCheckCircle className="success-icon" />
                      <p>Answer submitted successfully!</p>
                    </div>
                  </div>
                )}
    
                {processing && !showSuccessMessage && (
                  <div className="processing-overlay">
                    <div className="spinner"></div>
                    <p>Processing your answer...</p>
                  </div>
                )}
              </div>
    
              <div className="controls">
                {!recording && recordedChunks.length === 0 && (
                  <button
                    className="button primary-button animate-bounce-in"
                    onClick={startCountdown}
                    disabled={processing}
                  >
                    <FaCamera className="button-icon" />
                    <span>{processing ? "Processing..." : "Start Recording"}</span>
                  </button>
                )}
    
                {recording && (
                  <button className="button danger-button animate-bounce-in" onClick={stopRecording}>
                    <FaVideo className="button-icon" />
                    <span>Stop Recording</span>
                  </button>
                )}
    
                {recordedChunks.length > 0 && !recording && (
                  <div className="button-group animate-fade-in">
                    <button
                      className="button primary-button"
                      onClick={() => uploadVideo(new Blob(recordedChunks))}
                      disabled={processing}
                    >
                      <FaPaperPlane className="button-icon" />
                      <span>{processing ? "Submitting..." : "Submit Answer"}</span>
                    </button>
    
                    <button className="button secondary-button" onClick={retryRecording} disabled={processing}>
                      <FaRedo className="button-icon" />
                      <span>Record Again</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
    
            <div className="card-footer">
              <div className="mic-reminder">
                <FaMicrophone className="mic-icon" />
                <span>Make sure your microphone is working properly</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
    
    const ScoreItem = ({ label, value }) => {
      const [width, setWidth] = useState(0)
    
      useEffect(() => {
        // Animate progress bar after component mounts
        setTimeout(() => {
          setWidth(value)
        }, 300)
      }, [value])
    
      return (
        <div className="score-item animate-slide-in">
          <div className="score-header">
            <span className="score-label">{label}</span>
            <span className="score-value">{value}%</span>
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${width}%` }}></div>
          </div>
        </div>
      )
    }
    
export default VideoInterview;