export const splitTextWithMath = (text) => {
  const mathRegex = /(\b[a-zA-Zα-ωΑ-Ω]+\([^)]*\)\b|\b[a-zA-Z]+\s*=\s*[^ ,.\n]+|\b[a-zA-Z]+\^[^\s,]+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = mathRegex.exec(text)) !== null) {
    const index = match.index;

    // Add plain text before this match
    if (index > lastIndex) {
      const plain = text.slice(lastIndex, index);
      if (plain) parts.push({ type: "text", content: plain });
    }

    const mathPart = match[0].trim();
    if (mathPart) {
      parts.push({ type: "math", content: `$${mathPart}$` }); // inline math
    }

    lastIndex = index + match[0].length;
  }

  // Add remaining plain text
  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  return parts;
};
