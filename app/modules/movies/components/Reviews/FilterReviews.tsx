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

type FilterOption = {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  order: 'asc' | 'desc';
};

interface FilterReviewsProps {
  onFilter: (order: 'asc' | 'desc') => void;
}

export const FilterReviews: React.FC<FilterReviewsProps> = ({ onFilter }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('');

  const filterOptions: FilterOption[] = [
    { id: 'date_asc', label: 'Más antiguos primero', icon: 'access-time', order: 'asc' },
    { id: 'date_desc', label: 'Más recientes primero', icon: 'access-time', order: 'desc' },
  ];

  const handleFilter = (option: FilterOption) => {
    setActiveFilter(option.id);
    onFilter(option.order);
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
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.filterOption,
                  activeFilter === option.id && styles.activeOption,
                ]}
                onPress={() => handleFilter(option)}
              >
                <MaterialIcons
                  name={option.icon}
                  size={24}
                  color={activeFilter === option.id ? colors.white : colors.gris}
                />
                <Text
                  style={[
                    styles.filterOptionText,
                    activeFilter === option.id && styles.activeOptionText,
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
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  activeOption: {
    backgroundColor: colors.magenta,
  },
  filterOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.gris,
  },
  activeOptionText: {
    color: colors.white,
    fontWeight: '600',
  },
});