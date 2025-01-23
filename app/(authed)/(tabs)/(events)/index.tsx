import React, { useEffect, useState } from "react";
import {ScrollView, Text, FlatList } from 'react-native';
import { router, useNavigation } from "expo-router"
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Image } from 'expo-image';
import { Api } from "@/services/api";
import { globals } from "@/styles/_global";
import { VStack } from "@/components/VStack";
import { Divider } from "@/components/Divider";

export default function EventScreen() {
    const navigation = useNavigation();
    const [images, setImages] = useState<string[]>([])
    const [isFetching, setIsFetching] = React.useState(false);

    const url = "http://192.168.1.104:8001/api/v1/minio/file?file=d71a7fdc-dd2f-47cd-acf1-9b90172b7fe6.jpg&bucket=images"
    const allFiles = "http://192.168.1.104:8001/api/v1/minio/files?bucket=mobile"

    const loadImages = async () => {
        let res = await Api.get(allFiles)
        .then(response => {
            console.log("load data from server");
            setImages(response.data)
        })
    }

    useEffect(() => {
        console.log("use effect start")
        loadImages();
    }, [])

    const onRefresh = async () => {
        setIsFetching(true)
        loadImages()
        console.log("refrash flat list")
        setIsFetching(false)
    }

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Event Screen",
            headerRight: headerRight,
            headerBackVisible: true,
            // headerBackTitle: "www",
            headerBackButtonDisplayMode: 'default'
        });
    }, [navigation]);
          
    // return (
    //         <>
    //         <ScrollView >
    //             <VStack 
    //                 flex={ 1 } 
    //                 justifyContent='center' 
    //                 alignItems='center' 
    //                 p={ 40 } 
    //                 gap={ 40 }
    //             >
    //                 <Text>Events Screen index</Text>
    //                 {images.map(img => {
    //                     console.log(`http://192.168.1.104:88/${img}&bucket=images`);
                        
    //                     return (
    //                         <>
    //                         <Image key={img} source={{uri: `http://192.168.1.104:88/${img}`}}
    //                             style={{width: 200, height: 200, marginBottom: 10}} />
    //                         {/* <Divider w={ "90%" } /> */}
    //                         </>
    //                     )
    //                 })}
    //                 {/* <Image source={{uri: "http://192.168.1.104:8001/api/v1/minio/file?file=d71a7fdc-dd2f-47cd-acf1-9b90172b7fe6.jpg&bucket=images"}}
    //                     style={{width: 400, height: 400}} /> */}
    //             </VStack>
    //         </ScrollView>
    //         </>
    //     )

    return (
        <FlatList
            data={images}
            onRefresh={onRefresh}
            refreshing={isFetching}
            renderItem={
                ({ item }) => (
                    <VStack 
                        flex={ 1 } 
                        justifyContent='center' 
                        alignItems='center' 
                        p={ 40 } 
                        gap={ 40 }
                    >
                    <Image
                        key={item}
                        source={{ uri: `http://192.168.1.104:88/${item}` }}
                        style={{ width: 200, height: 200, marginBottom: 10 }}
                    />
                    </VStack>
                )
            }
        />
    )
}

const headerRight = () => {
    return (
        <TabBarIcon
            color="#007bff"  // blue color for this icon
            size={32} 
            name="add-circle-outline" 
            onPress={() => router.push('/(authed)/(tabs)/(events)/new')} 
        />
    );
};
