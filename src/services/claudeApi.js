import Anthropic from '@anthropic-ai/sdk';

const getAnthropicClient = (apiKey) => {
  return new Anthropic({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });
};

// Convert image file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Get media type from file
const getMediaType = (file) => {
  const type = file.type;
  if (type === 'image/jpeg' || type === 'image/jpg') return 'image/jpeg';
  if (type === 'image/png') return 'image/png';
  if (type === 'image/gif') return 'image/gif';
  if (type === 'image/webp') return 'image/webp';
  return 'image/jpeg'; // default
};

export const analyzeImages = async (images, apiKey) => {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  if (!images || images.length === 0) {
    throw new Error('No images provided');
  }

  const client = getAnthropicClient(apiKey);

  // Convert all images to base64
  const imageContents = await Promise.all(
    images.map(async (img) => {
      const base64 = await fileToBase64(img.file);
      return {
        type: 'image',
        source: {
          type: 'base64',
          media_type: getMediaType(img.file),
          data: base64
        }
      };
    })
  );

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
            text: prompt
          }
        ]
      }
    ]
  });

  const responseText = message.content[0].text;

  // Try to extract JSON from the response
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // If parsing fails, return structured data from text
    console.warn('Failed to parse JSON response, using fallback');
  }

  // Fallback: create structured response from text
  return {
    mood: 'upbeat and energetic',
    setting: 'diverse locations',
    activities: 'various memorable moments',
    colors: 'vibrant and dynamic',
    emotionalArc: responseText,
    themes: ['adventure', 'friendship', 'memories']
  };
};

export const generateSong = async (imageAnalysis, genre, apiKey) => {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  const client = getAnthropicClient(apiKey);

  const genreStyles = {
    pop: { tempo: 'uptempo 120-130 BPM', style: 'catchy melodic pop' },
    rock: { tempo: 'driving 140-150 BPM', style: 'anthemic rock' },
    hiphop: { tempo: 'laid-back 85-95 BPM', style: 'smooth hip hop beat' },
    country: { tempo: 'mid-tempo 100-110 BPM', style: 'storytelling country' },
    edm: { tempo: 'energetic 128 BPM', style: 'progressive house EDM' },
    indie: { tempo: 'moderate 110-120 BPM', style: 'alternative indie' },
    rnb: { tempo: 'groovy 90-100 BPM', style: 'soulful R&B' },
    folk: { tempo: 'gentle 95-105 BPM', style: 'acoustic folk' }
  };

  const genreInfo = genreStyles[genre] || genreStyles.pop;

  const prompt = `Based on this image analysis from a trip/party experience, create a complete song with the following structure:

Image Analysis:
${JSON.stringify(imageAnalysis, null, 2)}

Genre: ${genre.toUpperCase()}

Please create:
1. A catchy, memorable song title
2. Verse 1 (4-6 lines)
3. A powerful, repeatable chorus (3-4 lines)
4. Verse 2 (4-6 lines, continuing the story)
5. A bridge (2-4 lines, providing contrast or emotional peak)

The song should:
- Capture the mood: ${imageAnalysis.mood}
- Reference the setting: ${imageAnalysis.setting}
- Incorporate themes: ${imageAnalysis.themes?.join(', ')}
- Tell a story with the emotional arc: ${imageAnalysis.emotionalArc}
- Be suitable for ${genre} genre
- Have natural, singable lyrics
- Use concrete imagery from the experience

Also create a Suno AI-optimized prompt that includes:
- Genre and style tags
- Mood descriptors
- Tempo (${genreInfo.tempo})
- Instrumentation hints

Return your response as a JSON object with these exact keys:
{
  "title": "song title here",
  "verse1": "verse 1 lyrics here (each line separated by \\n)",
  "chorus": "chorus lyrics here (each line separated by \\n)",
  "verse2": "verse 2 lyrics here (each line separated by \\n)",
  "bridge": "bridge lyrics here (each line separated by \\n)",
  "sunoPrompt": "genre: X, mood: Y, style: Z, tempo: BPM"
}`;

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2500,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  const responseText = message.content[0].text;

  // Try to extract JSON from the response
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const songData = JSON.parse(jsonMatch[0]);

      // Add genre, mood, and tempo info
      return {
        ...songData,
        genre: genre.charAt(0).toUpperCase() + genre.slice(1),
        mood: imageAnalysis.mood,
        tempo: genreInfo.tempo
      };
    }
  } catch (e) {
    console.error('Failed to parse JSON response:', e);
    throw new Error('Failed to generate song. Please try again.');
  }

  throw new Error('Failed to generate song. Please try again.');
};
