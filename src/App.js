import React, { useState, useRef, useEffect } from "react";

const audios = [
  { id: 1, src: "background.mp3", label: "KBC Starting Background" },
  { id: 2, src: "buzzer.mp3", label: "KBC Ending Buzzer" },
  { id: 3, src: "choose candidate to play (loop).mp3", label: "Choose candidate to play (loop)" },
  { id: 4, src: "choose candidate to play end.mp3", label: "Choose candidate to play end" },
  { id: 5, src: "kbc-question.mp3", label: "Question" },
  { id: 6, src: "question-background.mp3", label: "Question Background" },
  { id: 7, src: "30.mp3", label: "Timer - 30 seconds" },
  { id: 8, src: "60.mp3", label: "Timer - 60 seconds" },
  { id: 9, src: "90.mp3", label: "Timer - 90 seconds" },
  { id: 10, src: "120.mp3", label: "Timer - 120 seconds" },
  { id: 11, src: "option lock.mp3", label: "Option Lock" },
  { id: 12, src: "correct answer.mp3", label: "Correct Answer" },
  { id: 13, src: "wrong answer.mp3", label: "Wrong Answer" },
  
];

function AudioPlayer({ src, label }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Toggle play/pause state
  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Reset audio to start
  const resetAudio = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  // Toggle looping
  const toggleLoop = () => {
    setIsLooping((prev) => !prev);
    audioRef.current.loop = !audioRef.current.loop;
  };

  // Update current time and duration
  useEffect(() => {
    const audio = audioRef.current;

    // Set duration when metadata is loaded
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    // Update current time as the audio plays
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    // Handle audio end to reset state when loop is off
    const handleAudioEnd = () => {
      if (!audio.loop) {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleAudioEnd);

    // Clean up event listeners
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleAudioEnd);
    };
  }, []);

  // Format time in mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded shadow">
      <div className="text-sm font-medium text-gray-700 mb-2">{label}</div>
      <div className="flex items-center space-x-2">
        <audio ref={audioRef} src={src} loop={isLooping} className="w-full">
          Your browser does not support the audio element.
        </audio>
        <button
          onClick={togglePlayPause}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={resetAudio}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset
        </button>
        <button
          onClick={toggleLoop}
          className={`px-3 py-1 rounded ${
            isLooping ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
        >
          {isLooping ? "Loop On" : "Loop Off"}
        </button>
      </div>
      <div className="text-sm text-gray-600 mt-2">
        <span>Current Time: {formatTime(currentTime)} / </span>
        <span>Total Duration: {formatTime(duration)}</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">KBC Background Audio</h1>
      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
        {audios.map((audio) => (
          <AudioPlayer key={audio.id} src={audio.src} label={audio.label} />
        ))}
      </div>
    </div>
  );
}

export default App;
