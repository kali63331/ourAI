import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Search, FileCode, Star, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Snippet {
  id: string;
  title: string;
  category: string;
  description: string;
  code: string;
}

const snippets: Snippet[] = [
  {
    id: '1',
    title: 'Read File',
    category: 'File I/O',
    description: 'Read contents from a text file',
    code: `with open('file.txt', 'r') as f:
    content = f.read()
    print(content)`
  },
  {
    id: '2',
    title: 'Write File',
    category: 'File I/O',
    description: 'Write text to a file',
    code: `with open('file.txt', 'w') as f:
    f.write('Hello, World!')`
  },
  {
    id: '3',
    title: 'List Comprehension',
    category: 'Data Structures',
    description: 'Create lists using comprehension',
    code: `# Squares of even numbers
evens_squared = [x**2 for x in range(10) if x % 2 == 0]`
  },
  {
    id: '4',
    title: 'Dictionary Comprehension',
    category: 'Data Structures',
    description: 'Create dictionaries using comprehension',
    code: `# Create dict from two lists
keys = ['a', 'b', 'c']
values = [1, 2, 3]
my_dict = {k: v for k, v in zip(keys, values)}`
  },
  {
    id: '5',
    title: 'Try-Except',
    category: 'Error Handling',
    description: 'Handle exceptions gracefully',
    code: `try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")
finally:
    print("Cleanup code here")`
  },
  {
    id: '6',
    title: 'API Request',
    category: 'Web',
    description: 'Make HTTP GET request',
    code: `import requests

response = requests.get('https://api.example.com/data')
data = response.json()
print(data)`
  },
  {
    id: '7',
    title: 'Date & Time',
    category: 'Utilities',
    description: 'Work with dates and times',
    code: `from datetime import datetime

now = datetime.now()
formatted = now.strftime('%Y-%m-%d %H:%M:%S')
print(formatted)`
  },
  {
    id: '8',
    title: 'JSON Operations',
    category: 'Data',
    description: 'Parse and create JSON',
    code: `import json

# Parse JSON
data = json.loads('{"name": "John", "age": 30}')

# Create JSON
json_str = json.dumps({"name": "Jane", "age": 25})`
  }
];

export const CodeSnippets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('favoriteSnippets');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('favoriteSnippets', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || snippet.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const copyToClipboard = async (snippet: Snippet) => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopiedId(snippet.id);
      setTimeout(() => setCopiedId(null), 2000);
      toast({
        title: "Copied!",
        description: "Code snippet copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
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

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-python flex items-center justify-center animate-pulse-glow">
          <FileCode className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Code Snippets Library</h2>
          <p className="text-xs text-muted-foreground">{snippets.length} ready-to-use snippets</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search snippets..."
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="File I/O">File I/O</SelectItem>
            <SelectItem value="Data Structures">Data Structures</SelectItem>
            <SelectItem value="Error Handling">Error Handling</SelectItem>
            <SelectItem value="Web">Web</SelectItem>
            <SelectItem value="Utilities">Utilities</SelectItem>
            <SelectItem value="Data">Data</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredSnippets.map((snippet) => (
          <Card key={snippet.id} className="p-4 hover-lift transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{snippet.title}</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    onClick={() => toggleFavorite(snippet.id)}
                  >
                    <Star className={`w-4 h-4 ${favorites.has(snippet.id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {snippet.description}
                </p>
              </div>
              <Badge variant="outline">{snippet.category}</Badge>
            </div>

            <Card className="p-3 bg-muted/50">
              <pre className="font-mono text-xs whitespace-pre-wrap overflow-x-auto">
                {snippet.code}
              </pre>
            </Card>

            <Button
              variant="ghost"
              size="sm"
              className="mt-3"
              onClick={() => copyToClipboard(snippet)}
            >
              {copiedId === snippet.id ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </>
              )}
            </Button>
          </Card>
        ))}
      </div>

      {filteredSnippets.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No snippets found matching your search.</p>
        </Card>
      )}
    </div>
  );
};
