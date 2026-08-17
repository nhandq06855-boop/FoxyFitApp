import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Platform,
  StatusBar
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

const PRIMARY_COLOR = '#FF5A5F'; // Foxy Fit Theme Color

export default function DetailScreen({ route, navigation }: Props) {
  const { product } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.contentSheet}>
          <View style={styles.dragIndicator} />
          
          <View style={styles.headerRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
            <Text style={styles.ratingText}>⭐ 4.8</Text>
          </View>

          <Text style={styles.title}>{product.title}</Text>
          
          <Text style={styles.price}>${product.price}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.description}>{product.description}</Text>
          
          {/* Spacer for bottom button */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Floating Buy Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.buyButton} activeOpacity={0.8}>
          <Text style={styles.buyButtonText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ffffff' 
  },
  scrollContainer: { 
    flexGrow: 1,
    paddingBottom: 24,
  },
  imageWrapper: {
    width: '100%',
    height: 380,
    backgroundColor: '#f3f4f6',
  },
  image: { 
    width: '100%', 
    height: '100%', 
  },
  contentSheet: { 
    flex: 1,
    marginTop: -30,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -5 },
    elevation: 10,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: { 
    fontSize: 12, 
    color: '#6b7280', 
    textTransform: 'uppercase', 
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4b5563',
  },
  title: { 
    fontSize: 26, 
    fontWeight: '800', 
    color: '#111827', 
    lineHeight: 34,
    marginBottom: 12,
  },
  price: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: PRIMARY_COLOR, 
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 24,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#1f2937', 
    marginBottom: 12 
  },
  description: { 
    fontSize: 15, 
    color: '#4b5563', 
    lineHeight: 24,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  buyButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});