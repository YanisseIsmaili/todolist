import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskType, setTaskType] = useState('Général');
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) setTasks(JSON.parse(storedTasks));
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme) setDarkMode(JSON.parse(storedTheme));
    };
    loadSettings();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    AsyncStorage.setItem('theme', JSON.stringify(darkMode));
  }, [darkMode]);

  const addTask = () => {
    if (title.trim() !== '') {
      setTasks([...tasks, { id: Date.now().toString(), title, description, completed: false, type: taskType }]);
      setTitle('');
      setDescription('');
      setTaskType('Général');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <View style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      <TouchableOpacity style={styles.themeButton} onPress={() => setDarkMode(!darkMode)}>
        <Text style={styles.themeButtonText}>{darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}</Text>
      </TouchableOpacity>
      <Text style={[styles.header, { color: darkMode ? '#61dafb' : '#007AFF' }]}>📜 Ma To-Do List</Text>
      <View style={[styles.inputContainer, darkMode ? styles.darkInputContainer : styles.lightInputContainer]}>
        <TextInput
          style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
          placeholder="Titre"
          placeholderTextColor={darkMode ? '#aaa' : '#555'}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
          placeholder="Description"
          placeholderTextColor={darkMode ? '#aaa' : '#555'}
          value={description}
          onChangeText={setDescription}
        />
        <Picker
          selectedValue={taskType}
          style={{ width: '100%', height: 50, color: darkMode ? '#fff' : '#000' }}
          onValueChange={(itemValue) => setTaskType(itemValue)}
        >
          <Picker.Item label="Général" value="Général" />
          <Picker.Item label="Travail" value="Travail" />
          <Picker.Item label="Personnel" value="Personnel" />
          <Picker.Item label="Urgent" value="Urgent" />
        </Picker>
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.taskItem, darkMode ? styles.darkTaskItem : styles.lightTaskItem]}>
            <TouchableOpacity style={styles.taskContent} onPress={() => toggleTask(item.id)}>
              <Text style={[styles.taskTitle, darkMode ? { color: '#fff' } : { color: '#000' }, item.completed && styles.taskCompleted]}>
                {item.title} ({item.type})
              </Text>
              <Text style={[styles.taskDescription, darkMode ? { color: '#ddd' } : { color: '#555' }]}>{item.description}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Ionicons name="trash" size={24} color="#ff4d4d" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
  
  
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 10 },
  darkContainer: { backgroundColor: '#1e1e1e' },
  lightContainer: { backgroundColor: '#fff' },
  themeButton: { backgroundColor: '#61dafb', padding: 10, borderRadius: 10, marginTop: 20 },
  themeButtonText: { fontSize: 16, fontWeight: 'bold' },
  header: { fontSize: 26, fontWeight: 'bold', marginVertical: 20 },
  inputContainer: { width: '100%', padding: 15, borderRadius: 10, alignItems: 'center' },
  darkInputContainer: { backgroundColor: '#2a2d36' },
  lightInputContainer: { backgroundColor: '#f5f5f5' },
  input: { width: '100%', height: 40, borderWidth: 1, borderRadius: 5, paddingLeft: 10, marginBottom: 10 },
  darkInput: { borderColor: '#61dafb', backgroundColor: '#333', color: '#fff' },
  lightInput: { borderColor: '#007AFF', backgroundColor: '#fff', color: '#000' },
  addButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 5, alignItems: 'center', width: '100%' },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  taskItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, marginVertical: 5, borderRadius: 5, width: '100%' },
  darkTaskItem: { backgroundColor: '#2a2d36' },
  lightTaskItem: { backgroundColor: '#f9f9f9' },
  taskTitle: { fontSize: 18, fontWeight: 'bold' },
  taskCompleted: { textDecorationLine: 'line-through', color: 'gray' },
  taskDescription: { fontSize: 14 }
});
