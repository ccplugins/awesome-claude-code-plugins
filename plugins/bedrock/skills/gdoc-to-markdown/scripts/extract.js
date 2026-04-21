// Google Docs / Sheets → Markdown Extractor
// Usage: Read this file, then execute via javascript_tool in a tab loaded with a Google Doc or Sheet
//
// Step 1 (init): Run the full script to extract and store content in window.__gdoc
// Step 2 (read): Run window.__gdoc.chunk(N) to read chunk N (0-indexed)
//
// The script detects whether the page is a Google Doc or Google Sheet,
// extracts content from the appropriate container, converts it to Markdown,
// and stores it in a global variable so it can be read in chunks.

(function () {
  var CHUNK_SIZE = 10000;

  // Detect document type
  var isSheet = window.location.hostname === 'docs.google.com' &&
    window.location.pathname.indexOf('/spreadsheets/') !== -1;
  var isDoc = !isSheet;
  var docType = isSheet ? 'sheet' : 'doc';

  // Check for login redirect
  var bodyText = document.body.innerText || '';
  if ((bodyText.includes('Sign in') || bodyText.includes('Log in')) &&
      bodyText.includes('Google') && bodyText.length < 2000) {
    return JSON.stringify({ error: 'Google login page detected. User must log into Google in Chrome first.' });
  }

  // --- Google Docs extraction ---
  if (isDoc) {
    // Fallback chain of content container selectors for Google Docs
    var docSelectors = [
      '.kix-appview-editor',
      '.kix-page',
      '[data-page-id]',
      '.docs-editor',
      '#docs-editor',
      '.doc-content',
      'article',
      'document.body'
    ];

    var container = null;
    for (var i = 0; i < docSelectors.length; i++) {
      if (docSelectors[i] === 'document.body') {
        container = document.body;
      } else {
        container = document.querySelector(docSelectors[i]);
      }
      if (container) break;
    }

    if (!container) {
      return JSON.stringify({ error: 'Could not find content container on the Google Docs page.' });
    }

    var markdown = docHtmlToMarkdown(container);
    markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

    if (!markdown || markdown.length < 10) {
      return JSON.stringify({ error: 'Document content is empty or too short. The page may not have loaded yet.' });
    }

    return finalize(markdown, docType);
  }

  // --- Google Sheets extraction ---
  if (isSheet) {
    // Try to extract from the visible grid
    var sheetContainer = document.querySelector('.waffle') ||
                         document.querySelector('table.waffle') ||
                         document.querySelector('.grid-container table') ||
                         document.querySelector('table');

    if (!sheetContainer) {
      return JSON.stringify({ error: 'Could not find spreadsheet content. The page may not have loaded yet.' });
    }

    var markdown = sheetTableToMarkdown(sheetContainer);
    markdown = '## Sheet1\n\n' + markdown;
    markdown = markdown.trim();

    if (!markdown || markdown.length < 10) {
      return JSON.stringify({ error: 'Spreadsheet content is empty or too short. The page may not have loaded yet.' });
    }

    return finalize(markdown, docType);
  }

  // --- Shared functions ---

  function docHtmlToMarkdown(el) {
    var result = '';
    var children = el.childNodes;

    for (var i = 0; i < children.length; i++) {
      var node = children[i];

      if (node.nodeType === 3) {
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
        var inner = docHtmlToMarkdown(node).trim();
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
        var boldContent = docHtmlToMarkdown(node).trim();
        if (boldContent) result += '**' + boldContent + '**';
        continue;
      }

      // Italic
      if (tag === 'em' || tag === 'i') {
        var italicContent = docHtmlToMarkdown(node).trim();
        if (italicContent) result += '*' + italicContent + '*';
        continue;
      }

      // Strikethrough
      if (tag === 's' || tag === 'del') {
        var strikeContent = docHtmlToMarkdown(node).trim();
        if (strikeContent) result += '~~' + strikeContent + '~~';
        continue;
      }

      // Links
      if (tag === 'a') {
        var href = node.getAttribute('href') || '';
        var linkText = docHtmlToMarkdown(node).trim();
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
        result += '\n\n' + sheetTableToMarkdown(node) + '\n\n';
        continue;
      }

      // Blockquotes
      if (tag === 'blockquote') {
        var bqContent = docHtmlToMarkdown(node).trim();
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

      // Google Docs specific: kix-lineview contains a line of text
      if (node.classList && node.classList.contains('kix-lineview')) {
        var lineText = node.textContent;
        if (lineText) result += lineText + '\n';
        continue;
      }

      // Google Docs specific: kix-paragraphrenderer contains a paragraph
      if (node.classList && node.classList.contains('kix-paragraphrenderer')) {
        var paraText = docHtmlToMarkdown(node).trim();
        if (paraText) result += '\n' + paraText + '\n';
        continue;
      }

      // Divs, spans, and other containers — recurse
      if (tag === 'div' || tag === 'span' || tag === 'section' ||
          tag === 'td' || tag === 'th' || tag === 'li') {
        result += docHtmlToMarkdown(node);
        continue;
      }

      // Fallback: recurse into unknown elements
      result += docHtmlToMarkdown(node);
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

      var nestedUl = item.querySelector(':scope > ul');
      var nestedOl = item.querySelector(':scope > ol');

      var clone = item.cloneNode(true);
      var nestedLists = clone.querySelectorAll('ul, ol');
      for (var n = 0; n < nestedLists.length; n++) {
        nestedLists[n].parentNode.removeChild(nestedLists[n]);
      }
      var text = docHtmlToMarkdown(clone).trim();

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

  function sheetTableToMarkdown(tableEl) {
    var rows = tableEl.querySelectorAll('tr');
    if (rows.length === 0) return '';

    var result = '';
    var colCount = 0;

    // Filter out completely empty rows
    var nonEmptyRows = [];
    for (var r = 0; r < rows.length; r++) {
      var cells = rows[r].querySelectorAll('td, th');
      var hasContent = false;
      for (var c = 0; c < cells.length; c++) {
        if (cells[c].textContent.trim()) {
          hasContent = true;
          break;
        }
      }
      if (hasContent) nonEmptyRows.push(rows[r]);
    }

    if (nonEmptyRows.length === 0) return '';

    for (var r = 0; r < nonEmptyRows.length; r++) {
      var cells = nonEmptyRows[r].querySelectorAll('td, th');
      if (cells.length > colCount) colCount = cells.length;

      result += '|';
      for (var c = 0; c < cells.length; c++) {
        var cellText = cells[c].textContent.trim().replace(/\n+/g, ' ').replace(/\|/g, '\\|');
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

  function finalize(markdown, type) {
    // Extract title
    var title = '';
    var titleEl = document.querySelector('[data-document-title]') ||
                  document.querySelector('.docs-title-input') ||
                  document.querySelector('.doc-title') ||
                  document.querySelector('title');
    if (titleEl) {
      title = titleEl.getAttribute('data-document-title') ||
              titleEl.value ||
              titleEl.textContent || '';
      title = title.trim();
      // Clean up " - Google Docs" or " - Google Sheets" suffix
      title = title.replace(/\s*-\s*Google (Docs|Sheets|Spreadsheets)$/, '');
    }

    var totalLength = markdown.length;
    var totalChunks = Math.ceil(totalLength / CHUNK_SIZE);

    window.__gdoc = {
      text: markdown,
      title: title,
      docType: type,
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
      docType: type,
      instructions: 'Run window.__gdoc.chunk(0), window.__gdoc.chunk(1), etc. to read each chunk.'
    });
  }
})();
