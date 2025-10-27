import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { content, type, mimeType } = await req.json();
    
    if (!content) {
      throw new Error('No content provided');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const isImage = type === 'image' || mimeType?.startsWith('image/');
    const isVideo = type === 'video' || mimeType?.startsWith('video/');

    let prompt = '';
    let messages = [];

    if (isImage) {
      prompt = `Analyze this image and provide Python code solutions, explanations, or recreate any code/design shown. Focus on:
1. If it shows code, explain what it does and suggest improvements
2. If it shows an error, provide the fix
3. If it shows a design/UI, provide Python code to recreate it
4. If it shows data/charts, provide Python code to analyze or recreate it
5. General Python programming advice related to the image

Be specific and provide working Python code examples.`;

      messages = [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${content}`
              }
            }
          ]
        }
      ];
    } else if (isVideo) {
      // For videos, we'll extract first frame and analyze
      prompt = `This is content from a video file. Analyze what you can see and provide Python-related help:
1. If it shows code being written, explain the concepts
2. If it shows programming tutorials, summarize key points
3. If it shows errors or debugging, provide solutions
4. If it shows data visualization, provide Python code examples
5. General Python programming guidance

Provide practical Python code examples and explanations.`;

      messages = [
        {
          role: "user",
          content: prompt + "\n\nNote: This is from a video file. Please provide Python programming assistance based on typical video content."
        }
      ];
    } else {
      throw new Error('Unsupported content type');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in image-analysis function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});