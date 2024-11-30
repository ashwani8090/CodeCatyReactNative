import {
  collection,
  addDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat, InputToolbar} from 'react-native-gifted-chat';

import {db} from '@config/firebase';

export function Chat(props: any) {
  const [messages, setMessages] = useState([]);
  const {user, friend} = props?.route?.params ?? {};
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [friendIsTyping, setFriendIsTyping] = useState(false); // Track friend's typing state

  // Ensure the conversation exists
  useEffect(() => {
    const ensureConversation = async () => {
      try {
        const conversationsRef = collection(db, 'conversations');
        const q = query(
          conversationsRef,
          where('participants', 'array-contains', user.id),
        );
        const snapshot = await getDocs(q);
        const conversation = snapshot.docs.find(doc =>
          doc.data().participants.includes(friend.id),
        );

        if (conversation) {
          setConversationId(conversation.id);
        } else {
          const newConversationRef = await addDoc(conversationsRef, {
            participants: [user.id, friend.id],
            isTyping: {[user.id]: false, [friend.id]: false},
            lastMessage: null,
          });
          setConversationId(newConversationRef.id);
        }
      } catch (error) {
        console.error('Error ensuring conversation:', error);
      }
    };

    ensureConversation();
  }, [user?.id, friend?.id]);

  // Fetch messages and mark unseen messages as seen
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = () => {
      const messagesRef = collection(
        db,
        `conversations/${conversationId}/messages`,
      );
      const q = query(messagesRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, querySnapshot => {
        const urlRegex =
          /(https?:\/\/[^\s]+|data:image\/[a-zA-Z]+;base64,[^\s]+)/g; // Match http/https or data:image URLs

        const newMessages: any = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const text = data.text || '';
          const urls = text.match(urlRegex); // Extract URLs including data:image

          return {
            _id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate(),
            image: urls ? urls[0] : null, // Add the first URL or data:image as an image (if exists)
          };
        });

        updateDoc(doc(db, 'conversations', conversationId), {
          lastMessage: newMessages[0].text,
          [`unseen.${user.id}`]: false,
        });
        setMessages(newMessages);
      });

      return unsubscribe;
    };

    const fetchIsTyping = () => {
      const conversationRef = doc(db, 'conversations', conversationId);

      const unsubscribe = onSnapshot(conversationRef, docSnapshot => {
        const data = docSnapshot.data();
        if (data?.isTyping) {
          setFriendIsTyping(data.isTyping[friend.id] || false); // Update friend's typing state
        }
      });

      return unsubscribe;
    };

    const unsubscribeMessages = fetchMessages();
    const unsubscribeTyping = fetchIsTyping();

    return () => {
      unsubscribeMessages();
      unsubscribeTyping();
    };
  }, [conversationId, friend.id, user.id]);

  // Send a new message
  const onSend = useCallback(
    async (newMessages: any) => {
      if (!conversationId) return;

      try {
        const messagesRef = collection(
          db,
          `conversations/${conversationId}/messages`,
        );
        const writes = newMessages.map((msg: any) =>
          addDoc(messagesRef, {
            text: msg.text,
            createdAt: new Date(),
            senderId: user.id,
            receiverId: friend.id,
            seen: false, // New messages are initially unseen
            user: {...user, id: user.id, name: user.name, avatar: user.avatar},
          }),
        );

        await Promise.all([
          ...writes,
          updateDoc(doc(db, 'conversations', conversationId), {
            lastMessage: newMessages[0].text,
            [`unseen.${friend.id}`]: true,
            senderId: user.id,
          }),
        ]);
        /**
         * uncomment when added backend for sending notification
         *  await fetch('api-base-url/send-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipientToken: friend.fcmToken,
            message: newMessages[0].text,
            title: user.name.split('@')?.[0],
          }),
        });
         */

        console.info('user: ', friend);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    [conversationId, user, friend],
  );

  // Handle typing state
  const handleInputChange = async (text: string) => {
    if (!conversationId) return;

    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
      await updateDoc(doc(db, 'conversations', conversationId), {
        [`isTyping.${user.id}`]: true,
      });
    } else if (text.length === 0 && isTyping) {
      setIsTyping(false);
      await updateDoc(doc(db, 'conversations', conversationId), {
        [`isTyping.${user.id}`]: false,
      });
    }
  };

  // Handle input blur (keyboard dismissed)
  const handleInputBlur = async () => {
    if (!conversationId) return;

    setIsTyping(false);
    await updateDoc(doc(db, 'conversations', conversationId), {
      [`isTyping.${user.id}`]: false,
    });
  };

  return (
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{...user}}
        isTyping={friendIsTyping}
        showUserAvatar
        onInputTextChanged={handleInputChange}
        textInputProps={{
          onBlur: handleInputBlur,
        }}
        messagesContainerStyle={{
          backgroundColor: '#fff',
        }}
        renderInputToolbar={props => (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: '#b3e6ff',
              borderRadius: 30,
              marginBottom: 10,
              margin: 10,
            }}
          />
        )}
      />
  );
}
