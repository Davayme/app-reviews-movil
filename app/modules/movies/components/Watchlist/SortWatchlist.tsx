import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/app/common/utils/constants';
import tw from 'tailwind-react-native-classnames';

type SortOption = {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  order: 'asc' | 'desc';
};

type SortType = 'title' | 'date';

interface SortWatchlistProps {
  onSort: (type: SortType, order: 'asc' | 'desc') => void;
}

export const SortWatchlist: React.FC<SortWatchlistProps> = ({ onSort }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeSort, setActiveSort] = useState<string>('');

  const sortOptions: SortOption[] = [
    { id: 'title_asc', label: 'Título (A-Z)', icon: 'sort-by-alpha', order: 'asc' },
    { id: 'title_desc', label: 'Título (Z-A)', icon: 'sort-by-alpha', order: 'desc' },
    { id: 'date_desc', label: 'Más recientes primero', icon: 'access-time', order: 'desc' },
    { id: 'date_asc', label: 'Más antiguos primero', icon: 'access-time', order: 'asc' },
  ];

  const handleSort = (option: SortOption) => {
    setActiveSort(option.id);
    const type: SortType = option.id.startsWith('title') ? 'title' : 'date';
    onSort(type, option.order);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[
          tw`flex-row items-center px-2 py-2 rounded-full`,
          { backgroundColor: colors.magentaLight },
        ]}
      >
        <MaterialIcons name="sort" size={24} color={colors.white} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.sortOption,
                  activeSort === option.id && styles.activeOption,
                ]}
                onPress={() => handleSort(option)}
              >
                <MaterialIcons
                  name={option.icon}
                  size={24}
                  color={activeSort === option.id ? colors.white : colors.gris}
                />
                <Text
                  style={[
                    styles.sortOptionText,
                    activeSort === option.id && styles.activeOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors['background-color'],
    borderRadius: 12,
    padding: 16,
    width: '80%',
    maxWidth: 300,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  activeOption: {
    backgroundColor: colors.magenta,
  },
  sortOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.gris,
  },
  activeOptionText: {
    color: colors.white,
    fontWeight: '600',
  },
});