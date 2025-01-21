import React, { useEffect, useRef, useState } from "react";
import {ActivityIndicator, Alert, Text, Vibration, View, StyleSheet, TouchableOpacity} from 'react-native';
import { BarcodeScanningResult, Camera, CameraType, CameraView, useCameraPermissions, FlashMode, CameraPictureOptions, CameraCapturedPicture } from 'expo-camera';
import { VStack } from "@/components/VStack";
import { Button } from "@/components/Button";
import { Entypo } from "@expo/vector-icons"
import * as MediaLibrary from "expo-media-library";
import { Api } from "@/services/api";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


export default function ScanTicketScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanningEnabled, setScanningEnabled] = useState(true);
    const [facing, setFacing] = useState<CameraType>('back');
    const [flash, setFlash] = useState<FlashMode>('off');
    const [torch, setTorch] = useState<boolean>(false);
    const cameraRef = useRef<CameraView>(null);
    const [image, setImage] = useState<string | undefined>();
    const [uploading, setUploading] = useState(false);
	  const [images, setImages] = useState<any[]>([]);

    useEffect(() => {
       const saveImageToDevise = async () => {
        await saveImage()
       }
       saveImageToDevise()
    }, [image])
    
    if (!permission) {
        return <VStack flex={1} justifyContent='center' alignItems='center'>
            <ActivityIndicator size={"large"} />
        </VStack>;
    }

    if (!permission.granted) {
        return (
            <VStack gap={20} flex={1} justifyContent='center' alignItems='center'>
            <Text>Camera access is required to scan tickets.</Text>
            <Button onPress={requestPermission}>Allow Camera Access</Button>
            </VStack>
        );
    }

    async function onBarcodeScanned({ data }: BarcodeScanningResult) {
        Vibration.vibrate();
        setScanningEnabled(false);
        if (!scanningEnabled) return;
        console.log(data) 

        Alert.alert('Success', data, [
            { text: 'Ok', onPress: () => setScanningEnabled(true) },
          ]);
    
    }

    async function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    async function toogleFlash() {
      setFlash(flash == 'off' ? 'on' : 'off');
    }

    async function toogleTorch() {
      setTorch(torch ? false : true);
    }
 
    const uploadImage1 = async (filename: string | Blob, img: string | Blob) => {
      let formData = new FormData();
      formData.append("file", img);
      formData.append("bucket", 'images')
      formData.append("filename", filename)

      console.log("**************");
      

      let res = await fetch(`http://192.168.1.104:8001/api/v1/minio/file?backet=images`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      })

      let a = await res.json()
      console.log(a);

      // let res = await fetch(`http://192.168.1.104:8001/api/v1/minio/file?file=15ddf394-696f-483b-975c-642adf731da1.jpg&bucket=images`)
      // console.log(await res);
      
    };

    const takePicture = async () => {
      console.log('takePicture')
      if (cameraRef) {
        try {
          console.log('takePictureAcync')
          const data = await cameraRef.current?.takePictureAsync()
          console.log(data)
          if (data) {
            console.log('data is exist')
            setImage(data.uri)
            console.log('save image methood')
            // await saveImage()
            console.log('saved image finished')
          }        
        } catch (err) {
          console.log(err);          
        }
      }
    }

    const saveImage = async () => {
      console.log('saveImage start')
      console.log(image);
    
      if (image) {
        try {
          await MediaLibrary.createAssetAsync(image)
          alert('Picture save!')
        } catch (err) {
          console.error('Error creating asset', err);
        }
        return;
      }
    }

    async function takeAndUploadPhotoAsync() {
      console.log(123);
    }

    /////////////////////////////////////

    // Upload image to server
    const uploadImage = async (uri: string) => {
      setUploading(true);

      console.log('upload');
      console.log(uri);

      const formData = new FormData();
      formData.append("file", {
        uri,
        name: `image.jpg`,
        type: 'image/jpeg',
      } as any);

      try {
        const { data } = await Api.post('http://192.168.1.104:8001/api/v1/minio/file?bucket=mobile', formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        Alert.alert("Картинка загружена на сервер")
      } catch (err) {
        Alert.alert("Ошибка загрузки картинки на сервер");
        console.error(err);
      }
      // console.log(data);

      return
      
      
      await FileSystem.uploadAsync('http://192.168.1.104:8001/api/v1/minio/file?backet=images', uri, {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file'
      });

      setUploading(false);
    };

    // Delete image from file system
    const deleteImage = async (uri: string) => {
      await FileSystem.deleteAsync(uri);
      setImages(images.filter((i) => i !== uri));
    };

    // Select image from library or camera
	  const selectImage = async () => {
      let useLibrary = true
      let result;
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.75
      };

      if (useLibrary) {
        console.log(1);
        result = await ImagePicker.launchImageLibraryAsync(options);
      } else {
        console.log(2);
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync(options);
      }
        console.log(3);
      // Save image if not cancelled
      if (!result.canceled) {
        console.log(4);
        uploadImage(result.assets[0].uri);
      }
	  };
    /////////////////////////////////////

    return (
        <CameraView
          flash={flash}
          style={{ flex: 1 }}
          facing={facing}
          onBarcodeScanned={onBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          enableTorch={torch}
          ref={cameraRef}
        >
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                    {/* <Text style={styles.text}>Flip Camera</Text> */}
                    {/* arrows-rotate */}
                    <Entypo name="retweet" size={28} color={'red'}/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={toogleFlash}>
                    {/* <Text style={styles.text}>Flash</Text> */}
                    <Entypo name={'flash'} size={28} color={'green'}/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={toogleTorch}>
                    {/* <Text style={styles.text}>Flash</Text> */}
                    <Entypo name={'flashlight'} size={28} color={'yellow'}/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={takePicture}>
                    <Entypo name={'camera'} size={28} color={'pink'}/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={selectImage}>
                    <Entypo name={'upload'} size={28} color={'white'}/>
                </TouchableOpacity>
            </View>
        </CameraView>
      );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    message: {
      textAlign: 'center',
      paddingBottom: 10,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 64,
    },
    button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
  });
