import React from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';

import { useRoute } from '@react-navigation/native';

export const getInitials = (email: string) => {
  if (!email) {
    return 'NA';
  } // Default initials
  const parts = email.split('@')[0].split('.');
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

const ChatHeader = () => {
  const route = useRoute<any>();
  const {friend} = route.params;

  return (
    <>
      <View style={styles.header}>
        <View style={[styles.avatarContainer, styles.chatHeader]}>
          {friend?.avatar ? (
            // Display the avatar image if available
            <Image source={{uri: friend?.avatar}} style={styles.avatarImage} />
          ) : (
            // Display initials if no avatar is available
            <Text style={styles.avatarText}>{getInitials(friend?.name)}</Text>
          )}
        </View>
        <Text style={styles.name}>{friend?.name?.split('@')[0]}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', // Align items horizontally
    justifyContent:'flex-start',
    alignItems:'center',
  },
  headerFriend: {
    alignItems: 'flex-start',
    color: '#000000',
  },
  chatHeader: {
    paddingVertical:10,
    marginRight: 10
  },
  headerText: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
  },
  avatarContainer: {
    borderRadius: 30,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  avatarImageHeader: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  avatarText: {
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  }
});

export default ChatHeader;
