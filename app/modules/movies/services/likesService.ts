import AsyncStorage from '@react-native-async-storage/async-storage';

const LIKES_STORAGE_KEY = 'user_likes';

interface UserLikes {
    [key: number]: number[]; // userId -> reviewIds[]
}

export const getLikedReviews = async (userId: number): Promise<number[]> => {
    try {
        const storedLikes = await AsyncStorage.getItem(LIKES_STORAGE_KEY);
        if (!storedLikes) return [];

        const userLikes: UserLikes = JSON.parse(storedLikes);
        return userLikes[userId] || [];
    } catch (error) {
        console.error('Error getting liked reviews:', error);
        return [];
    }
};

export const saveLike = async (userId: number, reviewId: number): Promise<void> => {
    try {
        const storedLikes = await AsyncStorage.getItem(LIKES_STORAGE_KEY);
        const userLikes: UserLikes = storedLikes ? JSON.parse(storedLikes) : {};

        if (!userLikes[userId]) {
            userLikes[userId] = [];
        }

        if (!userLikes[userId].includes(reviewId)) {
            userLikes[userId].push(reviewId);
            await AsyncStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(userLikes));
        }
    } catch (error) {
        console.error('Error saving like:', error);
    }
};

export const removeLike = async (userId: number, reviewId: number): Promise<void> => {
    try {
        const storedLikes = await AsyncStorage.getItem(LIKES_STORAGE_KEY);
        if (!storedLikes) return;

        const userLikes: UserLikes = JSON.parse(storedLikes);
        
        if (userLikes[userId]) {
            userLikes[userId] = userLikes[userId].filter(id => id !== reviewId);
            await AsyncStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(userLikes));
        }
    } catch (error) {
        console.error('Error removing like:', error);
    }
};

export const hasUserLikedReview = async (userId: number, reviewId: number): Promise<boolean> => {
    try {
        const likedReviews = await getLikedReviews(userId);
        return likedReviews.includes(reviewId);
    } catch (error) {
        console.error('Error checking if user liked review:', error);
        return false;
    }
};