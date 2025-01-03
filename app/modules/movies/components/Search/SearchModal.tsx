import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { colors } from "@/app/common/utils/constants";
import { searchMovies } from "../../services/movieService";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from "../../context/RootStack";
import { useAuth } from "@/app/modules/auth/hooks/useAuth";

const ITEM_HEIGHT = 140;

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
}
interface Movie {
  page: number;
  results: Result[];
  total_pages: number;
  total_results: number;
}

interface Result {
  id: number;
  overview: string;
  poster_path: string;
  release_date: string; // Cambiado a string para simplificar
  title: string;
  video: boolean;
}
export const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setCurrentPage(1);
    try {
      const response = await searchMovies(query);
      setResults(response.results);
      setTotalPages(response.total_pages);
    } catch (error) {
      console.error("Error searching movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreResults = async () => {
    if (isLoadingMore || currentPage >= totalPages) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await searchMovies(query, "es-ES", nextPage);
      setResults((prevResults) => [...prevResults, ...response.results]);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Error loading more movies:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const ListFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={tw`py-4 justify-center items-center`}>
          <ActivityIndicator size="small" color={colors.yellow} />
        </View>
      );
    }

    if (currentPage < totalPages) {
      return (
        <TouchableOpacity
          style={[
            tw`mx-4 my-4 py-3 px-6 rounded-full items-center`,
            { backgroundColor: colors.magenta },
          ]}
          onPress={loadMoreResults}
        >
          <Text style={tw`text-white font-medium`}>Cargar más películas</Text>
        </TouchableOpacity>
      );
    }

    if (results.length > 0) {
      return (
        <Text style={[tw`text-center py-4 text-gray-400`, { fontSize: 14 }]}>
          No hay más resultados
        </Text>
      );
    }

    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const NoImagePlaceholder = () => (
    <View
      style={[
        tw`rounded-lg items-center justify-center`,
        {
          width: 100,
          height: ITEM_HEIGHT - 30,
          backgroundColor: "rgba(255,255,255,0.1)",
        },
      ]}
    >
      <MaterialIcons name="local-movies" size={40} color={colors.gris} />
    </View>
  );

  const renderItem = ({ item }: { item: Result }) => (
    <TouchableOpacity
      style={[
        tw`flex-row p-4 rounded-xl mb-3`,
        { backgroundColor: "rgba(32, 32, 32, 0.95)" },
      ]}
      activeOpacity={0.7}
    >
      {item.poster_path ? (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
          style={[tw`rounded-lg`, { width: 100, height: ITEM_HEIGHT - 30 }]}
          resizeMode="cover"
        />
      ) : (
        <NoImagePlaceholder />
      )}
      <View style={tw`flex-1 ml-4 justify-between`}>
        <View>
          <Text
            style={[tw`text-white font-bold mb-2`, { fontSize: 16 }]}
            numberOfLines={2}
          >
            {item.title || "Sin título"}
          </Text>
          <Text
            style={[
              tw`text-gray-400 mb-2`,
              {
                fontSize: 13,
                textAlign: "justify",
                lineHeight: 18,
              },
            ]}
            numberOfLines={3}
          >
            {item.overview || "No hay descripción disponible"}
          </Text>
        </View>
        <View style={tw`flex-row items-center justify-between mt-2`}>
          <View style={tw`flex-row items-center`}>
            <MaterialIcons
              name="calendar-today"
              size={16}
              color={colors.yellow}
            />
            <Text style={[tw`text-yellow-500 ml-1`, { fontSize: 14 }]}>
              {item.release_date ? formatDate(item.release_date) : "Sin fecha"}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              tw`px-4 py-2 rounded-full`,
              { backgroundColor: colors.magenta },
            ]}
            onPress={() => {
              onClose();
              navigation.navigate('modules/movies/screens/MovieDetailScreen', { id: item.id, userId: user?.id });
            }}
          >
            <Text style={tw`text-white font-medium text-xs`}>Ver más</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      transparent
    >
      <View style={[tw`flex-1`, { backgroundColor: "rgba(0,0,0,0.9)" }]}>
  
        <View
          style={[
            tw`px-4 py-3 flex-row items-center mt-8`, 
            { backgroundColor: "rgba(32, 32, 32, 0.95)" },
          ]}
        >
          <TouchableOpacity onPress={onClose} style={tw`mr-3`}>
            <MaterialIcons name="arrow-back" size={24} color={colors.yellow} />
          </TouchableOpacity>
          <View
            style={[
              tw`flex-1 flex-row items-center px-3 rounded-full`,
              { backgroundColor: "rgba(255,255,255,0.1)" },
            ]}
          >
            <MaterialIcons name="search" size={20} color={colors.gris} />
            <TextInput
              style={[tw`flex-1 ml-2 py-2 text-white`, { fontSize: 16 }]}
              placeholder="Buscar película..."
              placeholderTextColor={colors.gris}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <MaterialIcons name="close" size={20} color={colors.gris} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {isLoading ? (
          <View style={tw`flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" color={colors.yellow} />
          </View>
        ) : results.length === 0 ? (
          <View style={tw`flex-1 justify-center items-center p-4`}>
            <MaterialIcons name="local-movies" size={48} color={colors.gris} />
            <Text
              style={[tw`text-center mt-4 text-gray-400`, { fontSize: 16 }]}
            >
              {query.length > 0
                ? "No se encontraron resultados"
                : "Busca tus películas favoritas"}
            </Text>
          </View>
        ) : (
            <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={tw`p-4`}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={ListFooter}
            onEndReached={loadMoreResults}
            onEndReachedThreshold={0.5}
            getItemLayout={(data, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
          />
        )}
      </View>
    </Modal>
  );
};
