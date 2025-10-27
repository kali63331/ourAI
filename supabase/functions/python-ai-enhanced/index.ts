import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, mode = 'openai' } = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!message) {
      throw new Error('Message is required');
    }

    console.log(`[${mode}] Processing: ${message.substring(0, 50)}...`);

    // Validate Python relevance
    const isPythonRelated = (msg: string): boolean => {
      const keywords = ['python', 'code', 'program', 'function', 'loop', 'list', 'variable', 
        'class', 'import', 'def', 'for', 'while', 'if', 'data', 'algorithm'];
      return keywords.some(k => msg.toLowerCase().includes(k)) || 
             msg.includes('how') || msg.includes('what') || msg.includes('explain');
    };

    if (!isPythonRelated(message)) {
      return new Response(
        JSON.stringify({ 
          response: "I'm a Python programming assistant. Please ask me questions about Python programming, coding concepts, libraries, or development practices." 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Define system prompts based on mode
    const systemPrompts: Record<string, { prompt: string; model: string }> = {
      expertise: {
        prompt: `You are a world-class Python expert and teacher. Provide comprehensive, educational responses with:
- Detailed explanations of 'why', not just 'how'
- Working code examples in \`\`\`python blocks
- Best practices and Python conventions
- Step-by-step breakdowns
Focus exclusively on Python programming topics.`,
        model: 'gpt-4o-mini'
      },
      enhanced: {
        prompt: `You are a Python AI assistant with current knowledge. Provide:
- Latest Python best practices and features
- Popular libraries and frameworks
- Real-world examples and use cases
- Performance and security considerations
- Working code in \`\`\`python blocks
Stay focused on Python development.`,
        model: 'gpt-4o'
      },
      solutions: {
        prompt: `You are a Python problem-solving specialist. For each question:
- Provide 2-3 different solution approaches
- Compare pros/cons of each approach
- Include error handling and optimizations
- Show complete, runnable code examples in \`\`\`python blocks
- Mention related concepts
Focus on practical Python solutions.`,
        model: 'gpt-4o'
      },
      default: {
        prompt: `You are a helpful Python programming assistant. Provide clear, accurate answers with working code examples in \`\`\`python blocks. Focus on practical, runnable Python solutions.`,
        model: 'gpt-4o-mini'
      }
    };

    const config = systemPrompts[mode] || systemPrompts.default;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: config.prompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error [${response.status}]:`, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (response.status === 401) {
        throw new Error('API authentication failed. Please check configuration.');
      }
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response generated');
    }

    console.log(`Response generated successfully (${aiResponse.length} chars)`);

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        model: config.model,
        mode: mode
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Error]', error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate response'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});