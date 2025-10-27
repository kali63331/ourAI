import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Copy, Check, Search, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PythonCheatSheet = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const copyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const CodeBlock = ({ code, id, title }: { code: string; id: string; title?: string }) => (
    <div className="group relative">
      {title && <h4 className="text-xs font-semibold mb-2 text-muted-foreground">{title}</h4>}
      <Card className="p-3 bg-muted/50 hover:bg-muted transition-colors">
        <div className="flex items-start justify-between gap-2">
          <pre className="font-mono text-xs flex-1 whitespace-pre-wrap">{code}</pre>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => toggleFavorite(id)}
            >
              <Star className={`w-3 h-3 ${favorites.has(id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => copyCode(code, id)}
            >
              {copiedCode === id ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-python flex items-center justify-center animate-pulse-glow">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Python Cheat Sheet</h2>
            <p className="text-xs text-muted-foreground">Quick reference for Python syntax</p>
          </div>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search examples..."
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="data-types">Data Types</TabsTrigger>
          <TabsTrigger value="control">Control</TabsTrigger>
          <TabsTrigger value="functions">Functions</TabsTrigger>
          <TabsTrigger value="oop">OOP</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-4">
          <Card className="p-4 bg-gradient-card hover-lift">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">📝</span>
              Variables & Output
            </h3>
            <div className="space-y-3">
              <CodeBlock 
                id="var-1"
                title="Variable Assignment"
                code='name = "Python"\nage = 30\npi = 3.14\nis_active = True'
              />
              <CodeBlock 
                id="var-2"
                title="Print Output"
                code='print("Hello, World!")\nprint(f"My name is {name}")\nprint(f"Sum: {5 + 3}")'
              />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-card hover-lift">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">💬</span>
              Comments
            </h3>
            <CodeBlock 
              id="comment-1"
              code='# Single line comment\n\n"""\nMulti-line comment\nor docstring\n"""\n\n# TODO: Add feature here'
            />
          </Card>

          <Card className="p-4 bg-gradient-card hover-lift">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">⌨️</span>
              Input
            </h3>
            <CodeBlock 
              id="input-1"
              code='name = input("Enter your name: ")\nage = int(input("Enter your age: "))\nheight = float(input("Enter height: "))'
            />
          </Card>
        </TabsContent>

        <TabsContent value="data-types" className="space-y-4">
          <Card className="p-4 bg-gradient-card hover-lift">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">📋</span>
              Lists
            </h3>
            <div className="space-y-3">
              <CodeBlock 
                id="list-1"
                title="Creating & Modifying Lists"
                code='fruits = ["apple", "banana", "cherry"]\nfruits.append("orange")  # Add to end\nfruits.insert(1, "mango")  # Insert at index\nfruits.remove("banana")  # Remove by value\nfruits.pop()  # Remove last item'
              />
              <CodeBlock 
                id="list-2"
                title="Accessing Lists"
                code='fruits[0]  # First item\nfruits[-1]  # Last item\nfruits[1:3]  # Slicing\nlen(fruits)  # Length'
              />
              <CodeBlock 
                id="list-3"
                title="List Methods"
                code='fruits.sort()  # Sort in place\nfruits.reverse()  # Reverse in place\nfruits.count("apple")  # Count occurrences\nfruits.clear()  # Remove all items'
              />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-card hover-lift">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">📖</span>
              Dictionaries
            </h3>
            <div className="space-y-3">
              <CodeBlock 
                id="dict-1"
                code='person = {"name": "John", "age": 30}\nperson["name"]  # Access value\nperson["city"] = "NYC"  # Add key\nperson.keys()  # All keys\nperson.values()  # All values\nperson.items()  # Key-value pairs'
              />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-card hover-lift">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">🎯</span>
              Sets & Tuples
            </h3>
            <div className="space-y-3">
              <CodeBlock 
                id="set-1"
                title="Sets (unique items)"
                code='numbers = {1, 2, 3, 4}\nnumbers.add(5)\nnumbers.remove(2)\nset1 | set2  # Union\nset1 & set2  # Intersection'
              />
              <CodeBlock 
                id="tuple-1"
                title="Tuples (immutable)"
                code='coordinates = (10, 20)\nx, y = coordinates  # Unpacking\nlen(coordinates)'
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="control" className="space-y-4">
          <Card className="p-4 bg-gradient-card hover-lift">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">🔀</span>
              If Statements
            </h3>
            <CodeBlock 
              id="if-1"
              code='if x > 10:\n    print("Greater")\nelif x == 10:\n    print("Equal")\nelse:\n    print("Less")\n\n# Ternary operator\nresult = "Even" if x % 2 == 0 else "Odd"'
            />
          </Card>

          <Card className="p-4 bg-gradient-card hover-lift">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">🔁</span>
              Loops
            </h3>
            <div className="space-y-3">
              <CodeBlock 
                id="loop-1"
                title="For Loop"
                code='for i in range(5):\n    print(i)\n\nfor fruit in fruits:\n    print(fruit)\n\nfor i, fruit in enumerate(fruits):\n    print(f"{i}: {fruit}")'
              />
              <CodeBlock 
                id="loop-2"
                title="While Loop"
                code='while x < 10:\n    x += 1\n    if x == 5:\n        continue  # Skip to next iteration\n    if x == 8:\n        break  # Exit loop'
              />
              <CodeBlock 
                id="loop-3"
                title="List Comprehension"
                code='squares = [x**2 for x in range(10)]\nevens = [x for x in range(10) if x % 2 == 0]\nmatrix = [[i+j for j in range(3)] for i in range(3)]'
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="functions" className="space-y-4">
          <Card className="p-4 bg-gradient-card hover-lift">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">⚡</span>
              Function Basics
            </h3>
            <div className="space-y-3">
              <CodeBlock 
                id="func-1"
                title="Basic Function"
                code='def greet(name):\n    """Greet someone by name"""\n    return f"Hello, {name}!"\n\nresult = greet("Alice")'
              />
              <CodeBlock 
                id="func-2"
                title="Default Arguments"
                code='def power(x, n=2):\n    return x ** n\n\npower(5)     # 25\npower(5, 3)  # 125'
              />
              <CodeBlock 
                id="func-3"
                title="Lambda Functions"
                code='square = lambda x: x ** 2\nadd = lambda a, b: a + b\n\nnumbers = [1, 2, 3, 4]\nsquared = list(map(lambda x: x**2, numbers))'
              />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-card hover-lift">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">📦</span>
              Args & Kwargs
            </h3>
            <CodeBlock 
              id="args-1"
              code='def func(*args, **kwargs):\n    print(args)    # Tuple of positional args\n    print(kwargs)  # Dict of keyword args\n\nfunc(1, 2, 3, name="John", age=30)'
            />
          </Card>
        </TabsContent>

        <TabsContent value="oop" className="space-y-4">
          <Card className="p-4 bg-gradient-card hover-lift">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">🏗️</span>
              Classes
            </h3>
            <CodeBlock 
              id="class-1"
              code='class Dog:\n    # Class variable\n    species = "Canis familiaris"\n    \n    def __init__(self, name, age):\n        # Instance variables\n        self.name = name\n        self.age = age\n    \n    def bark(self):\n        return f"{self.name} says woof!"\n    \n    def __str__(self):\n        return f"{self.name} is {self.age} years old"\n\nmy_dog = Dog("Buddy", 3)\nprint(my_dog.bark())'
            />
          </Card>

          <Card className="p-4 bg-gradient-card hover-lift">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">🔗</span>
              Inheritance
            </h3>
            <CodeBlock 
              id="inherit-1"
              code='class Animal:\n    def __init__(self, name):\n        self.name = name\n    \n    def speak(self):\n        pass\n\nclass Cat(Animal):\n    def speak(self):\n        return f"{self.name} says Meow!"\n\nclass Dog(Animal):\n    def speak(self):\n        return f"{self.name} says Woof!"\n\ncat = Cat("Whiskers")\nprint(cat.speak())'
            />
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <Card className="p-4 bg-gradient-card hover-lift">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">📚</span>
              Importing Modules
            </h3>
            <div className="space-y-3">
              <CodeBlock 
                id="import-1"
                code='import math\nmath.sqrt(16)\n\nfrom math import sqrt, pi\nsqrt(25)\n\nimport math as m\nm.floor(4.7)\n\nfrom datetime import datetime as dt\nnow = dt.now()'
              />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-card hover-lift">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">📂</span>
              File Operations
            </h3>
            <div className="space-y-3">
              <CodeBlock 
                id="file-1"
                title="Reading Files"
                code='with open("file.txt", "r") as f:\n    content = f.read()\n    # or\n    lines = f.readlines()\n    # or\n    for line in f:\n        print(line)'
              />
              <CodeBlock 
                id="file-2"
                title="Writing Files"
                code='with open("file.txt", "w") as f:\n    f.write("Hello, World!\\n")\n    f.writelines(["Line 1\\n", "Line 2\\n"])\n\n# Append mode\nwith open("file.txt", "a") as f:\n    f.write("New line\\n")'
              />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-card hover-lift">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              Error Handling
            </h3>
            <CodeBlock 
              id="error-1"
              code='try:\n    result = 10 / 0\nexcept ZeroDivisionError as e:\n    print(f"Error: {e}")\nexcept Exception as e:\n    print(f"Unexpected error: {e}")\nelse:\n    print("No errors occurred")\nfinally:\n    print("This always runs")'
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
