import React from 'react';

/**
 * Formats text returned from LLM by converting bold markdown (**text**)
 * to <strong> elements and inline code (`code`) to <code> elements.
 * 
 * @param {string} text - The raw text content from LLM.
 * @returns {React.ReactNode} - The formatted React elements.
 */
export const formatLLMResponse = (text) => {
  if (!text) return '';

  // 1. Split by '**' to find bold sections
  const boldParts = text.split('**');

  return boldParts.map((boldPart, boldIndex) => {
    // 2. For each part, split by backticks '`' to find inline code sections
    const codeParts = boldPart.split('`');
    const renderedParts = codeParts.map((codePart, codeIndex) => {
      if (codeIndex % 2 === 1) {
        // Inline code
        return (
          <code 
            key={`code-${boldIndex}-${codeIndex}`} 
            className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-[11px] text-indigo-300 mx-0.5"
          >
            {codePart}
          </code>
        );
      }
      return codePart;
    });

    if (boldIndex % 2 === 1) {
      // Bold text (with potential code parts inside rendered)
      return (
        <strong 
          key={`bold-${boldIndex}`} 
          className="font-semibold text-slate-100"
        >
          {renderedParts}
        </strong>
      );
    }

    return (
      <React.Fragment key={`text-${boldIndex}`}>
        {renderedParts}
      </React.Fragment>
    );
  });
};
