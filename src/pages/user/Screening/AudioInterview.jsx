// import React, { useState, useRef, useEffect } from 'react';
// import { AxiosApi } from '../../../services/Api';

// const AudioInterview = () => { //{ applicationId }
//     const applicationId = 55; // Replace with actual application ID from props or context
//     const audioRef = useRef(null);
//     const mediaRecorderRef = useRef(null);
//     const [recording, setRecording] = useState(false);
//     const [recordedChunks, setRecordedChunks] = useState([]);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [questions] = useState([
//         "Tell me about yourself and why you want to join us.",
//         "What have you learned in your IT career that makes you feel you are a very well candidate to join our company?",
//     ]);
//     const [interviewFinished, setInterviewFinished] = useState(false);
//     const [interviewScore, setInterviewScore] = useState(null);
//     const [error, setError] = useState('');
//     const [stream, setStream] = useState(null);
//     const [detailedScores, setDetailedScores] = useState(null);
//     const [processing, setProcessing] = useState(false);

    
//   useEffect(() => {
//     async function startMicrophone() {
//       try {
//         const audioStream = await navigator.mediaDevices.getUserMedia({ 
//           audio: { 
//             noiseSuppression: true,  // Enable browser's built-in noise suppression
//             echoCancellation: true,
//             sampleRate: 44100,       // Higher sample rate for better quality
//             channelCount: 1
//           } 
//         });
//         setStream(audioStream);
//       } catch (err) {
//         setError('Microphone access required! Please allow microphone permissions.');
//       }
//     }
//     startMicrophone();
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, []);
//     const startRecording = () => {
//         if (!stream) {
//             setError('No microphone access. Please refresh and allow permissions.');
//             return;
//         }
        
//         const mediaRecorder = new MediaRecorder(stream);
//         mediaRecorderRef.current = mediaRecorder;
//         mediaRecorder.ondataavailable = (event) => {
//             if (event.data.size > 0) {
//                 setRecordedChunks(prev => [...prev, event.data]);
//             }
//         };
//         mediaRecorder.start();
//         setRecording(true);
//     };

//     const stopRecording = () => {
//         if (mediaRecorderRef.current?.state === 'recording') {
//             mediaRecorderRef.current.stop();
//             setRecording(false);
//         }
//     };

//     const uploadAudio = async (audioBlob) => {
//         setProcessing(true);
//         try {
//             const formData = new FormData();
//             formData.append('audio', audioBlob, `interview_${applicationId}.webm`);
//             formData.append('question', questions[currentQuestionIndex]);

//             const response = await AxiosApi.post(
//                 `applications/${applicationId}/submit_audio/`,
//                 formData,
//                 { headers: { 'Content-Type': 'multipart/form-data' } }
//             );

//             setDetailedScores(response.data);
//             setInterviewScore(response.data.total_score);
            
//             if (currentQuestionIndex < questions.length - 1) {
//                 setCurrentQuestionIndex(prev => prev + 1);
//                 setRecordedChunks([]);
//             } else {
//                 setInterviewFinished(true);
//             }
//         } catch (error) {
//             const backendError = error.response?.data?.detail || error.message;
//             setError(backendError || 'Audio processing failed');
//         } finally {
//             setProcessing(false);
//         }
//     };

//     const retryRecording = () => {
//         setRecordedChunks([]);
//         setRecording(false);
//     };

//     if (error) return <div>Error: {error}</div>;

//     if (interviewFinished && interviewScore) {
//         return (
//             <div>
//                 <h2>Interview Finished!</h2>
//                 <p>Your Total Score: {interviewScore.total_score?.toFixed(2) || 'N/A'}%</p>
//                 <div className="score-results">
//                     <h3>Detailed Analysis:</h3>
//                     <div className="score-grid">
//                         <div className="score-item">
//                             <span>Answer Relevance</span>
//                             <progress value={interviewScore.answer_score} max="100"></progress>
//                             <span>{interviewScore.answer_score}%</span>
//                         </div>
//                         <div className="score-item">
//                             <span>Pronunciation</span>
//                             <progress value={interviewScore.pronunciation_score} max="100"></progress>
//                             <span>{interviewScore.pronunciation_score}%</span>
//                         </div>
//                     </div>
//                     <div className="transcript">
//                         <h4>Transcript:</h4>
//                         <p>{interviewScore.transcript}</p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <h2>Audio Interview</h2>
//             {!interviewFinished && (
//                 <div>
//                     <p>Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex]}</p>
//                     <div>
//                         {!recording ? (
//                             <button onClick={startRecording} disabled={processing}>
//                                 {processing ? 'Processing...' : 'Start Recording'}
//                             </button>
//                         ) : (
//                             <button onClick={stopRecording}>Stop Recording</button>
//                         )}
//                         {recordedChunks.length > 0 && !recording && (
//                             <>
//                                 <button onClick={() => uploadAudio(new Blob(recordedChunks))}>
//                                     Submit Audio
//                                 </button>
//                                 <button onClick={retryRecording}>Retry</button>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
// export default AudioInterview;
// // import React, { useState, useRef, useEffect } from 'react';
// // import { AxiosApi } from '../../../services/Api';

// // const AudioInterview = () => {
// //   const [mediaRecorder, setMediaRecorder] = useState(null);
// //   const [recording, setRecording] = useState(false);
// //   const [recordedChunks, setRecordedChunks] = useState([]);
// //   const [interviewFinished, setInterviewFinished] = useState(false); // <-- define it
// //   const [processing, setProcessing] = useState(false);
// //   const [questions, setQuestions] = useState([
// //     "Tell us about yourself",
// //     "Why are you interested in this position?"
// //   ]);
// //   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
// //   const [error, setError] = useState('');

// //   const startRecording = async () => {
// //     try {
// //       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// //       const recorder = new MediaRecorder(stream);

// //       recorder.ondataavailable = (e) => {
// //         setRecordedChunks(prev => [...prev, e.data]);
// //       };

// //       recorder.start();
// //       setMediaRecorder(recorder);
// //       setRecording(true);
// //     } catch (err) {
// //       setError('Microphone access required!');
// //     }
// //   };

// //   const stopRecording = () => {
// //     if (mediaRecorder) {
// //       mediaRecorder.stop();
// //       setRecording(false);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Audio Interview</h2>
// //       {error && <p style={{ color: 'red' }}>{error}</p>}
// //       {!interviewFinished && (
// //         <div>
// //           <p>Current Question: {questions[currentQuestionIndex]}</p>
// //           <div>
// //             {!recording ? (
// //               <button onClick={startRecording}>
// //                 {processing ? 'Processing...' : 'Start Recording'}
// //               </button>
// //             ) : (
// //               <button onClick={stopRecording}>Stop Recording</button>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AudioInterview;
// import React, { useState, useRef, useEffect } from 'react';
// import { AxiosApi } from '../../../services/Api';

// const AudioInterview = ({ applicationId=55 }) => {
//     const [recording, setRecording] = useState(false);
//     const [audioURL, setAudioURL] = useState('');
//     const mediaRecorderRef = useRef(null);
//     const audioChunksRef = useRef([]);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [questions] = useState([
//         "Tell me about yourself and why you want to join us.",
//         "What have you learned in your IT career that makes you feel qualified?",
//     ]);
//     const [processing, setProcessing] = useState(false);
//     const [results, setResults] = useState(null);
//     const [audioBlob, setAudioBlob] = useState(null);
//     useEffect(() => {
//         navigator.mediaDevices.getUserMedia({ audio: true })
//             .then(stream => {
//                 mediaRecorderRef.current = new MediaRecorder(stream);
                
//                 mediaRecorderRef.current.ondataavailable = (e) => {
//                     if (e.data.size > 0) {
//                         audioChunksRef.current.push(e.data);
//                     }
//                 };

//                 mediaRecorderRef.current.onstop = async () => {
//                     const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
//                     // formData.append('audio', audioBlob, 'interview.webm'); 
//                     setAudioURL(URL.createObjectURL(audioBlob));
//                     setAudioBlob(audioBlob); 
//                     audioChunksRef.current = [];
//                 };
//             });
//     }, []);
//     console.log('mediaRecorderRef', mediaRecorderRef.current);
//     console.log('audioChunksRef', audioChunksRef.current);

//     const startRecording = () => {
//         mediaRecorderRef.current.start();
//         setRecording(true);
//     };

//     const stopRecording = () => {
//         mediaRecorderRef.current.stop();
//         setRecording(false);
//     };

//     const submitAudio = async () => {
//         if (!audioBlob) return;
        
//         setProcessing(true);
//         try {
//            // const audioBlob = await fetch(audioURL).then(r => r.blob());
//             const formData = new FormData();
//             formData.append('audio', audioBlob, `interview_${applicationId}.wav`);
//             formData.append('question', questions[currentQuestionIndex]);

//             const response = await AxiosApi.post(
//                 `applications/${applicationId}/submit_audio/`,
//                 formData,
//                 {
//                     headers: {
//                         'Content-Type': 'multipart/form-data'
//                     }
//                 }
//             );

//             setResults(response.data);
            
//             if (currentQuestionIndex < questions.length - 1) {
//                 setCurrentQuestionIndex(prev => prev + 1);
//                 setAudioURL('');
//                 setAudioBlob(null);
//             }
//         } catch (error) {
//             console.error('Submission error:', error);
//         }
//         setProcessing(false);
//     };

//     return (
//         <div>
//             <h2>Audio Interview</h2>
//             {!results ? (
//                 <div>
//                     <p>Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex]}</p>
                    
//                     <div className="audio-controls">
//                         {!recording ? (
//                             <button onClick={startRecording} disabled={processing}>
//                                 {processing ? 'Processing...' : 'Start Recording'}
//                             </button>
//                         ) : (
//                             <button onClick={stopRecording}>Stop Recording</button>
//                         )}
                        
//                         {audioURL && (
//                             <>
//                                 <audio controls src={audioURL} />
//                                 <button onClick={submitAudio}>Submit Answer</button>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             ) : (
//                 <div className="results">
//                     <h3>Analysis Results:</h3>
//                     <p>Pronunciation: {results.pronunciation_score}%</p>
//                     <p>Grammar: {results.grammar_score}%</p>
//                     <p>Answer Relevance: {results.answer_score}%</p>
//                     <p>Overall Score: {results.total_score}%</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AudioInterview;
import React, { useState, useRef, useEffect } from 'react';
import { AxiosApi } from '../../../services/Api';

const AudioInterview = ({ applicationId = 55 }) => {
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions] = useState([
        "Tell me about yourself and why you want to join us.",
        "What have you learned in your IT career that makes you feel qualified?",
    ]);
    const [processing, setProcessing] = useState(false);
    const [results, setResults] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: 'audio/webm' // make sure this is supported in your browser
            });

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

           mediaRecorderRef.current.onstop = () => {
    const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    setAudioURL(URL.createObjectURL(blob));
    setAudioBlob(blob); // ✅ Save it for submission
    audioChunksRef.current = [];
};
        });
    }, []);

    const startRecording = () => {
        setResults(null); // Reset previous result
        setAudioURL('');
        audioChunksRef.current = [];
        mediaRecorderRef.current.start();
        setRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setRecording(false);
    };

    const submitAudio = async () => {
        if (!audioBlob) {
            console.log("No audioBlob found.");
            return;
        }
        console.log("Submitting audio blob:", audioBlob);
        setProcessing(true);
        try {
            //const audioBlob = await fetch(audioURL).then((r) => r.blob());

            const formData = new FormData();
            formData.append('audio', audioBlob, `interview_${applicationId}.webm`);
            formData.append('question', questions[currentQuestionIndex]);

            const response = await AxiosApi.post(
                `applications/${applicationId}/submit_audio/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setResults(response.data);
            setAudioURL('');
            setAudioBlob(null); // reset


            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex((prev) => prev + 1);
                setAudioURL('');
            }
        } catch (error) {
            console.error('Submission error:', error);
        }

        setProcessing(false);
    };

    return (
        <div>
            <h2>Audio Interview</h2>
            {!results ? (
                <div>
                    <p>Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex]}</p>
                    <div className="audio-controls">
                        {!recording ? (
                            <button onClick={startRecording} disabled={processing}>
                                {processing ? 'Processing...' : 'Start Recording'}
                            </button>
                        ) : (
                            <button onClick={stopRecording}>Stop Recording</button>
                        )}

                        {audioURL && (
                            <>
                                <audio controls src={audioURL} />
                                <button onClick={submitAudio}>Submit Answer</button>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="results">
                    <h3>Analysis Results:</h3>
                    <p>Pronunciation: {results.pronunciation_score}%</p>
                    <p>Grammar: {results.grammar_score}%</p>
                    <p>Answer Relevance: {results.answer_score}%</p>
                    <p>Overall Score: {results.total_score}%</p>
                </div>
            )}
        </div>
    );
};

export default AudioInterview;
