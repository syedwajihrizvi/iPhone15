import React, { useEffect, useRef, useState } from "react"
import { hightlightsSlides } from "../constants"
import gsap from "gsap";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger)

function VideoCarousel() {
    const videoRef = useRef([]) // Refers to the video
    const videoSpanRef = useRef([]) // Refers to the video representation within the toggler
    const videoDivRef = useRef([]) // Refers to the toggler

    // The current state of whichever video is playing
    const [video, setVideo ] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false
    })

    const [loadedData, setLoadedData] = useState([]) // state of videos that have been played
    const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video

    useEffect(() => {
        if (loadedData.length > 3) {
            if (!isPlaying) {
                videoRef.current[videoId].pause()
            } else {
                startPlay && videoRef.current[videoId].play()
            }
        }
    }, [startPlay, videoId, isPlaying, loadedData])

    const handleLoadedMetaData = (i, e) => setLoadedData(pre => [...pre, e])

    useGSAP(() => {
        gsap.to('#slider', {
            transform: `translateX(${-100 * videoId}%)`,
            duration: 2,
            ease: 'power2.inOut'
        })
        gsap.to('#video', {
            scrollTrigger: {
                trigger: '#video',
                toggleActions: 'restart none none none'
            },
            onComplete: () => {
                setVideo(preVideo => ({
                    ...preVideo,
                    startPlay: true,
                    isPlaying: true
                }))
            }
        })
    }, [isEnd, videoId])

    useEffect(() => {
        let currentProgress = 0
        let span = videoSpanRef.current
        let div = videoDivRef.current
        if (span[videoId]) {
            // animate the progress of the video
            let anim = gsap.to(span[videoId], {
                onUpdate: () => {
                    const progress = Math.ceil(anim.progress() * 100)

                    if (progress != currentProgress)
                        currentProgress = progress

                    gsap.to(div[videoId], {
                        width: 
                            window.innerWidth < 760 ? 
                            '10vw': window.innerWidth < 1200 ? 
                            '10vw' : '4vw'
                    })

                    gsap.to(span[videoId], {
                        width: `${currentProgress}%`,
                        backgroundColor: 'white',
                    })
                },
                onComplete: () => {
                    if (isPlaying) {
                        gsap.to(videoDivRef.current[videoId], {
                            width: '12px'
                        })
                        gsap.to(span[videoId], {
                            backgroundColor: '#afafaf'
                        })
                    }
                }
            })
            if (videoId == 0) {
                anim.restart()
            }

            const animUpdate = () => {
                if (videoRef.current[videoId])
                    anim.progress(videoRef.current[videoId].currentTime / hightlightsSlides[videoId].videoDuration)
            }
            if (isPlaying) {
                gsap.ticker.add(animUpdate)
            } else {
                gsap.ticker.remove(animUpdate)
            }
        }

    }, [videoId, startPlay])

    const handleProcess = (type, i) => {
        switch (type) {
            case 'video-end':
                setVideo((prevVideo) => ({
                    ...prevVideo, isEnd: true,
                    videoId: i + 1
                }))
                break;
            case 'video-last':
                setVideo((prevVideo) => ({
                    ...prevVideo, isLastVideo: true
                }))
                break
            case 'video-reset':
                setVideo((prevVideo) => ({
                    ...prevVideo, isLastVideo: false,
                    videoId: 0
                }))
                break
            case 'play':
                setVideo((prevVideo) => ({
                    ...prevVideo, isPlaying: !prevVideo.isPlaying,
                }))
                break
            case 'pause':
                setVideo((prevVideo) => ({
                    ...prevVideo, isPlaying: !prevVideo.isPlaying,
                }))
                break
            case 'change-video':
                setVideo({
                    isEnd: false,
                    startPlay: false,
                    videoId: i,
                    isLastVideo: false,
                    isPlaying: false
                })
            default:
                return video
        }
    }

    return (
        <>
            <div className="flex items-center">
                {hightlightsSlides.map((list, index) => (
                    <div key={list.id} id="slider" className="sm:pr-20 pr-10">
                        <div className="video-carousel_container">
                            <div 
                            className="w-full h-full flex-center 
                            rounded-3xl overflow-hidden bg-black">
                                <video id='video' playsInline={true} 
                                       preload='auto' muted
                                       ref={(element) => (videoRef.current[index] = element)}
                                       onPlay={() => {
                                            setVideo((prevVideo) => ({
                                                ...prevVideo, isPlaying: true
                                            }))
                                       }}
                                       onLoadedMetadata={(e) => handleLoadedMetaData(index, e)}
                                       onEnded={() =>
                                        index !== 3 
                                            ? handleProcess('video-end', index) : 
                                            handleProcess('video-last')
                                       }>
                                    <source src={list.video} type="video/mp4"/>
                                </video>
                            </div>
                            <div className="absolute top-12 left-[5%] z-10">
                                {list.textLists.map((text) => (
                                    <p key={text} className="md:text-2xl text-xl font-medium">{text}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="relative flex-center mt-10">
                <div 
                 className="flex-center py-5 px-7
                 bg-gray-300 backdrop-blur rounded-full">
                    {videoRef.current.map((_, i) => (
                        <span 
                            key={i} ref={(el) => (videoDivRef.current[i] = el)}
                            className="mx-2 w-3 h-3 bg-gray-200 
                                       rounded-full relative cursor-pointer">
                            <span 
                            className="absolute h-full w-full rounded-full"
                            ref={(el) => (videoSpanRef.current[i] = el)}
                            onClick={() => setVideo((prevVideo) => ({
                                isEnd: false,
                                startPlay: false,
                                videoId: i,
                                isLastVideo: false,
                                isPlaying: false
                            }))}/>
                        </span>
                    ))}
                 </div>
                 <button className="control-btn">
                    <img src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg} 
                    alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'} 
                    onClick={
                        isLastVideo ? () => handleProcess('video-reset') : 
                        !isPlaying ? () => handleProcess('play') : 
                        () => handleProcess('pause')}/>
                 </button>
            </div>
        </>
    )
}

export default VideoCarousel