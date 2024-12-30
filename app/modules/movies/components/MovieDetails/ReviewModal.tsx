import React, { useState } from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/app/common/utils/constants';

const { height } = Dimensions.get('window');

interface ReviewModalProps {
  isVisible: boolean;
  onClose: () => void;
  isInWatchlist: boolean;
  isWatched: boolean;
  onWatchlistToggle: () => void;
  onWatchedToggle: () => void;
  onSubmitReview: (rating: number, review?: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isVisible,
  onClose,
  isInWatchlist,
  isWatched,
  onWatchlistToggle,
  onWatchedToggle,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [showReviewInput, setShowReviewInput] = useState<boolean>(false);

  const renderStar = (position: number) => {
    const filled = position <= rating;
    return (
      <TouchableOpacity 
        key={position} 
        onPress={() => {
          setRating(position);
          setShowReviewInput(true);
        }}
        style={styles.starContainer}
      >
        <Feather
          name={filled ? 'star' : 'star'}
          size={32}
          color={filled ? '#FFD700' : '#666'}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          {/* Header con línea de arrastre */}
          <View style={styles.dragLine} />

          {/* Iconos de Watchlist y Watched */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onWatchlistToggle}
            >
              <Feather
                name={isInWatchlist ? 'check-circle' : 'plus-circle'}
                size={28}
                color={isInWatchlist ? '#1DB954' : '#CCC'}
              />
              <Text style={styles.actionText}>Watchlist</Text>
            </TouchableOpacity>

            {isInWatchlist && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={onWatchedToggle}
              >
                <Feather
                  name={isWatched ? 'eye' : 'eye-off'}
                  size={28}
                  color={isWatched ? '#1DB954' : '#CCC'}
                />
                <Text style={styles.actionText}>
                  {isWatched ? 'Vista' : 'Por ver'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Sistema de Rating */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Califica esta película</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((num) => renderStar(num))}
            </View>
          </View>

          {/* Campo de Review (condicional) */}
          {showReviewInput && (
            <View style={styles.reviewContainer}>
              <TextInput
                style={styles.reviewInput}
                placeholder="Escribe tu reseña..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
                value={review}
                onChangeText={setReview}
              />
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={() => onSubmitReview(rating, review)}
              >
                <Text style={styles.submitButtonText}>Enviar Reseña</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: height * 0.6,
    padding: 20,
    paddingTop: 12,
  },
  dragLine: {
    width: 40,
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 30,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#CCC',
    marginTop: 8,
    fontSize: 14,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  ratingLabel: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starContainer: {
    padding: 8,
  },
  reviewContainer: {
    marginTop: 20,
  },
  reviewInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#1DB954',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReviewModal;