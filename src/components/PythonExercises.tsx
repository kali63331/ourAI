import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Trophy, Filter, Target, Award } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface Exercise {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Basics' | 'Data Structures' | 'Algorithms' | 'OOP' | 'Advanced';
  description: string;
  hints: string[];
  solution: string;
  points: number;
}

const exercises: Exercise[] = [
  {
    id: '1',
    title: 'Hello World',
    difficulty: 'Easy',
    category: 'Basics',
    description: 'Write a program that prints "Hello, World!" to the console.',
    hints: ['Use the print() function', 'Strings are enclosed in quotes'],
    solution: 'print("Hello, World!")',
    points: 10
  },
  {
    id: '2',
    title: 'Sum of Two Numbers',
    difficulty: 'Easy',
    category: 'Basics',
    description: 'Create a function that takes two numbers and returns their sum.',
    hints: ['Use the def keyword to define a function', 'Use the + operator to add numbers'],
    solution: 'def sum_numbers(a, b):\n    return a + b',
    points: 15
  },
  {
    id: '3',
    title: 'FizzBuzz',
    difficulty: 'Medium',
    category: 'Algorithms',
    description: 'Write a program that prints numbers 1-100. For multiples of 3 print "Fizz", multiples of 5 print "Buzz", and multiples of both print "FizzBuzz".',
    hints: ['Use a for loop with range()', 'Use the modulo operator % to check divisibility', 'Use if-elif-else statements'],
    solution: 'for i in range(1, 101):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)',
    points: 25
  },
  {
    id: '4',
    title: 'Palindrome Checker',
    difficulty: 'Medium',
    category: 'Algorithms',
    description: 'Create a function that checks if a string is a palindrome (reads same forwards and backwards).',
    hints: ['Convert string to lowercase', 'Compare string with its reverse', 'Use string slicing [::-1]'],
    solution: 'def is_palindrome(s):\n    s = s.lower().replace(" ", "")\n    return s == s[::-1]',
    points: 30
  },
  {
    id: '5',
    title: 'Fibonacci Sequence',
    difficulty: 'Hard',
    category: 'Algorithms',
    description: 'Write a function that generates the first n numbers in the Fibonacci sequence.',
    hints: ['Use a loop or recursion', 'Each number is the sum of the previous two', 'Start with [0, 1]'],
    solution: 'def fibonacci(n):\n    if n <= 0:\n        return []\n    elif n == 1:\n        return [0]\n    elif n == 2:\n        return [0, 1]\n    \n    fib = [0, 1]\n    for i in range(2, n):\n        fib.append(fib[i-1] + fib[i-2])\n    return fib',
    points: 50
  },
  {
    id: '6',
    title: 'List Comprehension',
    difficulty: 'Easy',
    category: 'Data Structures',
    description: 'Create a list of squares for numbers 1-10 using list comprehension.',
    hints: ['Use [expression for item in iterable]', 'Use range() for numbers', 'Use ** for exponentiation'],
    solution: 'squares = [x**2 for x in range(1, 11)]',
    points: 15
  },
  {
    id: '7',
    title: 'Dictionary Merge',
    difficulty: 'Medium',
    category: 'Data Structures',
    description: 'Write a function to merge two dictionaries, with values from the second dict taking precedence.',
    hints: ['Use the update() method', 'Or use the ** unpacking operator', 'Or use the | operator in Python 3.9+'],
    solution: 'def merge_dicts(dict1, dict2):\n    return {**dict1, **dict2}\n# or: return dict1 | dict2',
    points: 20
  },
  {
    id: '8',
    title: 'Class Inheritance',
    difficulty: 'Hard',
    category: 'OOP',
    description: 'Create a base class Animal and derived classes Dog and Cat with their own speak() methods.',
    hints: ['Use class keyword', 'Inherit with class Child(Parent):', 'Override methods in child classes'],
    solution: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n\nclass Dog(Animal):\n    def speak(self):\n        return f"{self.name} says Woof!"\n\nclass Cat(Animal):\n    def speak(self):\n        return f"{self.name} says Meow!"',
    points: 40
  },
  {
    id: '9',
    title: 'File I/O',
    difficulty: 'Medium',
    category: 'Advanced',
    description: 'Write a function that reads a text file and counts the number of words.',
    hints: ['Use with open() to read files', 'Use split() to get words', 'Use len() to count'],
    solution: 'def count_words(filename):\n    with open(filename, \'r\') as f:\n        content = f.read()\n        words = content.split()\n        return len(words)',
    points: 30
  },
  {
    id: '10',
    title: 'Exception Handling',
    difficulty: 'Medium',
    category: 'Advanced',
    description: 'Create a function that safely divides two numbers with proper exception handling.',
    hints: ['Use try-except blocks', 'Handle ZeroDivisionError', 'Handle TypeError for non-numeric inputs'],
    solution: 'def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return "Cannot divide by zero"\n    except TypeError:\n        return "Invalid input types"',
    points: 25
  }
];

export const PythonExercises = () => {
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('completedExercises');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [showSolution, setShowSolution] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    localStorage.setItem('completedExercises', JSON.stringify(Array.from(completedExercises)));
  }, [completedExercises]);

  const toggleComplete = (id: string) => {
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredExercises = exercises.filter(ex => {
    const matchesDifficulty = difficultyFilter === 'all' || ex.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === 'all' || ex.category === categoryFilter;
    return matchesDifficulty && matchesCategory;
  });

  const totalPoints = exercises.reduce((sum, ex) => sum + ex.points, 0);
  const earnedPoints = Array.from(completedExercises).reduce((sum, id) => {
    const exercise = exercises.find(ex => ex.id === id);
    return sum + (exercise?.points || 0);
  }, 0);
  const progressPercentage = (earnedPoints / totalPoints) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Hard': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return '';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Basics': return '📚';
      case 'Data Structures': return '🗂️';
      case 'Algorithms': return '🔢';
      case 'OOP': return '🏗️';
      case 'Advanced': return '🚀';
      default: return '📝';
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header with Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-card hover-lift">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-python flex items-center justify-center animate-pulse-glow">
              <Trophy className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedExercises.size}/{exercises.length}</p>
              <p className="text-xs text-muted-foreground">Exercises Completed</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-message/10 hover-lift">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-bot flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{earnedPoints}/{totalPoints}</p>
              <p className="text-xs text-muted-foreground">Points Earned</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-card hover-lift">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.round(progressPercentage)}%</p>
              <p className="text-xs text-muted-foreground">Progress</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="p-4 bg-gradient-card">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Overall Progress</span>
            <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4 bg-gradient-card">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Basics">Basics</SelectItem>
              <SelectItem value="Data Structures">Data Structures</SelectItem>
              <SelectItem value="Algorithms">Algorithms</SelectItem>
              <SelectItem value="OOP">OOP</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Exercises List */}
      <div className="grid gap-4">
        {filteredExercises.map((exercise) => {
          const isCompleted = completedExercises.has(exercise.id);
          const isSolutionVisible = showSolution === exercise.id;

          return (
            <Card key={exercise.id} className="p-4 hover-lift transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => toggleComplete(exercise.id)}
                    className="mt-1"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 animate-pulse-glow" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getCategoryIcon(exercise.category)}</span>
                      <h3 className={`font-semibold ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                        {exercise.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {exercise.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {exercise.category}
                      </Badge>
                      <Badge className="text-xs bg-primary/10 text-primary">
                        {exercise.points} pts
                      </Badge>
                    </div>
                  </div>
                </div>
                <Badge className={getDifficultyColor(exercise.difficulty)}>
                  {exercise.difficulty}
                </Badge>
              </div>

              {!isCompleted && (
                <div className="space-y-3 mt-4">
                  <div>
                    <h4 className="text-xs font-semibold mb-2 text-muted-foreground">💡 HINTS:</h4>
                    <ul className="space-y-1">
                      {exercise.hints.map((hint, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {hint}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSolution(isSolutionVisible ? null : exercise.id)}
                  >
                    {isSolutionVisible ? '👁️ Hide' : '🔍 Show'} Solution
                  </Button>

                  {isSolutionVisible && (
                    <Card className="p-3 bg-muted/50 animate-slide-up">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold">Solution:</span>
                      </div>
                      <pre className="font-mono text-xs whitespace-pre-wrap">
                        {exercise.solution}
                      </pre>
                    </Card>
                  )}
                </div>
              )}

              {isCompleted && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-500">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completed! +{exercise.points} points</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filteredExercises.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No exercises match your filters.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={() => {
              setDifficultyFilter('all');
              setCategoryFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
};
