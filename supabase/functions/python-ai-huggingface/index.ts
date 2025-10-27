import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Enhanced Python knowledge base with better question detection
const generatePythonResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase()
  
  // Classes and OOP
  if (lowerMessage.includes('class') && !lowerMessage.includes('first class')) {
    return `Working with classes in Python:

\`\`\`python
# Define a class
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def bark(self):
        return f"{self.name} says Woof!"
    
    def get_age(self):
        return f"{self.name} is {self.age} years old"

# Create instances
my_dog = Dog("Buddy", 3)
print(my_dog.bark())
print(my_dog.get_age())

# Inheritance
class GoldenRetriever(Dog):
    def __init__(self, name, age, color):
        super().__init__(name, age)
        self.color = color
    
    def describe(self):
        return f"{self.name} is a {self.color} Golden Retriever"
\`\`\`

Classes help you organize code and create reusable objects!`
  }
  
  // Lists and data structures
  if ((lowerMessage.includes('list') || lowerMessage.includes('array')) && 
      !lowerMessage.includes('function') && !lowerMessage.includes('loop')) {
    return `To create a list in Python, use square brackets:

\`\`\`python
# Create a list
my_list = [1, 2, 3, 4, 5]
fruits = ['apple', 'banana', 'cherry']

# Add items
my_list.append(6)
fruits.insert(0, 'orange')

# Access items
first_item = my_list[0]
last_item = fruits[-1]
\`\`\`

Lists are mutable, ordered collections that can hold different data types!`
  }
  
  // String operations
  if (lowerMessage.includes('string') && !lowerMessage.includes('list')) {
    return `Working with strings in Python:

\`\`\`python
# Create strings
name = "Python"
message = 'Hello World'
multiline = """This is
a multiline
string"""

# String methods
text = "hello world"
print(text.upper())           # HELLO WORLD
print(text.capitalize())      # Hello world
print(text.replace("world", "Python"))  # hello Python

# String formatting
age = 25
name = "Alice"
# f-strings (recommended)
print(f"{name} is {age} years old")
# format method
print("{} is {} years old".format(name, age))

# String operations
words = "apple,banana,cherry"
fruit_list = words.split(",")  # Split into list
joined = "-".join(fruit_list)  # Join with dash
\`\`\`

Strings are immutable in Python - methods return new strings!`
  }
  
  // Conditionals (if/else)
  if (lowerMessage.includes('if') || lowerMessage.includes('else') || 
      (lowerMessage.includes('condition') && !lowerMessage.includes('while'))) {
    return `Using conditionals in Python:

\`\`\`python
# Basic if statement
age = 18
if age >= 18:
    print("You are an adult")

# if-else
temperature = 25
if temperature > 30:
    print("It's hot!")
else:
    print("It's nice!")

# if-elif-else
score = 75
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

# Multiple conditions
age = 25
has_license = True
if age >= 18 and has_license:
    print("You can drive")

# One-line if (ternary)
status = "adult" if age >= 18 else "minor"
\`\`\`

Use 'and', 'or', 'not' for combining conditions!`
  }
  
  // Functions
  if (lowerMessage.includes('function') || lowerMessage.includes('def') || 
      lowerMessage.includes('parameter') || lowerMessage.includes('return')) {
    return `Here's how to create functions in Python:

\`\`\`python
# Basic function
def greet(name):
    return f"Hello, {name}!"

# Function with default parameter
def calculate_area(length, width=1):
    return length * width

# Function with multiple returns
def get_user_info():
    name = "John"
    age = 25
    return name, age

# Using the functions
message = greet("Alice")
area = calculate_area(5, 3)
name, age = get_user_info()
\`\`\`

Functions help organize your code and make it reusable!`
  }
  
  // Loops
  if ((lowerMessage.includes('loop') || lowerMessage.includes('for') || lowerMessage.includes('while')) &&
      !lowerMessage.includes('function')) {
    return `Python has two main types of loops:

\`\`\`python
# For loop - iterate over items
fruits = ['apple', 'banana', 'cherry']
for fruit in fruits:
    print(f"I like {fruit}")

# For loop with range
for i in range(5):
    print(f"Number: {i}")

# While loop - continue until condition is false
count = 0
while count < 3:
    print(f"Count is {count}")
    count += 1

# Loop with enumerate (get index and value)
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
\`\`\`

Use for loops when you know the sequence, while loops when you have a condition!`
  }
  
  // File operations
  if (lowerMessage.includes('file') || lowerMessage.includes('read') || lowerMessage.includes('write')) {
    return `Here's how to work with files in Python:

\`\`\`python
# Reading a file
with open('myfile.txt', 'r') as file:
    content = file.read()
    print(content)

# Reading line by line
with open('myfile.txt', 'r') as file:
    for line in file:
        print(line.strip())

# Writing to a file
with open('output.txt', 'w') as file:
    file.write("Hello, World!")

# Appending to a file
with open('log.txt', 'a') as file:
    file.write("New log entry\\n")
\`\`\`

Always use 'with' statements - they automatically close files for you!`
  }
  
  // Comparison and operators
  if (lowerMessage.includes('==') || lowerMessage.includes('is') || 
      lowerMessage.includes('comparison') || lowerMessage.includes('operator')) {
    return `Python operators and comparisons:

\`\`\`python
# Comparison operators
x = 5
y = 10
print(x == y)   # Equal to: False
print(x != y)   # Not equal: True
print(x < y)    # Less than: True
print(x > y)    # Greater than: False
print(x <= 5)   # Less or equal: True
print(x >= 5)   # Greater or equal: True

# Difference between == and is
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)   # True (same values)
print(a is b)   # False (different objects)
print(a is c)   # True (same object)

# Logical operators
age = 25
has_id = True
print(age > 18 and has_id)  # and: both must be True
print(age > 30 or has_id)   # or: at least one True
print(not has_id)           # not: reverses boolean

# Membership operators
fruits = ['apple', 'banana']
print('apple' in fruits)      # True
print('orange' not in fruits) # True
\`\`\`

Use '==' for value comparison, 'is' for identity (same object)!`
  }
  
  // Variables and types
  if (lowerMessage.includes('variable') || lowerMessage.includes('type') ||
      lowerMessage.includes('string') || lowerMessage.includes('integer') ||
      lowerMessage.includes('float') || lowerMessage.includes('boolean')) {
    return `Python variables and data types:

\`\`\`python
# Basic types
name = "John"          # string
age = 25               # integer
height = 5.9           # float
is_student = True      # boolean

# Check type
print(type(name))      # <class 'str'>

# Type conversion
age_str = str(age)     # convert to string
price = float("19.99") # convert to float
count = int("42")      # convert to integer

# Multiple assignment
x, y, z = 1, 2, 3
a = b = c = 0
\`\`\`

Python is dynamically typed - variables can change types!`
  }
  
  // Debugging
  if (lowerMessage.includes('debug') || lowerMessage.includes('error') || lowerMessage.includes('fix')) {
    return `Common debugging techniques in Python:

\`\`\`python
# 1. Use print statements
def my_function(x):
    print(f"Input value: {x}")  # Debug print
    result = x * 2
    print(f"Result: {result}")   # Debug print
    return result

# 2. Use try-except for error handling
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Error: {e}")

# 3. Check variable types and values
my_var = [1, 2, 3]
print(f"Type: {type(my_var)}, Value: {my_var}")

# 4. Use assert for testing
def divide(a, b):
    assert b != 0, "Cannot divide by zero"
    return a / b
\`\`\`

Always read error messages carefully - they tell you exactly what's wrong!`
  }
  
  // Dictionaries
  if (lowerMessage.includes('dict') || lowerMessage.includes('key') || lowerMessage.includes('value')) {
    return `Working with dictionaries in Python:

\`\`\`python
# Create a dictionary
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}

# Access values
name = person["name"]
age = person.get("age", 0)  # safer way

# Add/update values
person["email"] = "alice@email.com"
person["age"] = 31

# Loop through dictionary
for key, value in person.items():
    print(f"{key}: {value}")

# Check if key exists
if "email" in person:
    print("Email found!")
\`\`\`

Dictionaries are perfect for storing key-value pairs!`
  }
  
  // Libraries and imports
  if (lowerMessage.includes('import') || lowerMessage.includes('library') || lowerMessage.includes('package')) {
    return `Working with libraries in Python:

\`\`\`python
# Basic imports
import math
import random
from datetime import datetime

# Use imported functions
result = math.sqrt(16)
random_num = random.randint(1, 10)
now = datetime.now()

# Popular libraries for different tasks:
# - requests: for web APIs
# - pandas: for data analysis
# - numpy: for numerical computing
# - matplotlib: for plotting
# - flask/django: for web development

# Example with requests
import requests
response = requests.get("https://api.github.com")
data = response.json()
\`\`\`

Install libraries with: pip install library_name`
  }
  
  // Default response with better guidance
  return `I can help you learn Python! Here are some topics I can explain:

📝 **Basics:**
- Variables and data types
- Strings and string operations
- Lists, dictionaries, and data structures

🔄 **Control Flow:**
- If/else statements and conditions
- For loops and while loops
- Functions and parameters

🐛 **Common Tasks:**
- Reading and writing files
- Error handling and debugging
- Working with libraries

💡 **Ask me things like:**
- "how do i create a list?"
- "whats the difference between == and is?"
- "show me how to use a for loop"
- "how do i read a file?"
- "what are functions in python?"

What would you like to learn about?`
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Received message:', message)

    // Generate response using our knowledge base
    const aiResponse = generatePythonResponse(message)

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in python-ai-huggingface function:', error)
    
    return new Response(
      JSON.stringify({ 
        response: "I'm here to help with Python! Try asking me about lists, functions, loops, or any other Python concepts you'd like to learn about."
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})