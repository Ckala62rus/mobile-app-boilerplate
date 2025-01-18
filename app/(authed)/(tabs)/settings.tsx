import { Button } from "@/components/Button"
import { VStack } from "@/components/VStack"
import { HStack } from "@/components/HStack"
import { Api } from "@/services/api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router, useNavigation } from "expo-router"
import React, { useEffect } from "react"
import { Text } from "@/components/Text"
import { TabBarIcon } from "@/components/navigation/TabBarIcon"
import { BackHandler } from "react-native"


export default function SettingsScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
          headerTitle: "Settings Screen",
          headerRight: headerRight,
          headerBackVisible: true,
        //   headerBackTitle: "www",
          headerBackButtonDisplayMode: 'default'
        });
      }, [navigation]);

    // return <Button onPress={() => {Alert.alert("Hello world!!!")}}>Go to Tickets page</Button>
    return ( 
        <>
            <VStack flex={1} p={30} pb={0} justifyContent="center"  gap={20}>
                <HStack justifyContent="space-between" alignItems="center">
                    <Text >Settings Screen</Text>
                    <Text >Settings Screen</Text>
                </HStack>

                <VStack>
                        <Button mt={20} variant="outlined" onPress={async () => {
                            try { 
                                let a = await Api.get('http://192.168.1.104:8001/api/v1/user/me')
                                console.log(a)
                            } catch (e) {
                                console.log(e)
                                // Alert.alert("Error", "Failed to log out")
                                return;
                            }
                            
                            console.log("press Go to Tickets page");
                        }}>Go to Tickets page</Button>

                        {/* <Button variant="outlined" mt={20}  onPress={async () => {
                            let a = await AsyncStorage.getAllKeys()
                            console.log(a);
                            await AsyncStorage.clear()
                            router.replace('/login')
                        }}>Login page</Button> */}

                        <Button variant="outlined" mt={20}  onPress={async () => {
                            try {
                                let a = await Api.post('/user/logout')
                                console.log(a);
                            } finally {
                                await AsyncStorage.clear()
                                router.replace('/login')
                            }
                        }}>Logout</Button>
                    </VStack>
                
            </VStack>
        </>
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
