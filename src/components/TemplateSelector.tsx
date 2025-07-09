'use client';

import { useState } from 'react';

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'react' | 'html' | 'javascript' | 'typescript';
  files: Record<string, string>;
}

const TEMPLATES: Template[] = [
  {
    id: 'react-counter',
    name: 'React Counter',
    description: 'Simple counter component with useState hook',
    icon: '#',
    category: 'react',
    files: {
      'Counter.tsx': `import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Counter App</h1>
      <div style={{ 
        fontSize: '48px', 
        margin: '20px 0',
        color: '#007acc'
      }}>
        {count}
      </div>
      <div>
        <button 
          onClick={() => setCount(count - 1)}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            fontSize: '16px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Decrease
        </button>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            fontSize: '16px',
            backgroundColor: '#44ff44',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Increase
        </button>
      </div>
      <button 
        onClick={() => setCount(0)}
        style={{
          padding: '8px 16px',
          marginTop: '20px',
          fontSize: '14px',
          backgroundColor: '#888',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Reset
      </button>
    </div>
  );
}`
    }
  },
  {
    id: 'react-todo',
    name: 'Todo List',
    description: 'Interactive todo list with add/remove functionality',
    icon: '✓',
    category: 'react',
    files: {
      'TodoApp.tsx': `import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build something awesome', completed: false }
  ]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: inputValue, completed: false }
      ]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '20px auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Todo List</h1>
      
      <div style={{ marginBottom: '20px', display: 'flex' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px 0 0 4px',
            fontSize: '16px'
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '0 4px 4px 0',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Add
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              margin: '5px 0',
              backgroundColor: todo.completed ? '#f0f0f0' : 'white',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              style={{ marginRight: '10px' }}
            />
            <span
              style={{
                flex: 1,
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#888' : '#333'
              }}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '5px 10px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}`
    }
  },
  {
    id: 'html-landing',
    name: 'Landing Page',
    description: 'Simple HTML landing page with CSS styling',
    icon: '🌐',
    category: 'html',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome Landing Page</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem 0;
            text-align: center;
        }
        
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .features {
            padding: 4rem 0;
            background: #f8f9fa;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .feature {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .cta {
            background: #007acc;
            color: white;
            padding: 4rem 0;
            text-align: center;
        }
        
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: white;
            color: #007acc;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 1rem;
            transition: transform 0.3s ease;
        }
        
        .btn:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>Welcome to My Website</h1>
            <p class="subtitle">Building amazing web experiences</p>
        </div>
    </header>

    <section class="features">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 1rem;">Why Choose Us?</h2>
            <div class="features-grid">
                <div class="feature">
                    <div class="feature-icon">⚡</div>
                    <h3>Fast Performance</h3>
                    <p>Lightning fast loading times and optimized code for the best user experience.</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🎨</div>
                    <h3>Beautiful Design</h3>
                    <p>Modern, clean designs that look great on all devices and screen sizes.</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🔧</div>
                    <h3>Easy to Use</h3>
                    <p>Intuitive interfaces and user-friendly features that anyone can master.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="cta">
        <div class="container">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of satisfied customers today!</p>
            <a href="#" class="btn">Get Started Now</a>
        </div>
    </section>
</body>
</html>`
    }
  },
  {
    id: 'js-calculator',
    name: 'Calculator',
    description: 'Interactive calculator with JavaScript',
    icon: '🧮',
    category: 'javascript',
    files: {
      'calculator.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .calculator {
            background: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            width: 300px;
        }
        
        .display {
            width: 100%;
            height: 60px;
            font-size: 24px;
            text-align: right;
            padding: 0 15px;
            border: 2px solid #ddd;
            border-radius: 8px;
            margin-bottom: 15px;
            background: #f8f9fa;
        }
        
        .buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }
        
        button {
            height: 60px;
            font-size: 18px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .number, .decimal {
            background: #e9ecef;
            color: #333;
        }
        
        .operator {
            background: #007acc;
            color: white;
        }
        
        .equals {
            background: #28a745;
            color: white;
        }
        
        .clear {
            background: #dc3545;
            color: white;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        button:active {
            transform: translateY(0);
        }
    </style>
</head>
<body>
    <div class="calculator">
        <input type="text" class="display" id="display" readonly>
        <div class="buttons">
            <button class="clear" onclick="clearDisplay()">C</button>
            <button class="operator" onclick="appendToDisplay('/')">/</button>
            <button class="operator" onclick="appendToDisplay('*')">×</button>
            <button class="operator" onclick="deleteLast()">⌫</button>
            
            <button class="number" onclick="appendToDisplay('7')">7</button>
            <button class="number" onclick="appendToDisplay('8')">8</button>
            <button class="number" onclick="appendToDisplay('9')">9</button>
            <button class="operator" onclick="appendToDisplay('-')">-</button>
            
            <button class="number" onclick="appendToDisplay('4')">4</button>
            <button class="number" onclick="appendToDisplay('5')">5</button>
            <button class="number" onclick="appendToDisplay('6')">6</button>
            <button class="operator" onclick="appendToDisplay('+')">+</button>
            
            <button class="number" onclick="appendToDisplay('1')">1</button>
            <button class="number" onclick="appendToDisplay('2')">2</button>
            <button class="number" onclick="appendToDisplay('3')">3</button>
            <button class="equals" onclick="calculateResult()" rowspan="2">=</button>
            
            <button class="number" onclick="appendToDisplay('0')" style="grid-column: span 2;">0</button>
            <button class="decimal" onclick="appendToDisplay('.')">.</button>
        </div>
    </div>

    <script>
        let display = document.getElementById('display');
        let currentInput = '';
        let operator = '';
        let previousInput = '';

        function appendToDisplay(value) {
            display.value += value;
        }

        function clearDisplay() {
            display.value = '';
            currentInput = '';
            operator = '';
            previousInput = '';
        }

        function deleteLast() {
            display.value = display.value.slice(0, -1);
        }

        function calculateResult() {
            try {
                // Replace × with * for evaluation
                let expression = display.value.replace(/×/g, '*');
                let result = eval(expression);
                display.value = result;
            } catch (error) {
                display.value = 'Error';
                setTimeout(clearDisplay, 1500);
            }
        }

        // Keyboard support
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            if ('0123456789+-*/.'.includes(key)) {
                if (key === '*') {
                    appendToDisplay('×');
                } else {
                    appendToDisplay(key);
                }
            } else if (key === 'Enter' || key === '=') {
                calculateResult();
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                clearDisplay();
            } else if (key === 'Backspace') {
                deleteLast();
            }
        });
    </script>
</body>
</html>`
    }
  }
];

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

export default function TemplateSelector({ isOpen, onClose, onSelectTemplate }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'react', label: 'React' },
    { id: 'html', label: 'HTML/CSS' },
    { id: 'javascript', label: 'JavaScript' },
  ];

  const filteredTemplates = TEMPLATES.filter(template => 
    selectedCategory === 'all' || template.category === selectedCategory
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Template Selector Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-[#2d2d30] border border-[#3e3e42] rounded-lg shadow-xl w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3e3e42]">
          <h2 className="text-lg font-semibold text-[#cccccc]">🚀 Choose a Template</h2>
          <button
            onClick={onClose}
            className="text-[#858585] hover:text-[#cccccc] text-xl"
          >
            ×
          </button>
        </div>

        {/* Category Filter */}
        <div className="p-4 border-b border-[#3e3e42]">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 text-xs rounded whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#007acc] text-white'
                    : 'bg-[#3e3e42] text-[#cccccc] hover:bg-[#4e4e52]'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="p-4 bg-[#252526] border border-[#3e3e42] rounded-lg hover:bg-[#2a2d2e] transition-colors cursor-pointer"
                onClick={() => onSelectTemplate(template)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{template.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#cccccc] mb-1">{template.name}</h3>
                    <p className="text-sm text-[#858585] mb-2">{template.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#007acc] bg-[#007acc20] px-2 py-1 rounded">
                        {template.category}
                      </span>
                      <span className="text-xs text-[#858585]">
                        {Object.keys(template.files).length} file{Object.keys(template.files).length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#3e3e42] text-xs text-[#858585]">
          💡 Click a template to start coding immediately with a working example
        </div>
      </div>
    </>
  );
}