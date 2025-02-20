import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Dimensions, KeyboardAvoidingView, Platform 
} from 'react-native';

const { width, height } = Dimensions.get('window'); // Récupération de la taille de lécrant

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: task, completed: false }]);
      setTask('');
    }
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>📝 Ma To-Do List</Text>

      {/* Champ d'ajout */}
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Ajouter une tâche..." 
          value={task} 
          onChangeText={setTask} 
          placeholderTextColor="#7f8c8d"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des tâches */}
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        style={styles.taskList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)} style={styles.taskTextContainer}>
              <Text style={[styles.taskText, item.completed && styles.completedTask]}>
                {item.text}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height * 0.06, // Adapt léspace en haut selon l'écran
    paddingHorizontal: width * 0.05,
    backgroundColor: '#ecf0f1',
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.03,
    backgroundColor: '#fff',
    fontSize: width * 0.045,
  },
  addButton: {
    marginLeft: width * 0.03,
    backgroundColor: '#2c3e50',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.045,
    borderRadius: width * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  taskList: {
    marginTop: height * 0.01,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.03,
    marginBottom: height * 0.015,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: width * 0.045,
    color: '#2c3e50',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  deleteButton: {
    padding: width * 0.02,
  },
  deleteText: {
    fontSize: width * 0.06,
    color: 'red',
  },
});

