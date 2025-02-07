import React, { useEffect, useState } from "react";
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, Button } from 'react-native';
import { Api } from "@/services/api";


// const videoSource = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
// const videoSource = "/video/74cf3789-fa47-4a40-9100-a0dc04694f3b.mp4";
const videoSource = "http://192.168.1.104:88/video/630be803-1fe1-483e-90ca-2ffad8a3cfa3.mp4";

export default function TicketScreen() {
  const [volume, setVolume] = useState(1);
// http://localhost:8001/api/v1/minio/file?file=15ddf394-696f-483b-975c-642adf731da1.jpg&bucket=images
    // const [video, setVideo] = useState<string>("http://localhost:88/video/74cf3789-fa47-4a40-9100-a0dc04694f3b.mp4")


    // const loadVideo= async () => {
    //     let res = await Api.get(video)
    //     .then(response => {
    //         console.log("load data from server");
    //         console.log(video);
    //         setVideo(response.data)
    //     })
    // }

    // useEffect(() => {
    //     loadVideo()
    // }, [])

    const player = useVideoPlayer(videoSource, player => {
        player.loop = true;
        player.play();
      });
    
    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

    const increaseVolume = () => {
      setVolume((oldVolume) => Math.min(oldVolume + 0.1, 1));
      player.volume = volume
    };
  
    const decreaseVolume = () => {
      setVolume((oldVolume) => Math.max(oldVolume - 0.1, 0));
      player.volume = volume
    };

    // return <></>
    return (
        <View style={styles.contentContainer}>
          <VideoView
            style={styles.video} 
            player={player} 
            allowsFullscreen 
            allowsPictureInPicture
            
          />
          <View style={styles.controlsContainer}>
            <Button title="Increase" onPress={increaseVolume} />
            <Button title="Decrease" onPress={decreaseVolume} />
            <Button 
              title={isPlaying ? 'Pause' : 'Play'}
              onPress={() => {
                if (isPlaying) {
                  player.pause();
                } else {
                  player.play();
                }
              }}
            />
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
      flex: 1,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 50,
    },
    video: {
      width: 350,
      height: 275,
    },
    controlsContainer: {
      padding: 10,
    },
});
