interface AiResponse {
  expression: string
  description: string
}

const keywordMap: [RegExp, AiResponse][] = [
  [/combine|concat|join|merge/i, {
    expression: 'concat(field1, " ", field2)',
    description: 'Concatenates the source fields with a space separator',
  }],
  [/upper|capitalize|caps/i, {
    expression: 'toUpperCase()',
    description: 'Converts the value to uppercase',
  }],
  [/lower/i, {
    expression: 'toLowerCase()',
    description: 'Converts the value to lowercase',
  }],
  [/trim|whitespace|space/i, {
    expression: 'trim()',
    description: 'Removes leading and trailing whitespace',
  }],
  [/remove.*special|clean|sanitize/i, {
    expression: 'removeSpecialChars()',
    description: 'Removes special characters from the value',
  }],
  [/date|format.*date|parse.*date/i, {
    expression: 'formatDate(value, "YYYY-MM-DD")',
    description: 'Formats the date value to YYYY-MM-DD',
  }],
  [/number|numeric|parse.*num/i, {
    expression: 'toNumber()',
    description: 'Converts the value to a numeric type',
  }],
  [/replace/i, {
    expression: 'replace("old_value", "new_value")',
    description: 'Replaces occurrences of old_value with new_value',
  }],
  [/substring|extract|slice/i, {
    expression: 'substring(0, 10)',
    description: 'Extracts a substring from position 0 to 10',
  }],
]

export function generateAiResponse(prompt: string, sourceFieldNames?: string[]): AiResponse {
  // Check keyword map
  for (const [pattern, response] of keywordMap) {
    if (pattern.test(prompt)) {
      // Replace generic field names with actual source field names if available
      if (sourceFieldNames && sourceFieldNames.length >= 2 && response.expression.includes('field1')) {
        return {
          ...response,
          expression: response.expression
            .replace('field1', sourceFieldNames[0])
            .replace('field2', sourceFieldNames[1]),
        }
      }
      return response
    }
  }

  // Default fallback
  const fieldRef = sourceFieldNames?.length
    ? `transform(${sourceFieldNames[0]})`
    : 'transform(value)'

  return {
    expression: fieldRef,
    description: 'Generated a basic transformation based on your description',
  }
}

export const AI_GENERATION_DELAY_MS = 1500
