// import { Typography } from "@mui/material";
// import { useState } from "react";

// function Voice() {
//   const [voiceFile, setVoiceFile] = useState(null);
//   // Handle file upload
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       if (file.size <= 5 * 1024 * 1024) {
//         setVoiceFile(file);
//         console.log("Uploaded file:", file.name);
//       } else {
//         alert("File size must be less than 5MB");
//       }
//     }
//   };
//   return (
//     <>
//       {/* Question 3: Voice Input */}
//       <Typography variant="h6" gutterBottom>
//         Record your introduction (Audio file, max 5MB):
//       </Typography>
//       <input
//         type="file"
//         accept="audio/*"
//         onChange={handleFileChange}
//         style={{ marginBottom: 10 }}
//       />
//       {voiceFile && (
//         <Typography variant="body2">Uploaded: {voiceFile.name}</Typography>
//       )}
//     </>
//   );
// }

// export default Voice;
import React, { useState, useRef, useEffect } from 'react';
import { AxiosApi } from '../../../services/Api';

const AudioInterview = () => {
    const applicationId = 55; 
    const audioRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions] = useState([
        "Tell me about yourself and why you want to join us.",
        "What have you learned in your IT career that makes you feel you are a very well candidate to join our company?",
    ]);
    const [interviewFinished, setInterviewFinished] = useState(false);
    const [interviewScore, setInterviewScore] = useState(null);
    const [error, setError] = useState('');
    const [stream, setStream] = useState(null);
    const [detailedScores, setDetailedScores] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        async function startMicrophone() {
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                
                // Add audio track verification
                const audioTracks = audioStream.getAudioTracks();
                if (audioTracks.length === 0) {
                    setError('Microphone access is required! Please allow microphone permissions.');
                    return;
                }
                
                if (audioRef.current) {
                    audioRef.current.srcObject = audioStream;
                }
                setStream(audioStream);
                console.log("Microphone access granted.");
            } catch (err) {
                setError('Error accessing microphone.');
                console.error("Microphone access error:", err);
            }
        }

        startMicrophone();

        return () => {
            // Clean up the stream when the component unmounts
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startRecording = () => {
        if (!stream) {
            setError('No microphone access. Please refresh and allow permissions.');
            return;
        }
        
        // Initialize MediaRecorder with existing stream
        const mediaRecorder = new MediaRecorder(stream, { 
            mimeType: 'audio/webm' 
        });
        mediaRecorderRef.current = mediaRecorder;

        // Setup data handler
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                setRecordedChunks(prev => [...prev, event.data]);
            }
        };

        // Setup audio monitoring
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        
        microphone.connect(analyser);
        analyser.fftSize = 256;
        
        const checkAudioLevel = () => {
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);
            const avg = dataArray.reduce((a,b) => a+b)/dataArray.length;
            
            if (avg < 5) {
                setError('No audio detected - check your microphone!');
            } else if (avg < 15) {
                setError('Low audio input - speak louder!');
            } else {
                setError('');
            }
        };
        
        const interval = setInterval(checkAudioLevel, 500);
        
        // Start recording
        mediaRecorder.start();
        setRecording(true);

        // Cleanup on stop
        mediaRecorder.onstop = () => {
            clearInterval(interval);
            audioContext.close();
            setRecording(false);
        };
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
    };

    const uploadAudio = async (audioBlob) => {
        setProcessing(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, `interview_${applicationId}.webm`);
            formData.append('question', questions[currentQuestionIndex]);
    
            const response = await AxiosApi.post(
                `applications/${applicationId}/submit_audio/`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
    
            if (response.data.error) {
                throw new Error(response.data.error);
            }
    
            // Handle success case
            setDetailedScores(response.data);
            setInterviewScore(response.data.total_score);
            
            // Move to next question or finish
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setRecordedChunks([]);
            } else {
                setInterviewFinished(true);
            }
    
        } catch (error) {
            const backendError = error.response?.data?.detail || 
                               error.response?.data?.error || 
                               error.message;
            setError(backendError || 'Audio processing failed');
        } finally {
            setProcessing(false);
        }
    };

    const retryRecording = () => {
        setRecordedChunks([]);
        setRecording(false);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (interviewFinished && interviewScore) {
        return (
            <div>
                <h2>Interview Finished!</h2>
                <p>Thank you for completing the interview.</p>
                <h3>Your Score:</h3>
                <p>Answer Analysis Score: {interviewScore.answer_score ? interviewScore.answer_score.toFixed(2) : 'N/A'}</p>
                <p>Grammar & Vocabulary Score: {interviewScore.language_score ? interviewScore.language_score.toFixed(2) : 'N/A'}</p>
                <p>Pronunciation Score: {interviewScore.pronunciation_score ? interviewScore.pronunciation_score.toFixed(2) : 'N/A'}</p>
                <p>Total Score: {interviewScore.total_score ? interviewScore.total_score.toFixed(2) : 'N/A'}</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Interactive Audio Interview</h2>
            {!interviewFinished && (
                <div>
                    <p>Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex]}</p>
                    <audio ref={audioRef} controls style={{ display: 'none' }}></audio>
                    <div>
                        {!recording ? (
                            <button onClick={startRecording} disabled={processing}>
                                {processing ? 'Processing...' : 'Start Recording'}
                            </button>
                        ) : (
                            <button onClick={stopRecording} disabled={!recording}>Stop Recording</button>
                        )}
                        {recordedChunks.length > 0 && !recording && (
                            <button onClick={() => {
                                const blob = new Blob(recordedChunks, { type: 'audio/webm' });
                                uploadAudio(blob);
                            }}>
                                Submit Audio
                            </button>
                        )}
                        {recordedChunks.length > 0 && !recording && (
                            <button onClick={retryRecording}>Retry</button>
                        )}
                    </div>
                </div>
            )}
            {detailedScores && (
                <div className="score-results">
                    <h3>Detailed Analysis:</h3>
                    <div className="score-grid">
                        <div className="score-item">
                            <span>Answer Relevance</span>
                            <progress value={detailedScores.answer_score} max="100"></progress>
                            <span>{detailedScores.answer_score}%</span>
                        </div>
                        <div className="score-item">
                            <span>Pronunciation</span>
                            <progress value={detailedScores.pronunciation_score} max="100"></progress>
                            <span>{detailedScores.pronunciation_score}%</span>
                        </div>
                    </div>
                    <div className="total-score">
                        Total Score: {detailedScores.total_score}%
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudioInterview;
