'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, toggleTodo, deleteTodo, editTodo, setFilter, initializeTodos } from '@/store/todoSlice';
import type { RootState } from '@/store/store';
import type { TodoCategory } from '@/store/todoSlice';

export default function Home() {
  const [newTodo, setNewTodo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TodoCategory>('personal');
  const [editingTodo, setEditingTodo] = useState<{ id: string; text: string; category: TodoCategory } | null>(null);
  
  const todos = useSelector((state: RootState) => state.todos.todos);
  const filter = useSelector((state: RootState) => state.todos.filter);
  const dispatch = useDispatch();

  const categories: TodoCategory[] = ['work', 'personal', 'shopping', 'other'];

  useEffect(() => {
    dispatch(initializeTodos());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch(addTodo({ text: newTodo, category: selectedCategory }));
      setNewTodo('');
    }
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTodo && editingTodo.text.trim()) {
      dispatch(editTodo(editingTodo));
      setEditingTodo(null);
    }
  };

  const filteredTodos = todos.filter(todo => {
    const categoryMatch = filter.category === 'all' || todo.category === filter.category;
    const statusMatch = 
      filter.status === 'all' || 
      (filter.status === 'completed' && todo.completed) ||
      (filter.status === 'active' && !todo.completed);
    return categoryMatch && statusMatch;
  });

  // Calculate statistics
  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length,
    byCategory: categories.reduce((acc, category) => ({
      ...acc,
      [category]: todos.filter(todo => todo.category === category).length
    }), {} as Record<TodoCategory, number>)
  };

  return (
    <div className="min-h-screen bg-[#f7f3ed] p-4 md:p-8 font-mono">
      <main className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
        <h1 className="text-2xl md:text-3xl mb-6 md:mb-8 text-center text-gray-800">Todo List</h1>
        
        {/* Statistics Dashboard */}
        <div className="mb-6 md:mb-8 grid grid-cols-2 gap-3">
          {Object.entries({
            'Total Tasks': stats.total,
            'Completed': stats.completed,
            'Active': stats.active,
            'Categories': categories.length
          }).map(([label, value]) => (
            <div key={label} className="bg-[#f7f3ed] p-3 md:p-4 rounded-xl">
              <div className="text-xs md:text-sm text-gray-600">{label}</div>
              <div className="text-xl md:text-2xl text-gray-800">{value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-4 md:mb-6 flex flex-col md:flex-row gap-2 md:gap-4">
          <select
            value={filter.category}
            onChange={(e) => dispatch(setFilter({ category: e.target.value as TodoCategory | 'all' }))}
            className="w-full md:w-auto pl-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-gray-400"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filter.status}
            onChange={(e) => dispatch(setFilter({ status: e.target.value as 'all' | 'active' | 'completed' }))}
            className="w-full md:w-auto pl-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-gray-400"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Add Todo Form */}
        <form onSubmit={handleSubmit} className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row gap-2 md:gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as TodoCategory)}
                className="w-full md:w-32 pl-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-gray-400"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#ff5d3b] text-white rounded-lg text-sm hover:bg-[#ff4722] transition-colors whitespace-nowrap"
              >
                Add
              </button>
            </div>
          </div>
        </form>

        {/* Todo List */}
        <ul className="space-y-2 md:space-y-3">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 p-3 md:p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors bg-white"
            >
              {editingTodo?.id === todo.id ? (
                <form onSubmit={handleEdit} className="flex-1 flex flex-col md:flex-row gap-2 md:gap-3">
                  <input
                    type="text"
                    value={editingTodo.text}
                    onChange={(e) => setEditingTodo({ ...editingTodo, text: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                  />
                  <div className="flex gap-2">
                    <select
                      value={editingTodo.category}
                      onChange={(e) => setEditingTodo({ ...editingTodo, category: e.target.value as TodoCategory })}
                      className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="px-4 py-2 bg-[#ff5d3b] text-white rounded-lg text-sm">Save</button>
                    <button 
                      type="button" 
                      onClick={() => setEditingTodo(null)} 
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => dispatch(toggleTodo(todo.id))}
                    className="h-5 w-5 rounded-md border-gray-300 text-[#ff5d3b] focus:ring-[#ff5d3b]"
                  />
                  <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {todo.text}
                  </span>
                  <span className="hidden md:inline-block px-3 py-1 text-xs bg-gray-100 rounded-lg text-gray-600">
                    {todo.category}
                  </span>
                  <div className="flex gap-1 md:gap-2">
                    <button
                      onClick={() => setEditingTodo({ id: todo.id, text: todo.text, category: todo.category })}
                      className="px-2 md:px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => dispatch(deleteTodo(todo.id))}
                      className="px-2 md:px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
