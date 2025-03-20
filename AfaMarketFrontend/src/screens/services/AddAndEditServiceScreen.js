import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Switch } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getServiceById, updateService, createService, getServiceCategories } from '../services/appserviceService';
import { Picker } from '@react-native-picker/picker';

const ServiceFormScreen = ({ isEdit }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const serviceId = route.params?.serviceId;
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]); // Fetch categories dynamically
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getServiceCategories();
        setCategories(response.categories);
        if (!category) setCategory(response.categories[0]); // Set default category
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEdit && serviceId) {
      const fetchServiceDetails = async () => {
        try {
          const data = await getServiceById(serviceId);
          setTitle(data.title);
          setCategory(data.category);
          setMinPrice(data.minPrice?.toString() || '');
          setMaxPrice(data.maxPrice?.toString() || '');
          setPrice(data.price?.toString() || '');
          setDescription(data.description);
          setIsNegotiable(data.isNegotiable || false);
        } catch (error) {
          console.error('Error fetching service details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchServiceDetails();
    } else {
      setLoading(false);
    }
  }, [isEdit, serviceId]);

  const handleSubmit = async () => {
    if (!title || !category || !description || (!minPrice && !maxPrice && !price)) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const serviceData = { title, category, description, isNegotiable };

    // Add prices only if entered
    if (minPrice) serviceData.minPrice = parseFloat(minPrice);
    if (maxPrice) serviceData.maxPrice = parseFloat(maxPrice);
    if (price) serviceData.price = parseFloat(price);

    try {
      if (isEdit) {
        await updateService(serviceId, serviceData);
        Alert.alert('Success', 'Service updated successfully!');
      } else {
        await createService(serviceData);
        Alert.alert('Success', 'Service added successfully!');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving service:', error);
      Alert.alert('Error', 'Failed to save service.');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.label}>Title</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} />

          <Text style={styles.label}>Category</Text>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            {categories.map((cat, index) => (
              <Picker.Item key={index} label={cat} value={cat} />
            ))}
          </Picker>

          <Text style={styles.label}>Min Price</Text>
          <TextInput style={styles.input} value={minPrice} onChangeText={setMinPrice} keyboardType="numeric" />

          <Text style={styles.label}>Max Price</Text>
          <TextInput style={styles.input} value={maxPrice} onChangeText={setMaxPrice} keyboardType="numeric" />

          <Text style={styles.label}>Fixed Price</Text>
          <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Negotiable Price</Text>
            <Switch value={isNegotiable} onValueChange={setIsNegotiable} />
          </View>

          <Text style={styles.label}>Description</Text>
          <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

          <Button title={isEdit ? 'Update Service' : 'Add Service'} onPress={handleSubmit} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
  picker: { height: 50, width: '100%', marginBottom: 10 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 },
});

export default ServiceFormScreen;
