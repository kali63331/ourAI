import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { audio, conversationHistory, language = 'english' } = await req.json()
    
    if (!audio) {
      throw new Error('No audio data provided')
    }

    console.log('Processing audio for language:', language)

    // Step 1: Transcribe audio using OpenAI Whisper
    const binaryAudio = processBase64Chunks(audio)
    
    const formData = new FormData()
    const blob = new Blob([binaryAudio], { type: 'audio/webm' })
    formData.append('file', blob, 'audio.webm')
    formData.append('model', 'whisper-1')
    formData.append('language', language === 'hindi' ? 'hi' : language === 'punjabi' ? 'pa' : 'en')

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    })

    if (!transcriptionResponse.ok) {
      throw new Error(`Transcription error: ${await transcriptionResponse.text()}`)
    }

    const transcription = await transcriptionResponse.json()
    const userText = transcription.text

    console.log('User said:', userText)

    // Step 2: Get AI response using Lovable AI (Gemini)
    const systemPrompt = language === 'hindi' 
      ? 'आप एक मददगार AI असिस्टेंट हैं जो Python सिखाने में माहिर हैं। हिंदी में जवाब दें।'
      : language === 'punjabi'
      ? 'ਤੁਸੀਂ ਇੱਕ ਮਦਦਗਾਰ AI ਸਹਾਇਕ ਹੋ ਜੋ Python ਸਿਖਾਉਣ ਵਿੱਚ ਮਾਹਰ ਹੈ। ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ।'
      : 'You are a helpful AI assistant who specializes in teaching Python programming. Respond in English with clear explanations.';

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: userText }
    ]

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
      }),
    })

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text()
      console.error('AI API error:', errorText)
      throw new Error(`AI API error: ${errorText}`)
    }

    const aiData = await aiResponse.json()
    const assistantText = aiData.choices[0].message.content

    console.log('AI response:', assistantText)

    // Step 3: Convert response to speech using OpenAI TTS (Siri-like voice)
    const ttsResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd',
        input: assistantText,
        voice: 'nova',
        response_format: 'mp3',
        speed: 1.0,
      }),
    })

    if (!ttsResponse.ok) {
      throw new Error(`TTS error: ${await ttsResponse.text()}`)
    }

    // Convert audio to base64
    const audioArrayBuffer = await ttsResponse.arrayBuffer()
    const audioBase64 = btoa(
      String.fromCharCode(...new Uint8Array(audioArrayBuffer))
    )

    return new Response(
      JSON.stringify({ 
        userText,
        assistantText,
        audioBase64 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in multilingual-voice-chat function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})