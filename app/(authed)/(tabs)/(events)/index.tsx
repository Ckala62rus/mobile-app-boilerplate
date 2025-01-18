import React, { useEffect } from "react";
import {Text} from 'react-native';
import { router, useNavigation } from "expo-router"
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function EventScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Event Screen",
            headerRight: headerRight,
            headerBackVisible: true,
            // headerBackTitle: "www",
            headerBackButtonDisplayMode: 'default'
        });
    }, [navigation]);
          
    return (
            <>
                <Text>Events Screen index</Text>
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
