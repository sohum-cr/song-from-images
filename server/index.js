import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize Anthropic client
const getAnthropicClient = (apiKey) => {
  return new Anthropic({
    apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
  });
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Analyze images endpoint
app.post('/api/analyze-images', async (req, res) => {
  try {
    const { images, apiKey } = req.body;

    if (!apiKey && !process.env.ANTHROPIC_API_KEY) {
      return res.status(401).json({ error: 'API key is required' });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const client = getAnthropicClient(apiKey);

    // Build image contents for Claude
    const imageContents = images.map((img) => ({
      type: 'image',
      source: {
        type: 'base64',
        media_type: img.mediaType,
        data: img.data,
      },
    }));

    const prompt = `Analyze these images from a trip or party experience. Please provide:

1. Overall mood and atmosphere (e.g., energetic, nostalgic, romantic, adventurous, celebratory)
2. Setting and location vibes (e.g., beach, city nightlife, mountain retreat, house party)
3. Key activities and moments captured
4. Dominant colors and visual themes
5. Emotional arc or narrative thread across all images
6. Key themes that could inspire song lyrics

Please be detailed and creative in your analysis, capturing the essence and feeling of this experience. Format your response as a JSON object with keys: mood, setting, activities, colors, emotionalArc, themes.`;

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContents,
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].text;

    // Try to extract JSON from the response
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return res.json(analysis);
      }
    } catch (e) {
      console.warn('Failed to parse JSON response, using fallback');
    }

    // Fallback: create structured response from text
    const fallbackAnalysis = {
      mood: 'upbeat and energetic',
      setting: 'diverse locations',
      activities: 'various memorable moments',
      colors: 'vibrant and dynamic',
      emotionalArc: responseText,
      themes: ['adventure', 'friendship', 'memories'],
    };

    res.json(fallbackAnalysis);
  } catch (error) {
    console.error('Error analyzing images:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze images',
    });
  }
});

// Generate song endpoint
app.post('/api/generate-song', async (req, res) => {
  try {
    const { imageAnalysis, genre, apiKey } = req.body;

    if (!apiKey && !process.env.ANTHROPIC_API_KEY) {
      return res.status(401).json({ error: 'API key is required' });
    }

    if (!imageAnalysis || !genre) {
      return res.status(400).json({ error: 'Image analysis and genre are required' });
    }

    const client = getAnthropicClient(apiKey);

    const genreStyles = {
      pop: {
        tempo: 'uptempo 120-130 BPM',
        style: 'catchy melodic pop',
        instructions: 'Write catchy, memorable hooks. Use simple, relatable language. Focus on strong melodic phrases and repetition in the chorus.',
        sunoTags: 'pop, upbeat, melodic, radio-ready',
      },
      rock: {
        tempo: 'driving 140-150 BPM',
        style: 'anthemic rock',
        instructions: 'Write powerful, bold lyrics with strong imagery. Build intensity. Use driving rhythms and emphatic phrases perfect for shouting along.',
        sunoTags: 'rock, electric guitar, energetic, powerful',
      },
      hiphop: {
        tempo: 'laid-back 85-95 BPM',
        style: 'smooth hip hop beat',
        instructions: 'Write rhythmic, flow-focused verses with clever wordplay. Include internal rhymes and vivid storytelling details.',
        sunoTags: 'hip hop, rap, rhythmic, urban',
      },
      country: {
        tempo: 'mid-tempo 100-110 BPM',
        style: 'storytelling country',
        instructions: 'Tell a clear story with vivid, relatable details. Use conversational language. Paint pictures of places and moments.',
        sunoTags: 'country, acoustic, storytelling, heartfelt',
      },
      edm: {
        tempo: 'energetic 128 BPM',
        style: 'progressive house EDM',
        instructions: 'Write high-energy lyrics with strong build-ups. Keep choruses simple and anthemic for festival crowds. Focus on euphoric feelings.',
        sunoTags: 'edm, electronic, dance, energetic, festival',
      },
      indie: {
        tempo: 'moderate 110-120 BPM',
        style: 'alternative indie',
        instructions: 'Write introspective, authentic lyrics with unique metaphors. Be creative with structure. Capture genuine emotions.',
        sunoTags: 'indie, alternative, authentic, melodic',
      },
      rnb: {
        tempo: 'groovy 90-100 BPM',
        style: 'soulful R&B',
        instructions: 'Write smooth, soulful lyrics with emotional depth. Use sensual imagery and flowing phrases. Emphasize feelings and atmosphere.',
        sunoTags: 'rnb, soul, smooth, groovy, emotional',
      },
      folk: {
        tempo: 'gentle 95-105 BPM',
        style: 'acoustic folk',
        instructions: 'Write poetic, thoughtful lyrics with natural imagery. Focus on storytelling and reflection. Use simple, timeless language.',
        sunoTags: 'folk, acoustic, storytelling, gentle, organic',
      },
    };

    const genreInfo = genreStyles[genre] || genreStyles.pop;

    const prompt = `You are an expert songwriter creating lyrics for Suno AI music generation. Create a complete, professional song based on this image analysis from a trip/party experience.

IMAGE ANALYSIS:
${JSON.stringify(imageAnalysis, null, 2)}

GENRE: ${genre.toUpperCase()}
STYLE: ${genreInfo.style}
TEMPO: ${genreInfo.tempo}

GENRE-SPECIFIC GUIDANCE:
${genreInfo.instructions}

SONG STRUCTURE REQUIREMENTS:

1. TITLE: Create a memorable, evocative title (3-6 words) that captures the essence of the experience

2. VERSE 1 (4-6 lines):
   - Set the scene with vivid, specific details
   - Establish the mood and setting from the images
   - Use concrete imagery that paints a picture
   - Natural rhythm and flow for singing
   - Consider rhyme scheme (AABB, ABAB, or ABCB)

3. CHORUS (3-4 lines):
   - The emotional core and main message
   - Highly memorable and repeatable
   - Strong hook that's easy to sing along to
   - Captures the overall feeling/theme
   - Should work when repeated multiple times

4. VERSE 2 (4-6 lines):
   - Continue the narrative or deepen the emotion
   - Add new details or perspectives
   - Build on verse 1, don't just repeat it
   - Maintain consistent rhyme scheme with verse 1
   - Move the story forward

5. BRIDGE (3-4 lines):
   - Provide contrast or a shift in perspective
   - Emotional peak or moment of reflection
   - Different melody/rhythm feel from verses
   - Lead naturally back to the final chorus
   - Can break the rhyme pattern for impact

LYRIC WRITING RULES:
✓ Use conversational, singable language (avoid overly complex words)
✓ Include specific details from the analysis (colors, activities, settings)
✓ Capture the mood: ${imageAnalysis.mood}
✓ Reference the setting: ${imageAnalysis.setting}
✓ Incorporate themes: ${imageAnalysis.themes?.join(', ') || 'memories, emotions, experiences'}
✓ Create clear, consistent rhyme schemes
✓ Use strong verbs and vivid imagery
✓ Make each line scan naturally when spoken aloud
✓ Avoid clichés - be creative and authentic
✓ Match the energy level of ${genre} music

SUNO AI PROMPT:
Create an optimized Suno AI prompt with:
- Primary genre tag
- Sub-genres or style descriptors
- Mood/emotion tags
- Tempo indication (${genreInfo.tempo})
- Instrumentation/production style hints
- Any vocal style notes

Format: "${genreInfo.sunoTags}, ${imageAnalysis.mood}, ${genreInfo.tempo}"

Return ONLY a valid JSON object (no markdown, no code blocks) with these exact keys:
{
  "title": "song title here",
  "verse1": "line 1\\nline 2\\nline 3\\nline 4",
  "chorus": "line 1\\nline 2\\nline 3",
  "verse2": "line 1\\nline 2\\nline 3\\nline 4",
  "bridge": "line 1\\nline 2\\nline 3",
  "sunoPrompt": "complete Suno AI prompt string"
}`;

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].text;

    // Try to extract JSON from the response
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const songData = JSON.parse(jsonMatch[0]);

        // Add genre, mood, and tempo info
        const completeSongData = {
          ...songData,
          genre: genre.charAt(0).toUpperCase() + genre.slice(1),
          mood: imageAnalysis.mood,
          tempo: genreInfo.tempo,
        };

        return res.json(completeSongData);
      }
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      throw new Error('Failed to generate song. Please try again.');
    }

    throw new Error('Failed to generate song. Please try again.');
  } catch (error) {
    console.error('Error generating song:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate song',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   - GET  http://localhost:${PORT}/api/health`);
  console.log(`   - POST http://localhost:${PORT}/api/analyze-images`);
  console.log(`   - POST http://localhost:${PORT}/api/generate-song`);
});
