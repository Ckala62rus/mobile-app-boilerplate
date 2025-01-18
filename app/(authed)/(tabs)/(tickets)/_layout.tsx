import { Stack } from "expo-router";

export default function TicketLayout() {
    return (
        <Stack screenOptions={{ headerBackTitle: "Ticket" }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="ticket/[id]" />
        </Stack>
    )
}