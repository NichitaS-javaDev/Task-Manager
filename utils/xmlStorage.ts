import * as FileSystem from 'expo-file-system'
import { TodoItem } from '../types/todo'

const TODO_FILE = `${FileSystem.documentDirectory}todos.xml`

const createInitialXML = () => `<?xml version="1.0" encoding="UTF-8"?>
<todos>
</todos>`

const todoToXML = (todo: TodoItem) => `
  <todo>
    <id>${todo.id}</id>
    <title>${todo.title}</title>
    <description>${todo.description || ''}</description>
    <completed>${todo.completed}</completed>
    <createdAt>${todo.createdAt}</createdAt>
    <dueDate>${todo.dueDate || ''}</dueDate>
  </todo>`

const extractValue = (xml: string, tag: string): string => {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`)
  const match = xml.match(regex)
  return match ? match[1] : ''
}

const xmlToTodo = (xml: string): TodoItem => ({
  id: extractValue(xml, 'id'),
  title: extractValue(xml, 'title'),
  description: extractValue(xml, 'description'),
  completed: extractValue(xml, 'completed') === 'true',
  createdAt: extractValue(xml, 'createdAt'),
  dueDate: extractValue(xml, 'dueDate') || undefined,
});

export const loadTodos = async (): Promise<TodoItem[]> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(TODO_FILE)
    if (!fileInfo.exists) {
      await FileSystem.writeAsStringAsync(TODO_FILE, createInitialXML())
      return []
    }

    const content = await FileSystem.readAsStringAsync(TODO_FILE)
    const todoMatches = content.match(/<todo>[\s\S]*?<\/todo>/g) || []
    return todoMatches.map(xmlToTodo)
  } catch (error) {
    console.error('Error loading todos:', error)
    return []
  }
}

export const saveTodo = async (todo: TodoItem): Promise<void> => {
  try {
    const todos = await loadTodos()
    const existingIndex = todos.findIndex((t) => t.id === todo.id)

    if (existingIndex >= 0) {
      todos[existingIndex] = todo
    } else {
      todos.push(todo)
    }

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<todos>
${todos.map(todoToXML).join('')}
</todos>`

    await FileSystem.writeAsStringAsync(TODO_FILE, xmlContent)
  } catch (error) {
    console.error('Error saving todo:', error)
    throw error
  }
}

export const deleteTodo = async (id: string): Promise<void> => {
  try {
    const todos = await loadTodos()
    const filteredTodos = todos.filter((todo) => todo.id !== id)

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<todos>
${filteredTodos.map(todoToXML).join('')}
</todos>`

    await FileSystem.writeAsStringAsync(TODO_FILE, xmlContent)
  } catch (error) {
    console.error('Error deleting todo:', error)
    throw error
  }
}
