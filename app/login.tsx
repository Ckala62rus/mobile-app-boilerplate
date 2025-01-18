import { HStack } from "@/components/HStack";
import { Input } from "@/components/Input";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Text } from "@/components/Text";
import { VStack } from "@/components/VStack";
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { globals } from "@/styles/_global";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';


export default function Login() {
    const { authenticate, isLoadingAuth } = useAuth();

    const [authMode, setAuthMode] = useState<"login" | "register">('login');
    const [email, setEmail] = useState('admin2@mail.ru');
    const [password, setPassword] = useState('123123');

    async function onAuthenticate() {
        console.log('start2');
        // let a = await axios.get("http://192.168.1.104:5050/")
        // let a = await axios.get("https://jsonplaceholder.typicode.com/todos/1")
        // console.log(a);
        
        await authenticate(authMode, email, password);
    }
    
    function onToggleAuthMode() {
        setAuthMode(authMode === 'login' ? 'register' : 'login');
    }
    
    return (
        <>  
                
            <KeyboardAvoidingView behavior="padding" style={ globals.container }>
                <ScrollView contentContainerStyle={ globals.container }>
                
                    <VStack flex={ 1 } justifyContent='center' alignItems='center' p={ 40 } gap={ 40 }>

                        <HStack gap={ 10 }>
                            <Text fontSize={ 30 } bold mb={ 20 }>Ticket Booking</Text>
                            <TabBarIcon name="ticket" size={ 50 } />
                        </HStack >

                        <VStack w={ "100%" } gap={ 30 }>

                            <VStack gap={ 5 }>
                            <Text ml={ 10 } fontSize={ 14 } color="gray">Email</Text>
                            <Input
                                value={ email }
                                onChangeText={ setEmail }
                                placeholder="Email"
                                placeholderTextColor="darkgray"
                                autoCapitalize="none"
                                autoCorrect={ false }
                                h={ 48 }
                                p={ 14 }
                            />
                            </VStack>

                            <VStack gap={ 5 }>
                            <Text ml={ 10 } fontSize={ 14 } color="gray">Password</Text>
                            <Input
                                value={ password }
                                onChangeText={ setPassword }
                                secureTextEntry
                                placeholder="Password"
                                placeholderTextColor="darkgray"
                                autoCapitalize="none"
                                autoCorrect={ false }
                                h={ 48 }
                                p={ 14 }
                            />
                            </VStack>

                            <Button isLoading={ isLoadingAuth } onPress={ onAuthenticate }>{ authMode }</Button>

                        </VStack>

                        <Divider w={ "90%" } />

                        <Text fontSize={ 16 } underline>
                            { authMode === 'login' ? 'Register new account' : 'Login to account' }
                        </Text>
                    </VStack>
                    
                </ScrollView>
            </KeyboardAvoidingView >
            
        </>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'orange',
    },
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: 300,
    },
    button: {
      padding: 15,
      alignItems: 'center',
      borderRadius: 5,
    },
    text: {
      backgroundColor: 'transparent',
      fontSize: 15,
      color: '#fff',
    },
  });