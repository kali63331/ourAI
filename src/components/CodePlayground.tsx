import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Play, RotateCcw, Code2, Save, FileDown, Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const templates = {
  blank: '# Write your Python code here\nprint("Hello, Python!")',
  function: '# Function template\ndef my_function(param1, param2):\n    """\n    Description of function\n    """\n    result = param1 + param2\n    return result\n\n# Test the function\nprint(my_function(5, 3))',
  class: '# Class template\nclass MyClass:\n    def __init__(self, name):\n        self.name = name\n    \n    def greet(self):\n        return f"Hello, {self.name}!"\n\n# Create instance\nobj = MyClass("Python")\nprint(obj.greet())',
  dataAnalysis: '# Data analysis template\nimport pandas as pd\n\n# Sample data\ndata = {\n    "name": ["Alice", "Bob", "Charlie"],\n    "age": [25, 30, 35],\n    "city": ["NYC", "LA", "Chicago"]\n}\n\n# Create DataFrame\ndf = pd.DataFrame(data)\nprint(df.head())',
};

export const CodePlayground = () => {
  const [code, setCode] = useState(() => {
    return localStorage.getItem('pythonPlaygroundCode') || templates.blank;
  });
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [lineCount, setLineCount] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const lines = code.split('\n').length;
    setLineCount(lines);
  }, [code]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem('pythonPlaygroundCode', code);
    }, 2000);
    return () => clearInterval(saveInterval);
  }, [code]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const lines = code.split('\n');
      const outputLines = [];
      
      // Simple simulation of print statements
      for (const line of lines) {
        if (line.trim().startsWith('print(')) {
          const match = line.match(/print\((.*?)\)/);
          if (match) {
            outputLines.push(`>>> ${match[1].replace(/['"]/g, '')}`);
          }
        }
      }
      
      if (outputLines.length === 0) {
        setOutput('✓ Code executed successfully (no output to display)\n\nNote: This is a simulated environment. Connect to a Python backend for real execution.');
      } else {
        setOutput(outputLines.join('\n') + '\n\n✓ Execution complete');
      }
      
      toast({
        title: "Code Executed",
        description: "Your Python code has been executed successfully!",
      });
    } catch (error) {
      setOutput(`❌ Error: ${error}\n\nPlease check your code syntax.`);
      toast({
        title: "Error",
        description: "Failed to execute code",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(templates.blank);
    setOutput('');
    toast({
      title: "Reset",
      description: "Playground has been reset",
    });
  };

  const handleSave = () => {
    localStorage.setItem('pythonPlaygroundCode', code);
    toast({
      title: "Saved",
      description: "Your code has been saved locally",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'python_code.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded",
      description: "Code downloaded as python_code.py",
    });
  };

  const loadTemplate = (template: keyof typeof templates) => {
    setCode(templates[template]);
    setOutput('');
  };

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-python flex items-center justify-center animate-pulse-glow">
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Python Code Playground</h2>
            <p className="text-xs text-muted-foreground">{lineCount} lines • Auto-saved</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select onValueChange={(value) => loadTemplate(value as keyof typeof templates)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Load Template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blank">Blank</SelectItem>
              <SelectItem value="function">Function</SelectItem>
              <SelectItem value="class">Class</SelectItem>
              <SelectItem value="dataAnalysis">Data Analysis</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            variant="outline"
            size="sm"
          >
            {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          <Button
            onClick={handleSave}
            variant="outline"
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Download
          </Button>
          
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          <Button
            onClick={handleRunCode}
            disabled={isRunning}
            className="bg-gradient-python hover-lift"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
        </div>
      </div>

      <Card className={`overflow-hidden ${isDarkTheme ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="flex">
          <div className={`w-12 py-4 text-right pr-3 select-none ${isDarkTheme ? 'bg-slate-900 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1} className="font-mono text-xs leading-6">
                {i + 1}
              </div>
            ))}
          </div>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`min-h-[400px] font-mono text-sm border-0 focus-visible:ring-0 resize-none ${
              isDarkTheme ? 'bg-slate-950 text-green-400' : 'bg-white text-slate-900'
            }`}
            placeholder="Write your Python code here..."
            spellCheck={false}
          />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-card border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Console Output
          </h3>
          {output && (
            <Button variant="ghost" size="sm" onClick={() => setOutput('')}>
              Clear
            </Button>
          )}
        </div>
        <pre className="font-mono text-sm whitespace-pre-wrap min-h-[120px] text-foreground">
          {output || '💡 No output yet. Click "Run Code" to execute your Python code.\n\nTip: Use print() statements to see output in the console.'}
        </pre>
      </Card>

      <Card className="p-4 bg-gradient-message/10 border-primary/20">
        <h4 className="text-xs font-semibold mb-2 flex items-center gap-2">
          <span className="text-lg">💡</span> Quick Tips
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Your code is automatically saved every 2 seconds</li>
          <li>• Use the templates for quick starts on common patterns</li>
          <li>• Download your code as a .py file to run it locally</li>
          <li>• This is a learning environment - connect to a real Python backend for actual execution</li>
        </ul>
      </Card>
    </div>
  );
};
