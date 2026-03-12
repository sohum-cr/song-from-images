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

3. Install frontend dependencies:
   ```bash
   npm install
   ```

4. Install backend dependencies:
   ```bash
   cd server
   npm install
   cd ..
   ```

## Running the Application

**Important**: This application requires both a backend server and a frontend development server to run.

### Option 1: Run Both Servers (Recommended)

1. **Start the backend server** (in one terminal):
   ```bash
   cd server
   npm start
   ```
   The backend will run on `http://localhost:3001`

2. **Start the frontend** (in a second terminal):
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. Open your browser and navigate to `http://localhost:5173`

4. Enter your Anthropic API key in the input field at the top

5. Upload your images, select a genre, and generate your song!

### Option 2: Use Environment Variable for API Key (Optional)

Instead of entering the API key in the UI, you can set it as an environment variable on the backend:

1. Create a `.env` file in the `server` directory:
   ```bash
   cd server
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

3. Start the backend server (it will use the env variable):
   ```bash
   npm start
   ```

4. You can now leave the API key field empty in the UI

## How to Use

1. **Enter API Key**: Paste your Anthropic API key in the input field
2. **Upload Images**: Drag and drop or click to browse and upload multiple images from your trip or party
3. **Select Genre**: Choose the music genre that best fits your vibe
4. **Generate Song**: Click "Generate My Song" button
5. **View Results**: Your custom song lyrics and Suno AI prompt will be generated
6. **Copy to Suno**: Copy the Suno prompt and use it at [suno.ai](https://suno.ai) to create your actual song

## Technical Stack

### Frontend
- **React 18**: Frontend framework with hooks
- **Vite**: Build tool and dev server
- **CSS3**: Custom styling with responsive design

### Backend
- **Node.js + Express**: Backend API server
- **Anthropic SDK**: Claude API integration for image analysis and text generation
- **CORS**: Cross-origin resource sharing support
- **dotenv**: Environment variable management

## Project Structure

```
song-from-images/
├── src/                              # Frontend source code
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
│   │   └── claudeApi.js             # Backend API client
│   ├── App.jsx                      # Main application component
│   ├── App.css                      # Main application styles
│   ├── index.css                    # Global styles
│   └── main.jsx                     # Application entry point
├── server/                           # Backend server
│   ├── index.js                     # Express server with API routes
│   ├── package.json                 # Backend dependencies
│   └── .env.example                 # Environment variable template
├── package.json                      # Frontend dependencies
└── README.md
```

## API Usage & Architecture

This application uses a **client-server architecture**:

### Backend Server (Port 3001)
- Handles all Anthropic API calls securely
- Provides REST API endpoints:
  - `POST /api/analyze-images` - Analyzes images using Claude Vision
  - `POST /api/generate-song` - Generates song lyrics with Claude
  - `GET /api/health` - Health check endpoint
- Uses **claude-3-5-sonnet-20241022** model for both image analysis and song generation
- Supports API key via environment variable or request body

### Frontend (Port 5173)
- React SPA that communicates with the backend
- Handles image upload, UI rendering, and user interactions
- Sends base64-encoded images to the backend
- No direct Anthropic API calls (more secure)

## Security Note

✅ **Backend Architecture**: This application uses a backend server to handle Anthropic API calls, which is more secure than client-side calls.

### API Key Handling

**Option 1 - UI Input (Default)**:
- API key is sent with each request to the backend
- Key is stored in frontend memory only (not in localStorage)
- Key is lost when you refresh the page
- Key is sent to your own backend server (localhost:3001)

**Option 2 - Environment Variable (More Secure)**:
- Set `ANTHROPIC_API_KEY` in `server/.env`
- Backend uses this key for all requests
- No need to enter key in the UI
- Key never leaves the server
- Recommended for production deployments

### Production Deployment Considerations
- Use environment variables for the API key
- Add authentication to protect your backend endpoints
- Implement rate limiting to prevent abuse
- Use HTTPS for all communications
- Consider adding user authentication

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
