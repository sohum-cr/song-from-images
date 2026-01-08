# Song From Images

A web application that analyzes your trip/party images using Claude AI's vision capabilities and generates custom song lyrics tailored to your chosen genre, complete with Suno AI-ready prompts.

## Features

- **Multi-Image Upload**: Drag-and-drop interface supporting multiple images
- **AI Image Analysis**: Uses Claude's vision API to analyze mood, setting, activities, colors, and themes
- **Genre Selection**: Choose from 8 music genres (Pop, Rock, Hip Hop, Country, EDM, Indie, R&B, Folk)
- **Smart Song Generation**: Creates complete song structure (title, 2 verses, chorus, bridge)
- **Suno AI Integration**: Generates optimized prompts for Suno.ai with genre, mood, and tempo tags
- **Copy to Clipboard**: Easy copying of lyrics and Suno prompts
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Progress Tracking**: Visual indicators showing the generation process

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- An Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com))

## Installation

1. Clone or download this repository

2. Navigate to the project directory:
   ```bash
   cd song-from-images
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

3. Enter your Anthropic API key in the input field at the top

4. Upload your images, select a genre, and generate your song!

## How to Use

1. **Enter API Key**: Paste your Anthropic API key in the input field
2. **Upload Images**: Drag and drop or click to browse and upload multiple images from your trip or party
3. **Select Genre**: Choose the music genre that best fits your vibe
4. **Generate Song**: Click "Generate My Song" button
5. **View Results**: Your custom song lyrics and Suno AI prompt will be generated
6. **Copy to Suno**: Copy the Suno prompt and use it at [suno.ai](https://suno.ai) to create your actual song

## Technical Stack

- **React 18**: Frontend framework with hooks
- **Vite**: Build tool and dev server
- **Anthropic SDK**: Claude API integration for image analysis and text generation
- **CSS3**: Custom styling with responsive design

## Project Structure

```
song-from-images/
├── src/
│   ├── components/
│   │   ├── ImageUpload.jsx          # Image upload with drag-and-drop
│   │   ├── ImageUpload.css
│   │   ├── GenreSelection.jsx       # Genre selection UI
│   │   ├── GenreSelection.css
│   │   ├── ProgressIndicator.jsx    # Progress tracking UI
│   │   ├── ProgressIndicator.css
│   │   ├── SongOutput.jsx           # Song display with copy functionality
│   │   └── SongOutput.css
│   ├── services/
│   │   └── claudeApi.js             # Claude API integration
│   ├── App.jsx                      # Main application component
│   ├── App.css                      # Main application styles
│   ├── index.css                    # Global styles
│   └── main.jsx                     # Application entry point
├── package.json
└── README.md
```

## API Usage

This application uses the Anthropic API with the following models:

- **claude-3-5-sonnet-20241022**: Used for both image analysis (with vision) and song generation
- The API is called client-side with `dangerouslyAllowBrowser: true` (for demo purposes)

**Note**: In a production environment, API calls should be made from a backend server to keep your API key secure.

## Security Note

⚠️ **Important**: This application stores your API key in memory only (no localStorage or persistence). The key is lost when you refresh the page. However, since the API calls are made from the browser, your API key is exposed in network requests.

For production use, consider:
- Implementing a backend server to handle API calls
- Using environment variables and server-side API key management
- Adding authentication and rate limiting

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## Troubleshooting

### API Key Issues
- Make sure your API key is valid and has sufficient credits
- Check that the key is entered correctly without extra spaces

### Image Upload Issues
- Ensure images are in a supported format (JPEG, PNG, GIF, WebP)
- Try with smaller images if uploads are failing

### CORS Errors
- The Anthropic SDK uses `dangerouslyAllowBrowser: true` to allow browser-based API calls
- Some browser extensions might interfere with API requests

## License

This project is provided as-is for educational and demonstration purposes.

## Credits

- **Claude AI**: Image analysis and lyric generation by Anthropic
- **Suno AI**: Target platform for song generation
