# JstCode - TSX Runner Web Application

**Slogan: "Just Code"**

A web application for running TSX artifacts from Claude, featuring a live code editor and component preview with PDF export capabilities.

## 🚀 What is this?

JstCode is a web-based TSX runner that allows you to drag and drop TSX files (like Claude artifacts), edit them in a professional code editor, see live previews, and export the rendered components as PDFs for presentations.

## ✨ Features

### 📁 **File Upload**
- **Drag & Drop Interface**: Simply drag TSX, TS, JSX, or JS files into the app
- **Multiple File Support**: Supports TypeScript and JavaScript React components
- **Claude Artifact Ready**: Designed specifically for Claude-generated TSX artifacts

### 🔧 **Code Editor**
- **Monaco Editor**: VS Code-like editing experience with syntax highlighting
- **TypeScript Support**: Full TSX/TS syntax highlighting and IntelliSense
- **Dark Theme**: Professional dark theme for comfortable coding
- **Real-time Editing**: See changes instantly as you type

### 👀 **Live Preview**
- **Sandpack Integration**: Real-time React component rendering
- **Error Handling**: Graceful error boundaries with detailed error messages
- **Responsive Preview**: See your components render in real-time
- **Hot Reload**: Instant updates as you edit code

### 📄 **PDF Export**
- **High-Quality Export**: Convert rendered components to PDF
- **Presentation Ready**: Perfect for sharing visual components
- **One-Click Export**: Simple export button in the header
- **Custom Filename**: Automatically names PDF based on your TSX file

### 🎨 **User Interface**
- **Split-Pane Layout**: Resizable editor and preview panes
- **Responsive Design**: Works on all screen sizes
- **Clean Interface**: Minimal, focused design for productivity
- **Professional Styling**: Dark theme with modern aesthetics

## 🚀 How to Use

### **Getting Started**
1. **Start the App**: Run the development server
2. **Upload a File**: Drag and drop your TSX file into the upload area
3. **Edit Code**: Use the Monaco editor to modify your component
4. **See Live Changes**: Watch your component update in real-time
5. **Export PDF**: Click "Export PDF" to save your rendered component

### **Step-by-Step Workflow**
1. **Launch JstCode**: Open the application in your browser
2. **Upload TSX File**: 
   - Drag a TSX file from your computer into the upload zone
   - Or click to browse and select a file
3. **Edit Your Code**:
   - The file opens in the Monaco editor with syntax highlighting
   - Make changes and see them reflected instantly in the preview
4. **Preview Component**:
   - The right pane shows your component rendered live
   - Any errors are displayed with helpful error messages
5. **Export to PDF**:
   - Click the "Export PDF" button in the header
   - Your rendered component is saved as a PDF file

## 🛠️ Technologies Used

- **Next.js 15** with App Router for modern React development
- **TypeScript** for type-safe development
- **Monaco Editor** for professional code editing experience
- **Sandpack** by CodeSandbox for live React component preview
- **React Resizable Panels** for adjustable split-pane layout
- **React Dropzone** for drag-and-drop file uploads
- **html2canvas** + **jsPDF** for high-quality PDF export
- **Tailwind CSS** for responsive, utility-first styling

## 🚧 Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Available Scripts

The project includes the following npm scripts:

```bash
# Development
npm run dev          # Start development server (available at http://localhost:5173)

# Building
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint to check code quality
```

### Local Development

```bash
# Clone the repository
git clone [your-repo-url]
cd jstcode

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles
├── components/
│   ├── CodeEditor.tsx      # Monaco editor component
│   ├── FileUploader.tsx    # Drag & drop file upload
│   ├── LivePreview.tsx     # Sandpack preview component
│   ├── PDFExporter.tsx     # PDF export functionality
│   └── ErrorBoundary.tsx   # Error handling component
├── sample-component.tsx    # Example TSX file for testing
└── ...
```

## 🎯 Perfect For

- **Developers**: Testing and previewing TSX components quickly
- **Claude Users**: Running and modifying Claude-generated artifacts
- **Presentations**: Converting React components to PDFs for sharing
- **Education**: Teaching React component development
- **Prototyping**: Quick component iteration and testing

## 🌟 Key Features

- **Zero Setup**: No complex configuration required
- **Instant Preview**: See changes in real-time
- **Professional Tools**: Monaco editor with full TypeScript support
- **Export Ready**: One-click PDF export for presentations
- **Error Friendly**: Clear error messages and recovery
- **Responsive**: Works on desktop and mobile devices

## 🚀 Deployment

### Deployment Options

This app can be easily deployed to any static hosting platform:

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect it's a Next.js project
3. Deploy with default settings

#### Netlify
1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `.next`

#### Other Platforms
- Any Node.js hosting service can run the built application
- Use `npm run build` followed by `npm start` for production

### Environment Variables

No environment variables are required. The app works entirely client-side with user-provided TSX files.

## 📄 Sample Usage

A sample TSX component (`sample-component.tsx`) is included in the root directory. This demonstrates:
- React hooks (useState)
- Interactive components
- Styled components
- Event handling
- Real-time updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) section
2. Create a new issue with detailed description
3. Include screenshots and error messages if applicable

---

**Created with ❤️ for developers who just want to code**

*Transform your TSX artifacts into interactive previews and presentation-ready PDFs.*