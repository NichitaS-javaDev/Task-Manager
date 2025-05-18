import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TodoItem } from '../../types/todo';
import { deleteTodo, loadTodos } from '../../utils/xmlStorage';

export default function TodoListScreen() {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadTodoList();
    }, [])
  );

  const loadTodoList = async () => {
    const loadedTodos = await loadTodos();
    setTodos(loadedTodos);
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
    loadTodoList();
  };

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderItem = ({ item }: { item: TodoItem }) => (
    <View style={styles.todoItem}>
      <View style={styles.todoContent}>
        <Text style={styles.todoText}>{item.title}</Text>
        {item.dueDate && (
          <Text style={styles.dueDate}>Due: {formatDate(item.dueDate)}</Text>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEdit(item.id)} style={styles.editButton}>
          <Ionicons name="pencil" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/create')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  todoItem: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  todoContent: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    padding: 5,
  },
  deleteButton: {
    padding: 5,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 