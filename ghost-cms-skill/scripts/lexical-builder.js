#!/usr/bin/env node

/**
 * Lexical Content Builder for Ghost CMS
 * Converts structured content to Ghost's Lexical format
 */

/**
 * Create a text node
 */
function createTextNode(text, format = 0) {
  return {
    detail: 0,
    format,
    mode: "normal",
    style: "",
    text,
    type: "extended-text",
    version: 1
  };
}

/**
 * Create a paragraph
 */
function createParagraph(text, format = 0) {
  return {
    children: [createTextNode(text, format)],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "paragraph",
    version: 1
  };
}

/**
 * Create a heading
 */
function createHeading(text, level = 2, format = 1) {
  return {
    children: [createTextNode(text, format)],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "heading",
    version: 1,
    tag: `h${level}`
  };
}

/**
 * Build complete Lexical document
 */
function buildLexical(children) {
  return {
    root: {
      children,
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1
    }
  };
}

/**
 * Convert simple text to Lexical (paragraphs separated by double newlines)
 */
function textToLexical(text) {
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  const children = paragraphs.map(para => createParagraph(para.trim()));
  return buildLexical(children);
}

/**
 * Convert structured content to Lexical
 * 
 * @param {Array} content - Array of content blocks
 * @returns {Object} Lexical document
 * 
 * Example:
 * [
 *   { type: 'h2', text: 'Main Heading' },
 *   { type: 'p', text: 'First paragraph' },
 *   { type: 'h3', text: 'Subheading' },
 *   { type: 'p', text: 'Second paragraph', bold: true }
 * ]
 */
function structuredToLexical(content) {
  const children = content.map(block => {
    const format = block.bold && block.italic ? 3 : block.bold ? 1 : block.italic ? 2 : 0;
    
    if (block.type === 'p') {
      return createParagraph(block.text, format);
    } else if (block.type.startsWith('h')) {
      const level = parseInt(block.type.substring(1));
      return createHeading(block.text, level, format);
    } else {
      // Default to paragraph
      return createParagraph(block.text, format);
    }
  });
  
  return buildLexical(children);
}

/**
 * Stringify Lexical for Ghost API
 */
function stringifyLexical(lexicalDoc) {
  return JSON.stringify(lexicalDoc);
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const mode = process.argv[2] || 'text';
  
  if (mode === 'text') {
    // Simple text mode
    const text = process.argv.slice(3).join(' ');
    if (!text) {
      console.error('Usage: lexical-builder.js text "Your text here"');
      process.exit(1);
    }
    const lexical = textToLexical(text);
    console.log(stringifyLexical(lexical));
  } else if (mode === 'structured') {
    // Structured mode - expects JSON input
    const jsonInput = process.argv.slice(3).join(' ');
    if (!jsonInput) {
      console.error('Usage: lexical-builder.js structured \'[{"type":"h2","text":"Title"},{"type":"p","text":"Content"}]\'');
      process.exit(1);
    }
    try {
      const content = JSON.parse(jsonInput);
      const lexical = structuredToLexical(content);
      console.log(stringifyLexical(lexical));
    } catch (e) {
      console.error('Invalid JSON:', e.message);
      process.exit(1);
    }
  } else if (mode === 'example') {
    // Show example
    const example = [
      { type: 'h2', text: 'Main Heading' },
      { type: 'p', text: 'This is a normal paragraph.' },
      { type: 'h3', text: 'Subheading' },
      { type: 'p', text: 'This is bold text.', bold: true },
      { type: 'p', text: 'This is italic text.', italic: true },
      { type: 'p', text: 'This is bold and italic.', bold: true, italic: true }
    ];
    const lexical = structuredToLexical(example);
    console.log('Example structured content:');
    console.log(JSON.stringify(example, null, 2));
    console.log('\nResulting Lexical:');
    console.log(JSON.stringify(lexical, null, 2));
  } else {
    console.error('Unknown mode. Use: text, structured, or example');
    process.exit(1);
  }
}

// Export for use as module
export {
  createTextNode,
  createParagraph,
  createHeading,
  buildLexical,
  textToLexical,
  structuredToLexical,
  stringifyLexical
};

/**
 * Create a button card
 * @param {string} buttonText - Button label
 * @param {string} buttonUrl - Link destination
 * @param {string} alignment - "left" or "center" (default: "center")
 */
function createButtonCard(buttonText, buttonUrl, alignment = "center") {
  return {
    type: "button",
    version: 1,
    buttonText,
    alignment,
    buttonUrl
  };
}

/**
 * Create a toggle (collapsible) card
 * @param {string} heading - Toggle header/title
 * @param {string} content - Collapsible content (HTML)
 */
function createToggleCard(heading, content) {
  return {
    type: "toggle",
    version: 1,
    heading: `<span style="white-space: pre-wrap;">${heading}</span>`,
    content: `<p dir="ltr"><span style="white-space: pre-wrap;">${content}</span></p>`
  };
}

/**
 * Create a video card
 * @param {string} src - Video file URL
 * @param {object} options - Optional settings
 */
function createVideoCard(src, options = {}) {
  return {
    type: "video",
    version: 1,
    src,
    caption: options.caption ? `<p dir="ltr"><span style="white-space: pre-wrap;">${options.caption}</span></p>` : "",
    fileName: options.fileName || "",
    mimeType: options.mimeType || "",
    width: options.width || null,
    height: options.height || null,
    duration: options.duration || 0,
    thumbnailSrc: options.thumbnailSrc || "",
    customThumbnailSrc: options.customThumbnailSrc || "",
    thumbnailWidth: options.thumbnailWidth || null,
    thumbnailHeight: options.thumbnailHeight || null,
    cardWidth: options.cardWidth || "regular",
    loop: options.loop || false
  };
}

/**
 * Create an audio card
 * @param {string} src - Audio file URL
 * @param {string} title - Audio title
 * @param {object} options - Optional settings
 */
function createAudioCard(src, title, options = {}) {
  return {
    type: "audio",
    version: 1,
    duration: options.duration || 0,
    mimeType: options.mimeType || "audio/mpeg",
    src,
    title,
    thumbnailSrc: options.thumbnailSrc || ""
  };
}

/**
 * Create a file download card
 * @param {string} src - File URL
 * @param {string} fileTitle - Display title
 * @param {object} options - Optional settings
 */
function createFileCard(src, fileTitle, options = {}) {
  return {
    type: "file",
    src,
    fileTitle,
    fileCaption: options.fileCaption || "",
    fileName: options.fileName || "",
    fileSize: options.fileSize || 0
  };
}

/**
 * Create a product card
 * @param {string} title - Product name
 * @param {string} description - Product description
 * @param {object} options - Optional settings
 */
function createProductCard(title, description, options = {}) {
  return {
    type: "product",
    version: 1,
    productImageSrc: options.imageSrc || "",
    productImageWidth: options.imageWidth || null,
    productImageHeight: options.imageHeight || null,
    productTitle: `<span style="white-space: pre-wrap;">${title}</span>`,
    productDescription: `<p dir="ltr"><span style="white-space: pre-wrap;">${description}</span></p>`,
    productRatingEnabled: options.ratingEnabled || false,
    productStarRating: options.starRating || 5,
    productButtonEnabled: options.buttonEnabled || false,
    productButton: options.buttonText || "",
    productUrl: options.productUrl || ""
  };
}

/**
 * Create a paywall divider
 */
function createPaywallCard() {
  return {
    type: "paywall",
    version: 1
  };
}

/**
 * Create an embed card
 * @param {string} url - URL to embed (YouTube, Spotify, Twitter, etc.)
 * 
 * Note: Ghost will automatically fetch oEmbed metadata when the post is created.
 * This creates a minimal structure that Ghost will populate.
 */
function createEmbedCard(url) {
  return {
    type: "embed",
    version: 1,
    url,
    embedType: "",  // Ghost will populate this
    html: "",        // Ghost will populate this
    metadata: {},    // Ghost will populate this
    caption: ""
  };
}

// Update exports
export {
  createTextNode,
  createParagraph,
  createHeading,
  buildLexical,
  textToLexical,
  structuredToLexical,
  stringifyLexical,
  createButtonCard,
  createToggleCard,
  createVideoCard,
  createAudioCard,
  createFileCard,
  createProductCard,
  createPaywallCard,
  createEmbedCard
};

/**
 * Load and inject a snippet into Lexical content
 * @param {string} snippetName - Name of snippet from library
 * @param {Object} lexicalDoc - Existing Lexical document
 * @param {string} position - 'start', 'end', or number
 * @returns {Object} Updated Lexical document
 */
async function injectSnippetFromLibrary(snippetName, lexicalDoc, position = 'end') {
  // Dynamic import of snippet manager
  const { loadSnippet, injectSnippet } = await import('../snippets/ghost-snippet.js');
  
  const snippet = loadSnippet(snippetName);
  return injectSnippet(snippet, lexicalDoc, position);
}

/**
 * Build Lexical document with snippet at end
 * @param {Array} content - Main content cards
 * @param {string} snippetName - Snippet to append
 * @returns {Object} Complete Lexical document
 */
async function buildLexicalWithSnippet(content, snippetName) {
  const lexical = buildLexical(content);
  return await injectSnippetFromLibrary(snippetName, lexical, 'end');
}

// Update exports
export {
  createTextNode,
  createParagraph,
  createHeading,
  buildLexical,
  textToLexical,
  structuredToLexical,
  stringifyLexical,
  createButtonCard,
  createToggleCard,
  createVideoCard,
  createAudioCard,
  createFileCard,
  createProductCard,
  createPaywallCard,
  createEmbedCard,
  injectSnippetFromLibrary,
  buildLexicalWithSnippet
};
