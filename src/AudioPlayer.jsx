import React, { useState, useEffect, useRef } from "react";
import AudioControls from "./AudioControls";
import Backdrop from "./Backdrop";
import "./styles.css";


const AudioPlayer = ({ tracks }) => {
  // State
  const [trackIndex, setTrackIndex] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState([])
  const [timearr,setTimearr]= useState({})

  // Destructure for conciseness
  const { title, artist, color, image, audioSrc } = tracks[trackIndex];

  // Refs
  const audioRef = useRef(new Audio(audioSrc));
  const intervalRef = useRef();
  const isReady = useRef(false);

  // Stopwatch
  const changeTime = (timestamp,type,title) =>{
    setTime(current=>[...current, {timestamp,type,title}])
  }
  










  // Destructure for conciseness
  const { duration } = audioRef.current;

  const currentPercentage = duration
    ? `${(trackProgress / duration) * 100}%`
    : "0%";
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        toNextTrack();
        // console.log(title);
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  };

  const onScrub = (value) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  };

  const onScrubEnd = () => {
    // If not already playing, start
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };

  const toPrevTrack = () => {
    if (trackIndex - 1 < 0) {
      setTrackIndex(tracks.length - 1);
    } else {
      setTrackIndex(trackIndex - 1);
    }
  };



  const Stop = ()=>{
    // setIsPlaying=false
    console.log(time.slice(1));

    // arr.forEach((item, id) => {
    //   console.log(arr[id]);
    //  });
    let arr=time.slice(1)
    let temp={}
    for (let i = 0; i < arr.length - 1; i++) { //ending loop before last element
        if (arr[i].type==='start') {
          if(arr[i+1].type==='end'){
            let duration = (arr[i+1].timestamp - arr[i].timestamp)/1000;
            console.log(duration,':',arr[i].title);
            if(temp[arr[i].title])
                  {
                      temp[arr[i].title] += duration
                      
                  }
                  else{
                      temp[arr[i].title] = duration
                      
                  }
          }
        }
        if (arr[i].type==='start') {
          if(arr[i+1].type==='change'){
            let duration = (arr[i+1].timestamp - arr[i].timestamp)/1000;
            console.log(duration,':',arr[i].title);
            if(temp[arr[i].title])
                  {
                      temp[arr[i].title] += duration
                      
                  }
                  else{
                      temp[arr[i].title] = duration
                      
                  }
          }
        }
        if (arr[i].type==='change') {
          if(arr[i+1].type==='end'){
            let duration = (arr[i+1].timestamp - arr[i].timestamp)/1000;
            console.log(duration,':',arr[i].title);
            if(temp[arr[i].title])
                  {
                      temp[arr[i].title] += duration
                      
                  }
                  else{
                      temp[arr[i].title] = duration
                      
                  }
          }
        }
        if (arr[i].type==='change') {
          if(arr[i+1].type==='change'){
            let duration = (arr[i+1].timestamp - arr[i].timestamp)/1000;
            console.log(duration,':',arr[i].title);
            if(temp[arr[i].title])
                  {
                      temp[arr[i].title] += duration
                      
                  }
                  else{
                      temp[arr[i].title] = duration
                      
                  }
          }
        }
        setTimearr(temp)
  }
  }

const handleExit=()=>{
  console.log(timearr);
}



  const toNextTrack = () => {
    if (trackIndex < tracks.length - 1) {
      setTrackIndex(trackIndex + 1);
      console.log(tracks[trackIndex + 1].title);
      let date = new Date()
      let sec=date.getTime()
      changeTime(sec,'change',tracks[trackIndex + 1].title)

    } else {
      setTrackIndex(0);
      console.log(tracks[0].title);
      let date = new Date()
      let sec=date.getTime()
      changeTime(sec,'change',tracks[0].title)
      // console.log(time);
      // console.log(Date.getHours());
    }
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      //console.log(audioRef.current.currentTime);
      console.log(title);
      startTimer();
      let date = new Date()
      let sec=date.getTime()
      changeTime(sec,'start',title)
    } else {
      audioRef.current.pause();
      let date = new Date()
      let sec=date.getTime()
      changeTime(sec,'end',title)
      // console.log(audioRef.current.currentTime);
      
    } //console.log(time.slice(1));
  }, [isPlaying]);

  // Handles cleanup and setup when changing tracks
  useEffect(() => {
    audioRef.current.pause();

    audioRef.current = new Audio(audioSrc);
    setTrackProgress(audioRef.current.currentTime);

    if (isReady.current) {
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    } else {
      // Set the isReady ref as true for the next pass
      isReady.current = true;
    }
  }, [trackIndex]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="audio-player">
      <div className="track-info">
        <img
          className="artwork"
          src={image}
          alt={`track artwork for ${title} by ${artist}`}
        />
        <h2 className="title">{title}</h2>
        <h3 className="artist">{artist}</h3>
        <button type="button" onClick={Stop}>stop</button>
        <button type="button" onClick={handleExit}>exit</button>
        <AudioControls
          isPlaying={isPlaying}
          onPrevClick={toPrevTrack}
          onNextClick={toNextTrack}
          onPlayPauseClick={setIsPlaying}
        />
        <input
          type="range"
          value={trackProgress}
          step="1"
          min="0"
          max={duration ? duration : `${duration}`}
          className="progress"
          onChange={(e) => onScrub(e.target.value)}
          onMouseUp={onScrubEnd}
          onKeyUp={onScrubEnd}
          style={{ background: trackStyling }}
        />
      </div>
      <Backdrop
        trackIndex={trackIndex}
        activeColor={color}
        isPlaying={isPlaying}
      />
    </div>
  );
};

export default AudioPlayer;
