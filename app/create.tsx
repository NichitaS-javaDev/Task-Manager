import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TodoItem } from '../types/todo';
import { loadTodos, saveTodo } from '../utils/xmlStorage';

export default function CreateEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (id) {
      loadTodo();
    }
  }, [id]);

  const loadTodo = async () => {
    const todos = await loadTodos();
    const todo = todos.find(t => t.id === id);
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      if (todo.dueDate) {
        setDueDate(new Date(todo.dueDate));
      }
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    const todo: TodoItem = {
      id: id || Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: id ? new Date().toISOString() : new Date().toISOString(),
      dueDate: dueDate ? dueDate.toISOString() : undefined,
    };

    try {
      await saveTodo(todo);
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to save todo');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        placeholderTextColor="#666"
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        value={description}
        onChangeText={setDescription}
        placeholder="Description (optional)"
        placeholderTextColor="#666"
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity 
        style={styles.dateButton} 
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {dueDate ? dueDate.toLocaleString() : 'Set Due Date (optional)'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{id ? 'Update' : 'Create'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 