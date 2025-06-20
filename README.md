# JstCode - Multi-File React Code Editor

**Slogan: "Just Code"**

A web-based IDE for editing and previewing React/TypeScript projects with live preview, multi-file support, and professional VS Code-inspired interface.

## 🚀 What is this?

JstCode is a comprehensive web-based code editor that allows you to upload, edit, and preview multi-file React/TypeScript projects. Features include a professional file tree, tabbed editing, live preview, console output, and code formatting.

## ✨ Features Status

### 🎯 **PHASE 1: Beginner-Focused Experience - IMPLEMENTED**

#### 1. ✅ **Multi-file Project Support** - FULLY WORKING
- **File Tree Explorer**: VS Code-style expandable sidebar with file icons
- **Tab Management**: Multiple open files with close buttons and active indicators  
- **File State Management**: Persistent project state with localStorage
- **File Operations**: Create, edit, delete, and navigate files
- **File Type Detection**: Smart file icons and language detection

#### 2. ✅ **Live Preview with Console** - CORE WORKING
- **Auto-refresh Preview**: 300ms debounced updates on code changes
- **Sandpack Integration**: Full React/TypeScript preview environment
- **Multi-file Support**: Preview works with entire project structure
- **Console Panel**: Collapsible console with error/warning counts *(temporarily disabled - see known issues)*
- **Error Boundaries**: Graceful error handling and display

#### 3. ✅ **Drag & Drop Import** - BASIC WORKING
- **Single File Upload**: Drag and drop individual code files ✅
- **Multiple File Upload**: Upload multiple files at once ✅
- **File Type Filtering**: Supports .tsx, .ts, .jsx, .js, .json, .css, .html ✅
- **Advanced Features**: *(temporarily simplified - see known issues)*
  - Folder uploads ⚠️ *Disabled*
  - ZIP file extraction ⚠️ *Disabled*
  - Complex project parsing ⚠️ *Disabled*

#### 4. ✅ **Code Formatting** - CORE UI READY
- **Prettier Integration**: ⚠️ *Temporarily disabled - see known issues*
- **Format Button**: UI ready in editor toolbar
- **Language Support**: TypeScript, JavaScript, CSS, HTML, JSON, Markdown
- **Keyboard Shortcuts**: Ctrl/Cmd+S for formatting *(disabled)*

### 🎨 **Design Features - FULLY IMPLEMENTED**
- **VS Code-Inspired UI**: Exact color matching with professional dark theme
- **File Tree**: Expandable folders, file type icons, hover states
- **Tab System**: Clean tabs with close buttons and active states  
- **Resizable Panels**: Split editor/preview with draggable resize handles
- **Editor Toolbar**: File info, formatting controls, and status indicators
- **Responsive Layout**: Works on all screen sizes

## 🚧 Known Issues & Current Limitations

### ⚠️ **Temporarily Disabled Features**

Due to browser compatibility and SSR issues encountered during development, the following features are temporarily disabled:

#### 1. **Code Formatting (Prettier)**
**Issue**: Import errors with Prettier browser modules
```
Error: Object literal may only specify known properties, and 'showOpenInCodeSandbox' does not exist
Import errors with prettier/standalone browser modules
```
**Status**: UI implemented, functionality disabled
**Files affected**: 
- `src/utils/formatter.ts` - Dynamic imports attempted but failed
- `src/components/EditorToolbar.tsx` - Format button present but disabled
- `src/hooks/useFormatter.ts` - Hook implemented but unused

#### 2. **Console Message Capture**
**Issue**: Complex message handling between iframe and parent window
```
Sandpack console integration causing stability issues
```
**Status**: Console panel UI implemented, message capture disabled
**Files affected**:
- `src/hooks/useConsoleCapture.ts` - Message handling logic present
- `src/components/ConsolePanel.tsx` - UI fully functional
- `src/components/LivePreview.tsx` - Integration disabled

#### 3. **Advanced Project Parsing**
**Issue**: Complex file system APIs and ZIP handling
```
JSZip browser integration and FileSystemAPI compatibility issues
```
**Status**: Basic file upload working, advanced features disabled
**Files affected**:
- `src/utils/projectParser.ts` - Full implementation present but unused
- `src/components/ProjectUploader.tsx` - Simplified to basic file handling

### 🔧 **Error Details for Developers**

#### Build Errors Encountered:
```bash
# TypeScript Errors
./src/components/CodeEditor.tsx:41:22
Type error: Type 'FileNode | null | undefined' is not assignable to type 'FileNode | null'

./src/components/FileTree.tsx:95:27  
Type error: Cannot find name 'activeFileId'

# Sandpack Configuration Errors
./src/components/LivePreview.tsx:99:15
Type error: 'showOpenInCodeSandbox' does not exist in type 'SandpackInternalOptions'

# ESLint Warnings
@typescript-eslint/no-explicit-any - Multiple any types used
react-hooks/rules-of-hooks - Conditional hook usage in FileUploader
@next/next/no-img-element - Using <img> instead of Next.js Image component
```

#### Runtime Errors Fixed:
```bash
# Port conflicts resolved
Error: listen EADDRINUSE: address already in use 0.0.0.0:5173

# Import resolution issues
Failed to compile: Prettier modules not found in browser environment
```

## 🛠️ Technologies Used

### **Core Stack**
- **Next.js 15** with App Router and Turbopack
- **TypeScript** for type-safe development
- **Monaco Editor** for VS Code-like editing experience
- **Sandpack** by CodeSandbox for live React component preview
- **React Resizable Panels** for adjustable split-pane layout
- **React Dropzone** for drag-and-drop file uploads
- **Tailwind CSS** for responsive, utility-first styling

### **Advanced Features (Partially Implemented)**
- **Prettier** for code formatting *(disabled)*
- **JSZip** for ZIP file extraction *(disabled)*
- **html2canvas + jsPDF** for PDF export *(working)*

### **State Management**
- **Custom Hooks**: `useFileTree`, `useFormatter`, `useConsoleCapture`
- **LocalStorage**: Persistent project state
- **React Context**: File system state management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation & Development

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

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint (expect warnings on disabled features)
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with global styles
│   ├── page.tsx                # Main application with multi-file logic
│   └── globals.css             # Global Tailwind styles
├── components/
│   ├── CodeEditor.tsx          # Monaco editor with toolbar
│   ├── EditorToolbar.tsx       # Format button and file info
│   ├── FileTree.tsx            # VS Code-style file explorer
│   ├── FileTabs.tsx            # Tab management system
│   ├── FileUploader.tsx        # Basic file upload (simplified)
│   ├── ProjectUploader.tsx     # Advanced upload (disabled)
│   ├── LivePreview.tsx         # Sandpack integration
│   ├── ConsolePanel.tsx        # Console output (UI only)
│   ├── PDFExporter.tsx         # PDF export functionality
│   └── ErrorBoundary.tsx       # Error handling component
├── hooks/
│   ├── useFileTree.ts          # File system state management
│   ├── useFormatter.ts         # Code formatting (disabled)
│   └── useConsoleCapture.ts    # Console messages (disabled)
├── types/
│   └── project.ts              # TypeScript interfaces
├── utils/
│   ├── formatter.ts            # Prettier integration (disabled)
│   └── projectParser.ts        # File parsing (disabled)
└── sample-component.tsx        # Example TSX file for testing
```

## ✅ **What Currently Works**

### **Fully Functional Features:**
1. **File Management**: Upload, edit, delete, and switch between files
2. **Code Editing**: Full Monaco editor with TypeScript support  
3. **Live Preview**: Real-time React component rendering
4. **Project State**: Persistent localStorage, file tree navigation
5. **UI/UX**: Complete VS Code-inspired interface
6. **PDF Export**: Convert rendered components to PDF
7. **Error Handling**: Graceful error boundaries and user feedback

### **User Workflow:**
1. ✅ Drag and drop TSX/TS/JS files into the app
2. ✅ Files appear in the sidebar file tree  
3. ✅ Click files to open them in tabs
4. ✅ Edit code in the Monaco editor
5. ✅ See live preview updates instantly
6. ✅ Switch between multiple files seamlessly
7. ✅ Export preview as PDF
8. ✅ Project persists between browser sessions

## 🔮 **Roadmap for Fixes**

### **Priority 1: Code Formatting**
- [ ] Fix Prettier browser imports with proper bundling
- [ ] Re-enable format button functionality  
- [ ] Add format-on-save option
- [ ] Test with all supported file types

### **Priority 2: Console Integration** 
- [ ] Fix Sandpack message capture
- [ ] Re-enable console panel functionality
- [ ] Add error/warning filtering
- [ ] Implement console clear and expand/collapse

### **Priority 3: Advanced File Handling**
- [ ] Re-enable folder drag and drop
- [ ] Fix ZIP file extraction
- [ ] Add support for package.json projects
- [ ] Implement file tree context menus

### **Priority 4: Enhanced Features**
- [ ] Add file search functionality
- [ ] Implement find/replace in editor
- [ ] Add mini-map to editor
- [ ] Settings panel for editor preferences

## 🚀 Deployment

### Vercel (Recommended)
```bash
# The app is configured for Vercel deployment
# Just connect your GitHub repo to Vercel
# Builds successfully despite ESLint warnings
```

### Manual Deployment
```bash
npm run build  # Builds successfully (ignores ESLint warnings)
npm start     # Runs production server
```

## 🆘 Troubleshooting

### **Common Issues:**

1. **"Internal Server Error"**
   - **Cause**: Advanced features with browser compatibility issues
   - **Solution**: Features automatically disabled, core functionality works

2. **Build Warnings**  
   - **Cause**: ESLint rules on disabled code
   - **Solution**: Safe to ignore, app builds and runs successfully

3. **Missing Format Button**
   - **Cause**: Prettier integration disabled
   - **Status**: UI present, functionality will be restored in future update

4. **Console Not Working**
   - **Cause**: Sandpack message capture disabled  
   - **Status**: Panel UI works, message capture will be restored

### **Development Notes:**
- The app prioritizes stability over feature completeness
- Core multi-file editing experience is fully functional
- Advanced features are disabled but can be re-enabled once fixed
- All UI components are implemented and ready for feature restoration

## 🤝 Contributing

When contributing, please note:

1. **Core functionality**: Multi-file editing, live preview, and file management are stable
2. **Disabled features**: Check the "Known Issues" section before working on formatting/console/advanced uploads
3. **TypeScript**: Maintain strict typing, some any types are temporarily used in disabled features
4. **Testing**: Test with multiple file uploads and project switching

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤖 Inter-Session Context for AI Assistance

### Claude Code Integration
JstCode includes a camera icon in the vertical menu bar for enhanced AI development assistance:

**Screenshot Workflow:**
1. Click the camera icon in the left menu bar
2. Screenshot is automatically captured and saved to your Downloads folder  
3. Drag the screenshot file to Claude Code chat for visual debugging assistance
4. Claude can provide contextual help based on your current interface state

**Context Instructions for Claude:**
- Always check latest screenshot when prompted with "check the latest screenshot"
- Delete screenshots after analysis to keep project clean
- Screenshots are used for UI debugging, layout issues, and real-time assistance
- This enables true copilot-style development with visual context

**Current Session Context:**
- Project uses VS Code color scheme: #1e1e1e, #252526, #2d2d30, #3e3e42
- Main layout: Explorer | Code Editor | Live Preview (3-panel resizable)
- File tree with multi-file support and tab management
- Monaco editor integration with live Sandpack preview
- Several features temporarily disabled (Prettier, console capture, advanced parsing)

---

**Created with ❤️ for developers who just want to code**

*A professional multi-file React editor with live preview - core features working, advanced features coming soon.*