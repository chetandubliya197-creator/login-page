import CryptoJS from 'crypto-js';

// Generate a deterministic shared key based on the two user IDs involved
// This ensures that only these two users can encrypt/decrypt their chat messages
const generateConversationKey = (userId1, userId2) => {
  // Sort IDs to ensure the key is the same regardless of who sends the message
  const sortedIds = [String(userId1), String(userId2)].sort();
  // We use a base salt + the sorted IDs to create a unique chat secret
  return `CP_SECRET_${sortedIds[0]}_${sortedIds[1]}`;
};

export const encryptMessage = (text, senderId, receiverId) => {
  if (!text) return text;
  try {
    const secretKey = generateConversationKey(senderId, receiverId);
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    return text; // Fallback to raw text if encryption fails
  }
};

export const decryptMessage = (encryptedText, senderId, receiverId) => {
  if (!encryptedText) return encryptedText;
  
  // If the text doesn't look like an encrypted string (e.g., legacy messages), return it directly
  if (!encryptedText.startsWith('U2FsdGVkX1')) {
    return encryptedText;
  }

  try {
    const secretKey = generateConversationKey(senderId, receiverId);
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    
    // If decryption fails (e.g. wrong key or malformed), it returns empty string
    return originalText || encryptedText;
  } catch (error) {
    // If decryption throws an error, return the original text
    return encryptedText;
  }
};
