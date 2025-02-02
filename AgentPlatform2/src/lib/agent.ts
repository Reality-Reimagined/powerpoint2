import { Groq } from 'groq-sdk';
// import { ChatPromptTemplate } from "@langchain/core/prompts";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const client = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

// Models
const ROUTING_MODEL = 'llama3-70b-8192';
const TOOL_USE_MODEL = 'llama-3.3-70b-versatile';
const GENERAL_MODEL = 'llama3-70b-8192';

// Tool implementations
function calculate(expression: string) {
  try {
    const result = eval(expression);
    return JSON.stringify({ result });
  } catch (error) {
    return JSON.stringify({ error: 'Invalid expression' });
  }
}

function codeAssistant(prompt: string, language: string) {
  const systemPrompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an expert ${language} programmer. Write clean, efficient, and well-documented code.`],
    ["human", prompt]
  ]);
  
  return `Generated ${language} code for: ${prompt}`;
}

function debugCode(code: string, error: string) {
  const debugPrompt = ChatPromptTemplate.fromMessages([
    ["system", "You are an expert debugger. Analyze code and errors to provide solutions."],
    ["human", `Code: ${code}\nError: ${error}`]
  ]);
  
  return `Debug analysis and solution for the error`;
}

function optimizeCode(code: string, target: string) {
  const optimizePrompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a code optimization expert. Improve code performance and efficiency."],
    ["human", `Code: ${code}\nOptimization target: ${target}`]
  ]);
  
  return `Optimized version of the code`;
}

function generateTestCases(code: string, language: string) {
  const testPrompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a testing expert. Generate comprehensive test cases for ${language} code.`],
    ["human", code]
  ]);
  
  return `Generated test cases for the code`;
}

function explainCode(code: string) {
  const explainPrompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a code explanation expert. Break down code into clear, understandable concepts."],
    ["human", code]
  ]);
  
  return `Detailed explanation of the code`;
}

function refactorCode(code: string, goal: string) {
  const refactorPrompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a code refactoring expert. Improve code structure and maintainability."],
    ["human", `Code: ${code}\nRefactoring goal: ${goal}`]
  ]);
  
  return `Refactored version of the code`;
}

function securityAudit(code: string) {
  const auditPrompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a security expert. Identify and fix potential security vulnerabilities in code."],
    ["human", code]
  ]);
  
  return `Security audit results and recommendations`;
}

function documentCode(code: string, format: string) {
  const docPrompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a documentation expert. Generate clear ${format} documentation for code.`],
    ["human", code]
  ]);
  
  return `Generated documentation for the code`;
}

function convertCode(code: string, fromLang: string, toLang: string) {
  const convertPrompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a code conversion expert. Convert code from ${fromLang} to ${toLang} while maintaining functionality.`],
    ["human", code]
  ]);
  
  return `Converted code from ${fromLang} to ${toLang}`;
}

function summarizeText(text: string) {
  return `Here's a summary of the text: ${text.substring(0, 100)}...`;
}

function generateImage(prompt: string) {
  return `Image generation simulation for: ${prompt}`;
}

function analyzeSentiment(text: string) {
  const sentiments = ['positive', 'negative', 'neutral'];
  return sentiments[Math.floor(Math.random() * sentiments.length)];
}

function extractKeywords(text: string) {
  return text.split(' ')
    .filter(word => word.length > 4)
    .slice(0, 5)
    .join(', ');
}

function translateText(text: string, targetLanguage: string) {
  const translations: Record<string, Record<string, string>> = {
    "Hello": {
      "es": "Hola",
      "fr": "Bonjour",
      "de": "Hallo"
    }
  };
  return translations[text]?.[targetLanguage] || "Translation not available";
}

// Available tools configuration
const tools = {
  codeAssistant: {
    name: "codeAssistant",
    description: "Generate code in a specified programming language with expert guidance",
    parameters: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "The code requirements or description",
        },
        language: {
          type: "string",
          description: "The target programming language",
        }
      },
      required: ["prompt", "language"],
    }
  },
  debugCode: {
    name: "debugCode",
    description: "Debug code and provide solutions for errors",
    parameters: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The code to debug",
        },
        error: {
          type: "string",
          description: "The error message or description",
        }
      },
      required: ["code", "error"],
    }
  },
  optimizeCode: {
    name: "optimizeCode",
    description: "Optimize code for better performance",
    parameters: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The code to optimize",
        },
        target: {
          type: "string",
          description: "The optimization target (e.g., speed, memory)",
        }
      },
      required: ["code", "target"],
    }
  },
  generateTestCases: {
    name: "generateTestCases",
    description: "Generate test cases for code",
    parameters: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The code to test",
        },
        language: {
          type: "string",
          description: "The programming language",
        }
      },
      required: ["code", "language"],
    }
  },
  explainCode: {
    name: "explainCode",
    description: "Explain code in detail",
    parameters: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The code to explain",
        }
      },
      required: ["code"],
    }
  },
  refactorCode: {
    name: "refactorCode",
    description: "Refactor code for better structure",
    parameters: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The code to refactor",
        },
        goal: {
          type: "string",
          description: "The refactoring goal",
        }
      },
      required: ["code", "goal"],
    }
  },
  securityAudit: {
    name: "securityAudit",
    description: "Perform security audit on code",
    parameters: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The code to audit",
        }
      },
      required: ["code"],
    }
  },
  documentCode: {
    name: "documentCode",
    description: "Generate documentation for code",
    parameters: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The code to document",
        },
        format: {
          type: "string",
          description: "Documentation format (e.g., JSDoc, docstring)",
        }
      },
      required: ["code", "format"],
    }
  },
  convertCode: {
    name: "convertCode",
    description: "Convert code between programming languages",
    parameters: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The code to convert",
        },
        fromLang: {
          type: "string",
          description: "Source programming language",
        },
        toLang: {
          type: "string",
          description: "Target programming language",
        }
      },
      required: ["code", "fromLang", "toLang"],
    }
  },
  calculate: {
    name: "calculate",
    description: "Evaluate a mathematical expression",
    parameters: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description: "The mathematical expression to evaluate",
        }
      },
      required: ["expression"],
    }
  },
  summarize: {
    name: "summarizeText",
    description: "Generate a concise summary of a text",
    parameters: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text to summarize",
        }
      },
      required: ["text"],
    }
  },
  sentiment: {
    name: "analyzeSentiment",
    description: "Analyze the sentiment of a text",
    parameters: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text to analyze",
        }
      },
      required: ["text"],
    }
  },
  keywords: {
    name: "extractKeywords",
    description: "Extract key words from a text",
    parameters: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text to analyze",
        }
      },
      required: ["text"],
    }
  },
  translate: {
    name: "translateText",
    description: "Translate text to another language",
    parameters: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text to translate",
        },
        targetLanguage: {
          type: "string",
          description: "The target language code (e.g., es, fr, de)",
        }
      },
      required: ["text", "targetLanguage"],
    }
  }
};

// Function implementations map
const functionMap = {
  calculate,
  codeAssistant,
  debugCode,
  optimizeCode,
  generateTestCases,
  explainCode,
  refactorCode,
  securityAudit,
  documentCode,
  convertCode,
  summarizeText,
  analyzeSentiment,
  extractKeywords,
  translateText
};

async function routeQuery(query: string) {
  const toolsList = Object.keys(tools).map(tool => 
    `${tool.toUpperCase()} - ${tools[tool as keyof typeof tools].description}`
  ).join('\n');

  const routingPrompt = `
    Given the following user query, determine which tool is needed to answer it.
    Available tools:
    ${toolsList}

    If no tools are needed, respond with 'NO TOOL'.
    
    User query: ${query}

    Response format: TOOL: [TOOLNAME]
  `;

  const response = await client.chat.completions.create({
    model: ROUTING_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are a routing assistant. Determine the appropriate tool based on the user query.',
      },
      { role: 'user', content: routingPrompt },
    ],
    max_completion_tokens: 20,
  });

  const routingDecision = response.choices[0].message.content.trim().toUpperCase();
  const toolMatch = routingDecision.match(/TOOL: (\w+)/);
  
  if (toolMatch) {
    const tool = toolMatch[1].toLowerCase();
    return tools[tool as keyof typeof tools] ? tool : 'none';
  }
  
  return 'none';
}

async function processWithTool(query: string, toolName: string) {
  const messages = [
    {
      role: 'system',
      content: `You are an AI assistant that can use the ${toolName} tool to help users.`,
    },
    {
      role: 'user',
      content: query,
    },
  ];

  const response = await client.chat.completions.create({
    model: TOOL_USE_MODEL,
    messages: messages,
    tools: [{ type: 'function', function: tools[toolName as keyof typeof tools] }],
    tool_choice: 'auto',
    max_completion_tokens: 4096,
  });

  const responseMessage = response.choices[0].message;
  const toolCalls = responseMessage.tool_calls;

  if (toolCalls) {
    messages.push(responseMessage);

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionToCall = functionMap[functionName as keyof typeof functionMap];
      const functionArgs = JSON.parse(toolCall.function.arguments);
      const functionResponse = functionToCall(...Object.values(functionArgs));

      messages.push({
        tool_call_id: toolCall.id,
        role: 'tool',
        name: functionName,
        content: JSON.stringify(functionResponse),
      });
    }

    const secondResponse = await client.chat.completions.create({
      model: TOOL_USE_MODEL,
      messages: messages,
    });

    return secondResponse.choices[0].message.content;
  }

  return responseMessage.content;
}

async function processGeneralQuery(query: string) {
  const response = await client.chat.completions.create({
    model: GENERAL_MODEL,
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: query },
    ],
  });
  return response.choices[0].message.content;
}

export async function processQuery(query: string) {
  try {
    const route = await routeQuery(query);
    let response;

    if (route === 'none') {
      response = await processGeneralQuery(query);
    } else {
      response = await processWithTool(query, route);
    }

    return {
      query,
      route,
      response,
      error: null
    };
  } catch (error) {
    return {
      query,
      route: 'error',
      response: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}