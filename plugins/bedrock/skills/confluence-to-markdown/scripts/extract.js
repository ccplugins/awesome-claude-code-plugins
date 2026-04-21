// Confluence Page → Markdown Extractor
// Usage: Read this file, then execute via javascript_tool in a tab loaded with a Confluence page
//
// Step 1 (init): Run the full script to extract and store content in window.__confluence
// Step 2 (read): Run window.__confluence.chunk(N) to read chunk N (0-indexed)
//
// The script extracts HTML from the Confluence content container, converts it to Markdown,
// and stores it in a global variable so it can be read in chunks without re-parsing the DOM.

(function () {
  var CHUNK_SIZE = 10000;

  // Fallback chain of content container selectors
  var selectors = [
    '[data-testid="renderer-container"]',
    '#content .wiki-content',
    '#main-content',
    'article',
    '#content',
    'document.body'
  ];

  var container = null;
  for (var i = 0; i < selectors.length; i++) {
    if (selectors[i] === 'document.body') {
      container = document.body;
    } else {
      container = document.querySelector(selectors[i]);
    }
    if (container) break;
  }

  if (!container) {
    return JSON.stringify({ error: 'Could not find content container on the page.' });
  }

  // Check for login redirect
  var bodyText = document.body.innerText || '';
  if (bodyText.includes('Log in') && bodyText.includes('Atlassian') && bodyText.length < 2000) {
    return JSON.stringify({ error: 'Atlassian login page detected. User must log into Confluence in Chrome first.' });
  }

  // HTML-to-Markdown conversion
  function htmlToMarkdown(el) {
    var result = '';
    var children = el.childNodes;

    for (var i = 0; i < children.length; i++) {
      var node = children[i];

      if (node.nodeType === 3) {
        // Text node
        result += node.textContent;
        continue;
      }

      if (node.nodeType !== 1) continue;

      var tag = node.tagName.toLowerCase();

      // Headings
      if (/^h[1-6]$/.test(tag)) {
        var level = parseInt(tag.charAt(1));
        var prefix = '';
        for (var h = 0; h < level; h++) prefix += '#';
        result += '\n\n' + prefix + ' ' + node.textContent.trim() + '\n\n';
        continue;
      }

      // Paragraphs
      if (tag === 'p') {
        var inner = htmlToMarkdown(node).trim();
        if (inner) result += '\n\n' + inner + '\n\n';
        continue;
      }

      // Line breaks
      if (tag === 'br') {
        result += '\n';
        continue;
      }

      // Bold
      if (tag === 'strong' || tag === 'b') {
        var boldContent = htmlToMarkdown(node).trim();
        if (boldContent) result += '**' + boldContent + '**';
        continue;
      }

      // Italic
      if (tag === 'em' || tag === 'i') {
        var italicContent = htmlToMarkdown(node).trim();
        if (italicContent) result += '*' + italicContent + '*';
        continue;
      }

      // Strikethrough
      if (tag === 's' || tag === 'del') {
        var strikeContent = htmlToMarkdown(node).trim();
        if (strikeContent) result += '~~' + strikeContent + '~~';
        continue;
      }

      // Links
      if (tag === 'a') {
        var href = node.getAttribute('href') || '';
        var linkText = htmlToMarkdown(node).trim();
        if (linkText && href) {
          result += '[' + linkText + '](' + href + ')';
        } else if (linkText) {
          result += linkText;
        }
        continue;
      }

      // Inline code
      if (tag === 'code' && node.parentElement && node.parentElement.tagName.toLowerCase() !== 'pre') {
        result += '`' + node.textContent + '`';
        continue;
      }

      // Code blocks
      if (tag === 'pre') {
        var codeEl = node.querySelector('code');
        var codeText = codeEl ? codeEl.textContent : node.textContent;
        var lang = '';
        if (codeEl) {
          var cls = codeEl.getAttribute('class') || '';
          var langMatch = cls.match(/language-(\w+)/);
          if (langMatch) lang = langMatch[1];
        }
        // Also check Confluence data attribute for language
        var dataLang = node.getAttribute('data-syntaxhighlighter-params');
        if (!lang && dataLang) {
          var brushMatch = dataLang.match(/brush:\s*(\w+)/);
          if (brushMatch) lang = brushMatch[1];
        }
        result += '\n\n```' + lang + '\n' + codeText.trim() + '\n```\n\n';
        continue;
      }

      // Unordered lists
      if (tag === 'ul') {
        result += '\n' + convertList(node, '- ', 0) + '\n';
        continue;
      }

      // Ordered lists
      if (tag === 'ol') {
        result += '\n' + convertList(node, '1. ', 0) + '\n';
        continue;
      }

      // Tables
      if (tag === 'table') {
        result += '\n\n' + convertTable(node) + '\n\n';
        continue;
      }

      // Blockquotes
      if (tag === 'blockquote') {
        var bqContent = htmlToMarkdown(node).trim();
        if (bqContent) {
          var bqLines = bqContent.split('\n');
          result += '\n\n';
          for (var bq = 0; bq < bqLines.length; bq++) {
            result += '> ' + bqLines[bq] + '\n';
          }
          result += '\n';
        }
        continue;
      }

      // Horizontal rules
      if (tag === 'hr') {
        result += '\n\n---\n\n';
        continue;
      }

      // Divs and other containers — recurse
      if (tag === 'div' || tag === 'span' || tag === 'section' || tag === 'td' || tag === 'th' || tag === 'li') {
        result += htmlToMarkdown(node);
        continue;
      }

      // Confluence macros and panels — extract text content
      if (node.classList && (node.classList.contains('confluence-information-macro') ||
          node.classList.contains('panel') ||
          node.classList.contains('expand-container'))) {
        result += '\n\n' + htmlToMarkdown(node).trim() + '\n\n';
        continue;
      }

      // Fallback: recurse into unknown elements
      result += htmlToMarkdown(node);
    }

    return result;
  }

  function convertList(listEl, marker, depth) {
    var items = listEl.children;
    var result = '';
    var indent = '';
    for (var d = 0; d < depth; d++) indent += '  ';
    var counter = 1;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.tagName.toLowerCase() !== 'li') continue;

      // Check for nested lists
      var nestedUl = item.querySelector(':scope > ul');
      var nestedOl = item.querySelector(':scope > ol');

      // Get direct text (excluding nested lists)
      var clone = item.cloneNode(true);
      var nestedLists = clone.querySelectorAll('ul, ol');
      for (var n = 0; n < nestedLists.length; n++) {
        nestedLists[n].parentNode.removeChild(nestedLists[n]);
      }
      var text = htmlToMarkdown(clone).trim();

      var actualMarker = marker === '1. ' ? (counter + '. ') : marker;
      result += indent + actualMarker + text + '\n';
      counter++;

      if (nestedUl) {
        result += convertList(nestedUl, '- ', depth + 1);
      }
      if (nestedOl) {
        result += convertList(nestedOl, '1. ', depth + 1);
      }
    }

    return result;
  }

  function convertTable(tableEl) {
    var rows = tableEl.querySelectorAll('tr');
    if (rows.length === 0) return '';

    var result = '';
    var colCount = 0;

    for (var r = 0; r < rows.length; r++) {
      var cells = rows[r].querySelectorAll('td, th');
      if (cells.length > colCount) colCount = cells.length;

      result += '|';
      for (var c = 0; c < cells.length; c++) {
        var cellText = htmlToMarkdown(cells[c]).trim().replace(/\n+/g, ' ');
        result += ' ' + cellText + ' |';
      }
      result += '\n';

      // Add separator after first row (header)
      if (r === 0) {
        result += '|';
        for (var s = 0; s < cells.length; s++) {
          result += ' --- |';
        }
        result += '\n';
      }
    }

    return result;
  }

  // Extract title
  var title = '';
  var titleEl = document.querySelector('[data-testid="title-text"]') ||
                document.querySelector('#title-text') ||
                document.querySelector('h1');
  if (titleEl) title = titleEl.textContent.trim();

  // Convert content
  var markdown = htmlToMarkdown(container);

  // Clean up excessive whitespace
  markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

  if (!markdown || markdown.length < 10) {
    return JSON.stringify({ error: 'Page content is empty or too short. The page may not have loaded yet.' });
  }

  var totalLength = markdown.length;
  var totalChunks = Math.ceil(totalLength / CHUNK_SIZE);

  // Store in global for chunk reads
  window.__confluence = {
    text: markdown,
    title: title,
    totalLength: totalLength,
    totalChunks: totalChunks,
    chunkSize: CHUNK_SIZE,
    chunk: function (n) {
      var start = n * CHUNK_SIZE;
      if (start >= this.totalLength) return JSON.stringify({ error: 'Chunk index out of range', max: this.totalChunks - 1 });
      return this.text.substring(start, start + CHUNK_SIZE);
    }
  };

  return JSON.stringify({
    status: 'ready',
    totalLength: totalLength,
    totalChunks: totalChunks,
    chunkSize: CHUNK_SIZE,
    title: title,
    instructions: 'Run window.__confluence.chunk(0), window.__confluence.chunk(1), etc. to read each chunk.'
  });
})();
