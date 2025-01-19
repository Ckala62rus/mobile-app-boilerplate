import React, { useState } from "react";
import {ActivityIndicator, Alert, Text, Vibration, View, StyleSheet, TouchableOpacity} from 'react-native';
import { BarcodeScanningResult, Camera, CameraType, CameraView, useCameraPermissions, FlashMode } from 'expo-camera';
import { VStack } from "@/components/VStack";
import { Button } from "@/components/Button";
import { Entypo } from "@expo/vector-icons"
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


export default function ScanTicketScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanningEnabled, setScanningEnabled] = useState(true);
    const [facing, setFacing] = useState<CameraType>('back');
    const [flash, setFlash] = useState<FlashMode>('off');
    const [torch, setTorch] = useState<boolean>(false);

    
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
        >
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                    {/* <Text style={styles.text}>Flip Camera</Text> */}
                    {/* arrows-rotate */}
                    <Entypo name="retweet" size={28} color={'red'}/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={toogleFlash}>
                    {/* <Text style={styles.text}>Flash</Text> */}
                    <Entypo name={'flash'} size={28} color={'red'}/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={toogleTorch}>
                    {/* <Text style={styles.text}>Flash</Text> */}
                    <Entypo name={'flashlight'} size={28} color={'red'}/>
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