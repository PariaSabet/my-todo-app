import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TodoCategory = 'work' | 'personal' | 'shopping' | 'other';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: TodoCategory;
  createdAt: string;
}

interface TodoState {
  todos: Todo[];
  filter: {
    category: TodoCategory | 'all';
    status: 'all' | 'active' | 'completed';
  };
}

const initialState: TodoState = {
  todos: [],
  filter: {
    category: 'all',
    status: 'all',
  }
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    initializeTodos: (state) => {
      if (typeof window !== 'undefined') {
        try {
          const savedTodos = localStorage.getItem('todos');
          if (savedTodos) {
            state.todos = JSON.parse(savedTodos);
          }
        } catch (error) {
          console.error('Error loading todos from localStorage:', error);
        }
      }
    },
    addTodo: (state, action: PayloadAction<{ text: string; category: TodoCategory }>) => {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: action.payload.text,
        completed: false,
        category: action.payload.category,
        createdAt: new Date().toISOString(),
      };
      state.todos.push(newTodo);
      localStorage.setItem('todos', JSON.stringify(state.todos));
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('todos', JSON.stringify(state.todos));
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      localStorage.setItem('todos', JSON.stringify(state.todos));
    },
    setFilter: (state, action: PayloadAction<{ category?: TodoCategory | 'all'; status?: 'all' | 'active' | 'completed' }>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    editTodo: (state, action: PayloadAction<{ id: string; text: string; category: TodoCategory }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.text = action.payload.text;
        todo.category = action.payload.category;
        localStorage.setItem('todos', JSON.stringify(state.todos));
      }
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo, setFilter, editTodo, initializeTodos } = todoSlice.actions;
export default todoSlice.reducer; 