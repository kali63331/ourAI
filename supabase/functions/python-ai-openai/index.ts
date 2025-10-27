import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, mode = 'openai' } = await req.json()

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`[${mode}] Message: ${message.substring(0, 50)}...`)

    // Check if Python-related
    const lowerMessage = message.toLowerCase();
    const pythonKeywords = [
      'python', 'variable', 'function', 'loop', 'list', 'class', 'import', 
      'def', 'for', 'while', 'print', 'code', 'program', 'syntax', 'error',
      'pandas', 'numpy', 'django', 'flask', 'data', 'algorithm'
    ];
    
    const isPythonRelated = pythonKeywords.some(keyword => lowerMessage.includes(keyword)) || 
                           lowerMessage.includes('how to') || 
                           lowerMessage.includes('what is') ||
                           lowerMessage.includes('explain');
    
    if (!isPythonRelated) {
      return new Response(
        JSON.stringify({ 
          response: "I'm a Python programming assistant. Ask me about Python concepts, code examples, libraries, or development practices!" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // System prompt based on mode
    const systemPrompts: Record<string, string> = {
      expertise: `You are an expert Python teacher. Provide detailed educational responses with:
- Clear explanations of concepts and reasoning
- Working code examples in \`\`\`python blocks
- Best practices and Python conventions
- Step-by-step guidance
Keep answers concise but comprehensive.`,
      
      enhanced: `You are a Python AI assistant. Provide practical responses with:
- Current best practices and modern features
- Real-world examples and use cases
- Performance tips
- Code examples in \`\`\`python blocks
Keep answers focused and actionable.`,
      
      solutions: `You are a Python problem solver. For each question:
- Provide 2-3 solution approaches
- Explain trade-offs
- Include working code in \`\`\`python blocks
- Add error handling where needed
Keep solutions practical and runnable.`,
      
      default: `You are a helpful Python assistant. Provide clear answers with working code examples in \`\`\`python blocks. Keep responses concise and focused on Python programming.`
    };

    const systemPrompt = systemPrompts[mode] || systemPrompts.default;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI error [${response.status}]:`, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment.');
      }
      if (response.status === 401) {
        throw new Error('Authentication failed. Check API key.');
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response generated');
    }

    console.log(`Response: ${aiResponse.length} chars`);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Error]', error.message);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process request' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});