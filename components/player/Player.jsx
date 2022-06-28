/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import useSpotify from "../../hooks/useSpotify";
import useSongInfo from "../../hooks/useSongInfo";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../../atoms/songAtom";
import {
  SwitchHorizontalIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import {
  RewindIcon,
  PauseIcon,
  FastForwardIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";

function Player() {
  const spotifyApi = useSpotify();
  const songInfo = useSongInfo();
  const { data: session, status } = useSession();

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackId, spotifyApi, session]);

  useEffect(() => {
    if(volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[volume])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume);
    }, 500),
    []
  )

  return (
    <div className="h-20 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album?.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon className="button" />

        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button h-10 w-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button h-10 w-10" />
        )}

        <FastForwardIcon className="button" />
        <ReplyIcon className="button" />
      </div>

      {/* Right */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon onClick={() => volume > 0 && setVolume(volume - 10)} className="button" />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <VolumeUpIcon onClick={() => volume < 100 && setVolume(volume + 10)} className="button" />
      </div>
    </div>
  );
}

export default Player;
