import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Person {
  id: number;
  name: string;
  character?: string;
  job?: string;
  profile_path: string | null;
}

interface CastCrewSectionProps {
  cast: Person[];
  directors: Person[];
}

export const DirectorAndCastSection: React.FC<CastCrewSectionProps> = ({ cast, directors }) => {
  const renderPerson = (person: Person, role: string) => (
    <View key={person.id} style={styles.personContainer}>
      {person.profile_path ? (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w200${person.profile_path}` }}
          style={styles.personImage}
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>
            {person.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <Text style={styles.personName} numberOfLines={1}>
        {person.name}
      </Text>
      <Text style={styles.personRole} numberOfLines={1}>
        {role === 'cast' ? person.character : person.job}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="user" size={16} color="#CCC" />
          <Text style={styles.sectionTitle}>Directores</Text>
        </View>
        {directors.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.scrollContainer}
          >
            {directors.map(person => renderPerson(person, 'crew'))}
          </ScrollView>
        ) : (
          <Text style={styles.noDataText}>No hay información disponible</Text>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="users" size={16} color="#CCC" />
          <Text style={styles.sectionTitle}>Reparto</Text>
        </View>
        {cast.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.scrollContainer}
          >
            {cast.map(person => renderPerson(person, 'cast'))}
          </ScrollView>
        ) : (
          <Text style={styles.noDataText}>No hay información disponible</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    marginTop: 20, // Añadir margen superior para separar los componentes
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#CCC',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  personContainer: {
    width: width * 0.22,
    marginRight: 12,
    alignItems: 'center',
  },
  personImage: {
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: width * 0.11,
    marginBottom: 8,
  },
  placeholderImage: {
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: width * 0.11,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeholderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  personName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 2,
  },
  personRole: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  noDataText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});