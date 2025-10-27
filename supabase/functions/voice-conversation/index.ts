import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { audio, conversationHistory } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    console.log('Processing voice conversation...');

    // Step 1: Transcribe audio to text using Whisper
    const binaryAudio = processBase64Chunks(audio);
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      throw new Error(`Transcription error: ${await transcriptionResponse.text()}`);
    }

    const transcription = await transcriptionResponse.json();
    const userText = transcription.text;
    console.log('User said:', userText);

    // Step 2: Generate conversational AI response
    const messages = [
      {
        role: 'system',
        content: `You are a friendly and knowledgeable Python programming tutor having a natural spoken conversation. 
        
Key conversation guidelines:
- Speak naturally and conversationally, as if talking to a friend
- Keep responses concise (2-3 sentences) since this is spoken dialogue
- Use simple, clear language - avoid jargon unless necessary
- Ask follow-up questions to keep the conversation flowing
- Show enthusiasm and encouragement
- If explaining code, describe it verbally rather than showing syntax unless specifically asked
- Use conversational phrases like "So basically...", "Here's the thing...", "Let me explain..."
- Remember context from the conversation
- Be supportive and patient with learners

Example good responses:
- "Great question! So basically, a list in Python is like a container that can hold multiple items. Think of it like a shopping list. Want me to show you how to create one?"
- "I see what you're trying to do there. The issue is that you're comparing with a single equals sign instead of double. Let's fix that together!"
- "Nice! You're getting the hang of it. Now, have you thought about what happens if the user enters something unexpected?"`
      },
      ...(conversationHistory || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: userText
      }
    ];

    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.8,
        max_tokens: 150, // Keep responses concise for voice
      }),
    });

    if (!chatResponse.ok) {
      throw new Error(`Chat error: ${await chatResponse.text()}`);
    }

    const chatResult = await chatResponse.json();
    const aiText = chatResult.choices[0].message.content;
    console.log('AI response:', aiText);

    // Step 3: Convert AI response to speech
    const ttsResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd',
        input: aiText,
        voice: 'nova',
        response_format: 'mp3',
        speed: 1.0,
      }),
    });

    if (!ttsResponse.ok) {
      throw new Error(`TTS error: ${await ttsResponse.text()}`);
    }

    // Convert audio to base64
    const audioBuffer = await ttsResponse.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioBuffer))
    );

    console.log('Voice conversation completed successfully');

    return new Response(
      JSON.stringify({
        userText,
        aiText,
        audioBase64: base64Audio,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Voice conversation error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
