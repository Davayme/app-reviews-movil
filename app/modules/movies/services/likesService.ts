import AsyncStorage from '@react-native-async-storage/async-storage';

const LIKES_STORAGE_KEY = 'user_likes_list';

export const getLikedReviews = async (userId: number): Promise<number[]> => {
    try {
        const storedLikes = await AsyncStorage.getItem(LIKES_STORAGE_KEY);
        if (!storedLikes) return [];
        return JSON.parse(storedLikes);
    } catch (error) {
        console.error('Error getting liked reviews:', error);
        return [];
    }
};

export const saveLike = async (userId: number, reviewId: number): Promise<void> => {
    try {
        const storedLikes = await AsyncStorage.getItem(LIKES_STORAGE_KEY);
        const likedReviews: number[] = storedLikes ? JSON.parse(storedLikes) : [];
        
        if (!likedReviews.includes(reviewId)) {
            likedReviews.push(reviewId);
            await AsyncStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likedReviews));
        }
    } catch (error) {
        console.error('Error saving like:', error);
    }
};

export const removeLike = async (userId: number, reviewId: number): Promise<void> => {
    try {
        const storedLikes = await AsyncStorage.getItem(LIKES_STORAGE_KEY);
        if (!storedLikes) return;

        const likedReviews: number[] = JSON.parse(storedLikes);
        const updatedLikes = likedReviews.filter(id => id !== reviewId);
        await AsyncStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(updatedLikes));
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