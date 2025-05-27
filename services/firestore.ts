import { DocumentSnapshot, FieldValue, Timestamp, collection, doc, getDoc, getDocs, getFirestore, increment, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, startAfter, updateDoc, where } from 'firebase/firestore';
import { app } from './firebase'; // Assuming your firebase app initialization is in firebase.ts

// Initialize Firestore
const db = getFirestore(app);

// --- Type Definitions ---

export interface UserProfile {
  uid: string; // Document ID will be this
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Timestamp | FieldValue; // FieldValue for serverTimestamp on creation
  updatedAt: Timestamp | FieldValue;
  location?: string;
  bio?: string;
  isVerified: boolean;
  expoPushToken?: string;
}

export interface Listing {
  listingId: string; // Document ID
  sellerUid: string;
  title: string;
  description: string;
  price: number;
  category: string; // Consider a predefined list or enum later
  condition?: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  imageUrls: string[];
  status: 'active' | 'sold' | 'pending' | 'deleted' | 'expired';
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  location?: string;
  isTradeable?: boolean;
  viewCount?: number;
  // Search keywords - denormalized for easier search
  searchKeywords?: string[]; // e.g., [title_word1, title_word2, category, condition]
}

export interface Conversation {
  conversationId: string; // Document ID
  listingId: string;
  participantUids: string[]; // [sellerUid, buyerUid]
  lastMessage?: {
    text: string;
    senderUid: string;
    timestamp: Timestamp | FieldValue;
  };
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  // e.g., { [uid_of_user1]: 2, [uid_of_user2]: 0 }
  unreadCounts?: { [key: string]: number }; 
}

// Subcollection: /conversations/{conversationId}/messages/{messageId}
export interface Message {
  messageId: string; // Document ID
  senderUid: string;
  text: string;
  timestamp: Timestamp | FieldValue;
  imageUrl?: string;
  // isRead will be handled by unreadCounts in Conversation or by client-side logic
}

export interface Offer {
  offerId: string; // Document ID
  listingId: string;
  buyerUid: string;
  sellerUid: string;
  offerPrice: number;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'countered' | 'retracted' | 'expired';
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  expiresAt?: Timestamp | FieldValue;
}

// Helper type for Firebase Server Timestamp
// This is because on write, we use FieldValue, but on read, we get Timestamp


// --- Firestore Collection References ---
const usersCollection = collection(db, 'users');
const listingsCollection = collection(db, 'listings');
const conversationsCollection = collection(db, 'conversations');
// messages will be a subcollection, so referenced dynamically
const offersCollection = collection(db, 'offers');

// --- User Functions ---

/**
 * Creates a new user profile document in Firestore.
 * Typically called after successful Firebase Auth registration.
 * @param uid The user's Firebase Authentication UID.
 * @param email The user's email.
 * @param additionalData Optional additional data for the profile.
 */
export const createUserProfile = async (
  uid: string,
  email: string,
  displayName?: string,
  photoURL?: string
): Promise<void> => {
  const userRef = doc(usersCollection, uid);
  const userData: UserProfile = {
    uid,
    email,
    displayName: displayName || email.split('@')[0], // Default display name from email prefix
    photoURL: photoURL || '', // Default empty string or a placeholder avatar URL
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isVerified: false, // Email verification status, false by default
    // bio, location, expoPushToken can be added/updated later via updateUserProfile
  };
  await setDoc(userRef, userData);
};

/**
 * Retrieves a user's profile from Firestore.
 * @param uid The UID of the user to retrieve.
 * @returns The UserProfile object or null if not found.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(usersCollection, uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
};

/**
 * Updates a user's profile in Firestore.
 * Only updates fields that are provided in partialData.
 * @param uid The UID of the user to update.
 * @param partialData An object containing the fields to update.
 */
export const updateUserProfile = async (
  uid: string,
  partialData: Partial<UserProfile>
): Promise<void> => {
  const userRef = doc(usersCollection, uid);
  await updateDoc(userRef, {
    ...partialData,
    updatedAt: serverTimestamp(),
  });
};

// --- Listing Functions ---

/**
 * Adds a new listing to Firestore.
 * @param listingData The core data for the new listing (sellerUid, title, price, etc.).
 * @returns The ID of the newly created listing document.
 */
export const addListing = async (listingData: Omit<Listing, 'listingId' | 'createdAt' | 'updatedAt' | 'status' | 'viewCount'>): Promise<string> => {
  const newListingsRef = doc(listingsCollection); // Firestore generates ID automatically
  const fullListingData: Listing = {
    ...listingData,
    listingId: newListingsRef.id,
    status: 'active',
    viewCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    // Basic search keywords generation (can be improved with more sophisticated tokenization)
    searchKeywords: [
      ...listingData.title.toLowerCase().split(' '),
      listingData.category.toLowerCase(),
      ...(listingData.condition ? [listingData.condition.toLowerCase()] : []),
    ].filter(kw => kw.length > 1), // Filter out very short/common words if necessary
  };
  await setDoc(newListingsRef, fullListingData);
  return newListingsRef.id;
};

/**
 * Retrieves a specific listing by its ID.
 * @param listingId The ID of the listing to retrieve.
 * @returns The Listing object or null if not found.
 */
export const getListingById = async (listingId: string): Promise<Listing | null> => {
  const listingRef = doc(listingsCollection, listingId);
  const listingSnap = await getDoc(listingRef);
  if (listingSnap.exists()) {
    return listingSnap.data() as Listing;
  }
  return null;
};

/**
 * Retrieves all listings created by a specific seller.
 * @param sellerUid The UID of the seller.
 * @param statusFilter Optional filter by listing status (e.g., 'active', 'sold').
 * @returns An array of Listing objects.
 */
export const getListingsBySeller = async (sellerUid: string, statusFilter?: Listing['status']): Promise<Listing[]> => {
  let q = query(listingsCollection, where("sellerUid", "==", sellerUid), orderBy("createdAt", "desc"));
  if (statusFilter) {
    q = query(listingsCollection, where("sellerUid", "==", sellerUid), where("status", "==", statusFilter), orderBy("createdAt", "desc"));
  }
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Listing);
};

/**
 * Retrieves recent listings, optionally paginated.
 * @param limitCount The number of listings to retrieve.
 * @param startAfterDoc Optional Firestore DocumentSnapshot to start after for pagination.
 * @returns An object containing an array of Listing objects and the last visible document for pagination.
 */
export const getRecentListings = async (
  limitCount: number = 10,
  startAfterDoc?: DocumentSnapshot<Listing> // Correct type for startAfter
): Promise<{ listings: Listing[]; lastVisible?: DocumentSnapshot<Listing> }> => {
  let q = query(
    listingsCollection,
    where("status", "==", "active"),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  if (startAfterDoc) {
    q = query(q, startAfter(startAfterDoc));
  }

  const querySnapshot = await getDocs(q);
  const listings = querySnapshot.docs.map(doc => doc.data() as Listing);
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] as DocumentSnapshot<Listing> | undefined;
  
  return { listings, lastVisible };
};

/**
 * Updates specific fields of a listing.
 * @param listingId The ID of the listing to update.
 * @param partialData An object containing the fields to update.
 */
export const updateListing = async (
  listingId: string,
  partialData: Partial<Omit<Listing, 'listingId' | 'sellerUid' | 'createdAt'>> // Cannot update listingId, sellerUid, or createdAt directly
): Promise<void> => {
  const listingRef = doc(listingsCollection, listingId);
  // If title, category or condition is being updated, regenerate searchKeywords
  let dataToUpdate: Partial<Listing> = { ...partialData };

  if (partialData.title || partialData.category || partialData.condition) {
    const currentListing = await getListingById(listingId);
    if (currentListing) {
        const newTitle = partialData.title || currentListing.title;
        const newCategory = partialData.category || currentListing.category;
        const newCondition = partialData.condition || currentListing.condition;

        dataToUpdate.searchKeywords = [
            ...newTitle.toLowerCase().split(' '),
            newCategory.toLowerCase(),
            ...(newCondition ? [newCondition.toLowerCase()] : []),
        ].filter(kw => kw.length > 1);
    }
  }

  await updateDoc(listingRef, {
    ...dataToUpdate,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Marks a listing as 'deleted'. (Soft delete)
 * @param listingId The ID of the listing to mark as deleted.
 */
export const deleteListing = async (listingId: string): Promise<void> => {
  await updateListing(listingId, { status: 'deleted' });
};

/**
 * Searches active listings based on keywords.
 * Keywords are matched against the pre-generated searchKeywords array in each listing.
 * @param searchText The text to search for.
 * @param limitCount The number of listings to retrieve.
 * @param startAfterDoc Optional Firestore DocumentSnapshot to start after for pagination.
 * @returns An object containing an array of Listing objects and the last visible document.
 */
export const searchListings = async (
  searchText: string,
  limitCount: number = 10,
  startAfterDoc?: DocumentSnapshot<Listing>
): Promise<{ listings: Listing[]; lastVisible?: DocumentSnapshot<Listing> }> => {
  const keywords = searchText.toLowerCase().split(' ').filter(kw => kw.length > 1);
  if (keywords.length === 0) {
    return { listings: [], lastVisible: undefined };
  }

  let q = query(
    listingsCollection,
    where("status", "==", "active"),
    where("searchKeywords", "array-contains-any", keywords),
    orderBy("createdAt", "desc"), 
    limit(limitCount)
  );

  if (startAfterDoc) {
    q = query(q, startAfter(startAfterDoc));
  }

  try {
    const querySnapshot = await getDocs(q);
    const listings = querySnapshot.docs.map(doc => doc.data() as Listing);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] as DocumentSnapshot<Listing> | undefined;
    return { listings, lastVisible };
  } catch (error) {
    console.error("Error searching listings:", error);
    return { listings: [], lastVisible: undefined };
  }
};

/**
 * Retrieves active listings for a specific category, optionally paginated.
 * @param category The category to filter by.
 * @param limitCount The number of listings to retrieve.
 * @param startAfterDoc Optional Firestore DocumentSnapshot to start after for pagination.
 * @returns An object containing an array of Listing objects and the last visible document.
 */
export const getListingsByCategory = async (
  category: string,
  limitCount: number = 10,
  startAfterDoc?: DocumentSnapshot<Listing>
): Promise<{ listings: Listing[]; lastVisible?: DocumentSnapshot<Listing> }> => {
  let q = query(
    listingsCollection,
    where("status", "==", "active"),
    where("category", "==", category), 
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );

  if (startAfterDoc) {
    q = query(q, startAfter(startAfterDoc));
  }

  const querySnapshot = await getDocs(q);
  const listings = querySnapshot.docs.map(doc => doc.data() as Listing);
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] as DocumentSnapshot<Listing> | undefined;
  
  return { listings, lastVisible };
};

// --- Conversation & Message Functions ---

/**
 * Gets an existing conversation between two users for a specific listing, or creates a new one if it doesn't exist.
 * The order of user UIDs in participantUids should be consistent (e.g., sorted) to ensure uniqueness.
 * @param listingId The ID of the listing.
 * @param user1Uid UID of the first user (e.g., potential buyer).
 * @param user2Uid UID of the second user (e.g., seller).
 * @returns The Conversation object (either existing or newly created).
 */
export const getOrCreateConversation = async (
  listingId: string,
  user1Uid: string,
  user2Uid: string
): Promise<Conversation> => {
  // Ensure participantUids are always in the same order for querying (e.g., sorted alphabetically)
  const participants = [user1Uid, user2Uid].sort();

  const q = query(
    conversationsCollection,
    where("listingId", "==", listingId),
    where("participantUids", "==", participants) // Query for exact match of sorted participants array
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Conversation already exists
    const convoDoc = querySnapshot.docs[0];
    return { conversationId: convoDoc.id, ...convoDoc.data() } as Conversation;
  }

  // Conversation doesn't exist, create it
  const newConversationRef = doc(conversationsCollection);
  const conversationData: Conversation = {
    conversationId: newConversationRef.id,
    listingId,
    participantUids: participants,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    unreadCounts: { [user1Uid]: 0, [user2Uid]: 0 }, // Initialize unread counts
    // lastMessage will be updated by sendMessage
  };
  await setDoc(newConversationRef, conversationData);
  return conversationData;
};

/**
 * Retrieves a specific conversation by its ID.
 */
export const getConversationById = async (conversationId: string): Promise<Conversation | null> => {
  const convoRef = doc(conversationsCollection, conversationId);
  const convoSnap = await getDoc(convoRef);
  if (convoSnap.exists()) {
    return { conversationId: convoSnap.id, ...convoSnap.data() } as Conversation;
  }
  return null;
};

/**
 * Retrieves all conversations for a given user.
 * @param uid The UID of the user.
 * @returns An array of Conversation objects, ordered by last update.
 */
export const getConversationsForUser = async (uid: string): Promise<Conversation[]> => {
  const q = query(
    conversationsCollection,
    where("participantUids", "array-contains", uid),
    orderBy("updatedAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ conversationId: doc.id, ...doc.data() }) as Conversation);
};

/**
 * Sends a message in a conversation and updates the conversation's lastMessage and unread counts.
 * @param conversationId The ID of the conversation.
 * @param senderUid The UID of the message sender.
 * @param text The message text.
 * @param recipientUid The UID of the message recipient (to update their unread count).
 * @returns The ID of the newly created message.
 */
export const sendMessage = async (
  conversationId: string,
  senderUid: string,
  text: string,
  recipientUid: string // Needed to increment unread count for the other user
): Promise<string> => {
  const conversationRef = doc(conversationsCollection, conversationId);
  const messagesSubCollection = collection(conversationRef, 'messages');
  const newMessageRef = doc(messagesSubCollection);

  const messageData: Message = {
    messageId: newMessageRef.id,
    senderUid,
    text,
    timestamp: serverTimestamp(),
  };

  await setDoc(newMessageRef, messageData);

  // Update the parent conversation document
  const conversationUpdateData: Partial<Conversation> & { updatedAt: FieldValue, lastMessage: any, [key: string]: any } = {
    lastMessage: {
      text,
      senderUid,
      timestamp: serverTimestamp(),
    },
    updatedAt: serverTimestamp(),
    // Increment unread count for the recipient using dot notation for nested field
    [`unreadCounts.${recipientUid}`]: increment(1)
  };

  await updateDoc(conversationRef, conversationUpdateData);
  return newMessageRef.id;
};

/**
 * Sets up a real-time listener for messages in a conversation.
 * @param conversationId The ID of the conversation.
 * @param callback Function to call with new messages array (ordered by timestamp).
 * @returns Unsubscribe function from Firestore listener.
 */
export const listenToMessages = (
  conversationId: string,
  callback: (messages: Message[]) => void
): (() => void) => { // Returns an unsubscribe function
  const messagesSubCollection = collection(db, 'conversations', conversationId, 'messages');
  const q = query(messagesSubCollection, orderBy("timestamp", "asc"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(doc => ({ messageId: doc.id, ...doc.data() }) as Message);
    callback(messages);
  });

  return unsubscribe;
};

/**
* Marks messages as read for a user in a conversation.
* This typically involves setting their unread count for that conversation to 0.
* @param conversationId The ID of the conversation.
* @param userId The UID of the user whose messages are to be marked as read.
*/
export const markMessagesAsRead = async (conversationId: string, userId: string): Promise<void> => {
    const conversationRef = doc(conversationsCollection, conversationId);
    const updateData: { [key: string]: any } = {};
    updateData[`unreadCounts.${userId}`] = 0;
    updateData['updatedAt'] = serverTimestamp(); // Optionally update timestamp to reflect activity

    await updateDoc(conversationRef, updateData);
};

// --- Offer Functions ---

/**
 * Creates a new offer for a listing.
 * @param offerData Core data for the offer (listingId, buyerUid, sellerUid, offerPrice).
 * @returns The ID of the newly created offer.
 */
export const makeOffer = async (offerData: Omit<Offer, 'offerId' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> => {
  const newOfferRef = doc(offersCollection);
  const fullOfferData: Offer = {
    ...offerData,
    offerId: newOfferRef.id,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(newOfferRef, fullOfferData);
  // TODO: Consider sending a notification to the seller here.
  return newOfferRef.id;
};

/**
 * Retrieves a specific offer by its ID.
 */
export const getOfferById = async (offerId: string): Promise<Offer | null> => {
  const offerRef = doc(offersCollection, offerId);
  const offerSnap = await getDoc(offerRef);
  if (offerSnap.exists()) {
    return { offerId: offerSnap.id, ...offerSnap.data() } as Offer;
  }
  return null;
};

/**
 * Retrieves all offers made for a specific listing.
 * @param listingId The ID of the listing.
 * @returns An array of Offer objects, ordered by creation date.
 */
export const getOffersForListing = async (listingId: string): Promise<Offer[]> => {
  const q = query(
    offersCollection,
    where("listingId", "==", listingId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ offerId: doc.id, ...doc.data() }) as Offer);
};

/**
 * Retrieves all offers made by a specific buyer.
 * @param buyerUid The UID of the buyer.
 * @param statusFilter Optional filter by offer status.
 * @returns An array of Offer objects.
 */
export const getOffersByBuyer = async (buyerUid: string, statusFilter?: Offer['status']): Promise<Offer[]> => {
  let q = query(offersCollection, where("buyerUid", "==", buyerUid), orderBy("createdAt", "desc"));
  if (statusFilter) {
    q = query(offersCollection, where("buyerUid", "==", buyerUid), where("status", "==", statusFilter), orderBy("createdAt", "desc"));
  }
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ offerId: doc.id, ...doc.data() }) as Offer);
};

/**
 * Retrieves all offers received by a specific seller.
 * @param sellerUid The UID of the seller.
 * @param statusFilter Optional filter by offer status.
 * @returns An array of Offer objects.
 */
export const getOffersBySeller = async (sellerUid: string, statusFilter?: Offer['status']): Promise<Offer[]> => {
  let q = query(offersCollection, where("sellerUid", "==", sellerUid), orderBy("createdAt", "desc"));
  if (statusFilter) {
    q = query(offersCollection, where("sellerUid", "==", sellerUid), where("status", "==", statusFilter), orderBy("createdAt", "desc"));
  }
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ offerId: doc.id, ...doc.data() }) as Offer);
};

/**
 * Updates the status of an offer (e.g., accepted, declined).
 * @param offerId The ID of the offer to update.
 * @param status The new status for the offer.
 */
export const updateOfferStatus = async (offerId: string, status: Offer['status']): Promise<void> => {
  const offerRef = doc(offersCollection, offerId);
  await updateDoc(offerRef, {
    status,
    updatedAt: serverTimestamp(),
  });
  // TODO: Consider sending a notification to the buyer about the status change.
  // If status is 'accepted', also update the corresponding Listing's status to 'sold' or 'pending'.
  if (status === 'accepted') {
    const offer = await getOfferById(offerId);
    if (offer) {
      await updateListing(offer.listingId, { status: 'sold' }); // Or 'pending' if payment step is next
    }
  }
};

export { conversationsCollection, db, listingsCollection, offersCollection, serverTimestamp, usersCollection };

 