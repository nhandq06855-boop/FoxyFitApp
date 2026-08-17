import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product, RootStackParamList } from '../types';
import { fetchProducts } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Listing'>;

const LIMIT = 10;
const PRIMARY_COLOR = '#FF5A5F'; // Foxy Fit Theme Color

export default function ListingScreen({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const loadProducts = async (pageIndex: number, query: string, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const skip = pageIndex * LIMIT;
      const data = await fetchProducts(LIMIT, skip, query);

      if (isLoadMore) {
        setProducts((prev) => [...prev, ...data.products]);
      } else {
        setProducts(data.products);
      }

      if (skip + data.products.length >= data.total) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Đã có lỗi xảy ra.');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    loadProducts(0, debouncedSearch, false);
  }, [debouncedSearch]);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadProducts(nextPage, debouncedSearch, true);
  };

  const renderItem = useCallback(({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Detail', { product: item })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  ), [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fc" />
      
      {/* Header & Search */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Khám phá</Text>
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* States */}
      {error && !loading && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadProducts(0, debouncedSearch, false)}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={PRIMARY_COLOR} />
              </View>
            ) : <View style={{ height: 20 }} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f8f9fc' 
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 16,
    backgroundColor: '#f8f9fc',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
    color: '#9ca3af',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    height: '100%',
  },
  listContainer: { 
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#ffffff', 
    marginBottom: 16, 
    borderRadius: 20, 
    padding: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 15, 
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
  },
  thumbnail: { 
    width: '100%', 
    height: '100%', 
  },
  infoContainer: { 
    flex: 1, 
    marginLeft: 16, 
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  categoryText: { 
    fontSize: 11, 
    fontWeight: '700',
    color: '#6b7280', 
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#1f2937',
    lineHeight: 22,
  },
  priceContainer: {
    marginTop: 8,
  },
  price: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: PRIMARY_COLOR,
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  errorText: { 
    color: '#ef4444', 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 20,
    fontWeight: '500',
  },
  loadingText: { 
    marginTop: 12, 
    color: '#6b7280', 
    fontSize: 15,
    fontWeight: '500',
  },
  retryButton: { 
    backgroundColor: PRIMARY_COLOR, 
    paddingHorizontal: 24, 
    paddingVertical: 12, 
    borderRadius: 12,
    shadowColor: PRIMARY_COLOR,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  retryButtonText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 16,
  },
  footerLoader: { 
    paddingVertical: 20, 
    alignItems: 'center' 
  },
});