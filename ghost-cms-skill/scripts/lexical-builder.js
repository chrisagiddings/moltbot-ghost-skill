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
