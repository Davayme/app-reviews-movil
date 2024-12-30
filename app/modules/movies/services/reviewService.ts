import { API_URL } from '@/app/common/utils/constants';

interface CreateReviewDto {
    userId: number;
    movieId: number;
    rating: number;
    reviewText?: string;
    containsSpoiler: boolean;
}

interface UpdateReviewDto {
    rating?: number;
    reviewText?: string;
    containsSpoiler?: boolean;
}

export const createReview = async (reviewData: CreateReviewDto) => {
    try {
        const response = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        });

        if (!response.ok) {
            throw new Error('Error creating review');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating review:', error);
        throw error;
    }
};

export const updateReview = async (id: number, reviewData: UpdateReviewDto) => {
    try {
        const response = await fetch(`${API_URL}/reviews/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        });

        if (!response.ok) {
            throw new Error('Error updating review');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating review:', error);
        throw error;
    }
};

export const deleteReview = async (id: number) => {
    try {
        const response = await fetch(`${API_URL}/reviews/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error deleting review');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};