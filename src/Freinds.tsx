import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {collection, getDocs, onSnapshot} from 'firebase/firestore';
import {db} from './config/firebase'; // Ensure Firebase is properly configured
import {Chat} from './Chat';

export function Friends({user, onLogout}: any) {
  const [users, setUsers] = useState<any>([]);
  const [friend, setFriend] = useState<any>(null);
  const [curentUser, setCurentUser] = useState(null);
  const [conversations, setConversation] = useState([]);

  useEffect(() => {
    const fetchConversations = () => {
      try {
        const conversationRef = collection(db, 'conversations');

        // Subscribe to real-time updates
        const unsubscribe = onSnapshot(conversationRef, snapshot => {
          const updatedConversations: any = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          console.log('Real-time conversations: ', updatedConversations);
          setConversation(updatedConversations);
        });

        // Cleanup the subscription when the component unmounts
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, [friend]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);
        const usersList: any = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCurentUser(usersList.find((x: any) => x.name === user.email));
        setUsers(usersList.filter((x: any) => x.name !== user?.email));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [user.email]);

  const getInitials = (email: string) => {
    if (!email) {
      return 'NA';
    } // Default initials
    const parts = email.split('@')[0].split('.');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const renderUser = ({item}: any) => {
    // Check if the user has an avatar URL
    const avatarUrl = item.avatar || null; // Replace 'avatar' with the actual field name in your Firestore data
    const c: any = conversations.find((c: any) =>
      c?.participants?.every((x: any) =>
        [(curentUser as any)?.id, item.id].includes(x),
      ),
    );
    const istyping = c?.isTyping[item?.id];
    const unseen =
      c?.senderId !== (curentUser as any).id &&
      c?.unseen?.[(curentUser as any)?.id];

    return (
      <TouchableOpacity
        style={[
          styles.userCard,
          {backgroundColor: unseen ? '#66ccff' : 'white'},
        ]}
        onPress={() => setFriend(item)}>
        <View style={[styles.avatarContainer]}>
          {avatarUrl ? (
            // Display the avatar image if available
            <Image source={{uri: avatarUrl}} style={styles.avatarImage} />
          ) : (
            // Display initials if no avatar is available
            <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{item.name || 'Anonymous'}</Text>
          <Text style={[styles.email, {color: unseen ? 'black' : 'gray'}]}>
            {istyping ? 'Typing...' : c?.lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (friend && users?.length) {
    return (
      <>
        <View>
          <TouchableOpacity onPress={() => setFriend(null)}>
            <Text style={[styles.backButtonText]}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <View style={[styles.avatarContainer, styles.chatHeader]}>
            {friend?.avatar ? (
              // Display the avatar image if available
              <Image
                source={{uri: friend?.avatar}}
                style={styles.avatarImage}
              />
            ) : (
              // Display initials if no avatar is available
              <Text style={styles.avatarText}>{getInitials(friend?.name)}</Text>
            )}
          </View>
        </View>
        <Chat friend={friend} user={curentUser} />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.avatarContainer]}>
          {(user as any)?.avatar ? (
            <>
              <Image
                source={{uri: (user as any)?.avatar}}
                style={styles.avatarImageHeader}
              />
            </>
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
      {/* Header */}
      <View style={styles.headerFriend}>
        <Text style={styles.headerText}>Friends</Text>
      </View>

      {/* Friends List */}
      <FlatList
        data={users}
        keyExtractor={(item: any) => item.id}
        renderItem={renderUser}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// Helper function to darken colors

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
    height: 80
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
    overflow:'hidden',
  },
});
