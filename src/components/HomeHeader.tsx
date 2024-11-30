import React, {useContext} from 'react';
import {Image, StyleSheet, TouchableOpacity, View, Text} from 'react-native';

import {AuthContext} from '../contexts/AuthProvider';

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

const HomeHeader = () => {
  const {user, onLogout} = useContext(AuthContext);
  return (
    <>
      <View style={styles.header}>
        <View style={[styles.avatarContainer]}>
          {(user as any)?.avatar ? (
            <Image
              source={{uri: (user as any)?.avatar}}
              style={styles.avatarImageHeader}
            />
          ) : (
            // Display the avatar image if available
            // Display initials if no avatar is available
            <Text style={styles.avatarText}>
              {getInitials((user as any).email)}
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  header: {
    flexDirection: 'row', // Align items horizontally
    justifyContent: 'space-between', // Space between title and logout
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#ffffff',

  },
  logoutButton: {
    backgroundColor: '#66b3ff', // Purple button
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerFriend: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    color: '#000000',
  },
  backButton: {
    marginRight: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#87CEEB',
  },
  backButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
  },
  list: {
    padding: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    height: 80,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarImageHeader: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  avatarText: {
    color: '#ffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    color: '#000',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#bbb',
    fontWeight: 'bold',
    height: 20,
    overflow: 'hidden',
  },
});

export default HomeHeader;
