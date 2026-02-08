import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';
import API_BASE_URL from '../config/api';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [connected, setConnected] = useState(false);
    const stompClientRef = useRef(null);

    // Derive WebSocket URL from API_BASE_URL
    // Assuming API_BASE_URL is like 'http://localhost:8080/api', we want 'http://localhost:8080/ws'
    const getWebSocketUrl = () => {
        try {
            // Remove '/api' suffix if present
            const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
            return `${baseUrl}/ws`;
        } catch (e) {
            return 'http://localhost:8080/ws';
        }
    };

    const connect = () => {
        // If already connected or connecting, skip
        if (stompClientRef.current && stompClientRef.current.active) return;

        const socketUrl = getWebSocketUrl();

        console.log('ChatContext: Connecting to WebSocket at', socketUrl);

        const client = new Client({
            // brokerURL: 'ws://localhost:8080/ws', // We use webSocketFactory for SockJS compatibility
            webSocketFactory: () => new SockJS(socketUrl),
            reconnectDelay: 5000, // Auto-reconnect
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('ChatContext: Connected to WebSocket');
                setConnected(true);
            },
            onStompError: (frame) => {
                console.error('ChatContext: Broker reported error: ' + frame.headers['message']);
                console.error('ChatContext: Additional details: ' + frame.body);
            },
            onWebSocketClose: () => {
                console.log('ChatContext: WebSocket closed');
                setConnected(false);
            },
            debug: (str) => {
                // console.log(str); // Uncomment for debugging
            }
        });

        client.activate();
        stompClientRef.current = client;
    };

    const disconnect = () => {
        if (stompClientRef.current) {
            stompClientRef.current.deactivate();
            stompClientRef.current = null;
            setConnected(false);
            console.log('ChatContext: Disconnected');
        }
    };

    useEffect(() => {
        if (user) {
            connect();
        } else {
            disconnect();
        }
        // Cleanup on unmount
        return () => disconnect();
    }, [user]);

    const subscribeToChat = (chatRoomId, callback) => {
        if (!stompClientRef.current || !connected) {
            console.warn('ChatContext: Cannot subscribe, not connected');
            return null;
        }

        // Assumed topic structure: /topic/chat/{roomId}
        // Verify this with backend logic if possible, but this is a standard convention.
        // If backend uses /user/queue/..., that requires authentication headers which STOMP handles.
        const destination = `/topic/chat/${chatRoomId}`;

        console.log(`ChatContext: Subscribing to ${destination}`);

        const subscription = stompClientRef.current.subscribe(destination, (message) => {
            if (message.body) {
                try {
                    const parsed = JSON.parse(message.body);
                    callback(parsed);
                } catch (e) {
                    console.error('ChatContext: Failed to parse message body', e);
                }
            }
        });

        return subscription;
    };

    const sendMessage = (chatRoomId, messagePayload) => {
        if (!stompClientRef.current || !connected) {
            console.warn('ChatContext: Cannot send message, not connected');
            return false;
        }

        // Backend expects: @MessageMapping("/chat.send/{chatRoomId}")
        // Which maps to: /app/chat.send/{chatRoomId}
        const destination = `/app/chat.send/${chatRoomId}`;

        const payload = {
            ...messagePayload,
            chatRoomId: chatRoomId
        };

        console.log('ChatContext: Sending message to', destination, payload);

        try {
            stompClientRef.current.publish({
                destination: destination,
                body: JSON.stringify(payload)
            });
            return true;
        } catch (e) {
            console.error('ChatContext: Send failed', e);
            return false;
        }
    };

    return (
        <ChatContext.Provider value={{ subscribeToChat, sendMessage, connected }}>
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;
