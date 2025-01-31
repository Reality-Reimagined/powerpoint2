// import { Groq } from 'groq-sdk';
// import * as math from 'mathjs';
// import convert from 'convert';
// import fetch from 'node-fetch';
// import translate from '@vitalets/google-translate-api';

// const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
// const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// const client = new Groq({
//   apiKey: GROQ_API_KEY,
//   dangerouslyAllowBrowser: true
// });

// // Models
// const ROUTING_MODEL = 'llama3-70b-8192';
// const TOOL_USE_MODEL = 'llama-3.3-70b-versatile';
// const GENERAL_MODEL = 'llama3-70b-8192';

// // Tool implementations
// async function calculate(expression: string) {
//   try {
//     // Using mathjs for safe mathematical evaluation
//     const result = math.evaluate(expression);
//     return { result: result.toString() };
//   } catch (error) {
//     return { error: 'Invalid expression' };
//   }
// }

// async function getWeatherInfo(location: string) {
//   try {
//     const response = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=metric`
//     );
    
//     if (!response.ok) {
//       throw new Error('Weather data not available');
//     }

//     const data = await response.json();
//     const weather = {
//       temperature: Math.round(data.main.temp),
//       condition: data.weather[0].description,
//       humidity: data.main.humidity,
//       windSpeed: data.wind.speed,
//       location: data.name,
//       country: data.sys.country
//     };

//     return `Current weather in ${weather.location}, ${weather.country}:
// Temperature: ${weather.temperature}°C
// Condition: ${weather.condition}
// Humidity: ${weather.humidity}%
// Wind Speed: ${weather.windSpeed} m/s`;
//   } catch (error) {
//     return `Error: Unable to fetch weather data for ${location}`;
//   }
// }

// // async function translateText(text: string, targetLanguage: string) {
// //   try {
// //     const { text: translatedText } = await translate(text, { to: targetLanguage });
// //     return translatedText;
// //   } catch (error) {
// //     return `Error: Unable to translate text`;
// //   }
// // }
// function translateText(text: string, targetLanguage: string) {
//   // Mock translation data - in production, this would call a translation API
//   const translations: Record<string, Record<string, string>> = {
//     "Hello": {
//       "es": "Hola",
//       "fr": "Bonjour",
//       "de": "Hallo"
//     },
//     "Goodbye": {
//       "es": "Adiós",
//       "fr": "Au revoir",
//       "de": "Auf Wiedersehen"
//     }
//   };

//   return translations[text]?.[targetLanguage] || "Translation not available";
// }

// async function convertUnits(value: number, from: string, to: string) {
//   try {
//     const result = convert(value).from(from).to(to);
//     return `${value} ${from} = ${result.toFixed(2)} ${to}`;
//   } catch (error) {
//     return `Error: Unable to convert from ${from} to ${to}`;
//   }
// }

// // Available tools configuration
// const tools = {
//   calculate: {
//     name: "calculate",
//     description: "Safely evaluate a mathematical expression using mathjs",
//     parameters: {
//       type: "object",
//       properties: {
//         expression: {
//           type: "string",
//           description: "The mathematical expression to evaluate",
//         }
//       },
//       required: ["expression"],
//     }
//   },
//   weather: {
//     name: "getWeatherInfo",
//     description: "Get real-time weather information for a location using OpenWeatherMap API",
//     parameters: {
//       type: "object",
//       properties: {
//         location: {
//           type: "string",
//           description: "The name of the city",
//         }
//       },
//       required: ["location"],
//     }
//   },
//   translate: {
//     name: "translateText",
//     description: "Translate text to another language using Google Translate",
//     parameters: {
//       type: "object",
//       properties: {
//         text: {
//           type: "string",
//           description: "The text to translate",
//         },
//         targetLanguage: {
//           type: "string",
//           description: "The target language code (e.g., es, fr, de)",
//         }
//       },
//       required: ["text", "targetLanguage"],
//     }
//   },
//   convert: {
//     name: "convertUnits",
//     description: "Convert between different units using convert-units",
//     parameters: {
//       type: "object",
//       properties: {
//         value: {
//           type: "number",
//           description: "The value to convert",
//         },
//         from: {
//           type: "string",
//           description: "The source unit",
//         },
//         to: {
//           type: "string",
//           description: "The target unit",
//         }
//       },
//       required: ["value", "from", "to"],
//     }
//   }
// };

// // Function implementations map
// const functionMap = {
//   calculate,
//   getWeatherInfo,
//   translateText,
//   convertUnits
// };

// async function routeQuery(query: string) {
//   const routingPrompt = `
//     Given the following user query, determine if any tools are needed to answer it.
//     If a calculation is needed, respond with 'TOOL: CALCULATE'.
//     If weather information is needed, respond with 'TOOL: WEATHER'.
//     If translation is needed, respond with 'TOOL: TRANSLATE'.
//     If unit conversion is needed, respond with 'TOOL: CONVERT'.
//     If no tools are needed, respond with 'NO TOOL'.

//     User query: ${query}

//     Response:
//   `;

//   const response = await client.chat.completions.create({
//     model: ROUTING_MODEL,
//     messages: [
//       {
//         role: 'system',
//         content: 'You are a routing assistant. Determine if tools are needed based on the user query.',
//       },
//       { role: 'user', content: routingPrompt },
//     ],
//     max_completion_tokens: 20,
//   });

//   const routingDecision = response.choices[0].message.content.trim().toUpperCase();
  
//   if (routingDecision.includes('TOOL: CALCULATE')) return 'calculate';
//   if (routingDecision.includes('TOOL: WEATHER')) return 'weather';
//   if (routingDecision.includes('TOOL: TRANSLATE')) return 'translate';
//   if (routingDecision.includes('TOOL: CONVERT')) return 'convert';
//   return 'none';
// }

// async function processWithTool(query: string, toolName: string) {
//   const messages = [
//     {
//       role: 'system',
//       content: `You are an AI assistant that can use the ${toolName} tool to help users.`,
//     },
//     {
//       role: 'user',
//       content: query,
//     },
//   ];

//   const response = await client.chat.completions.create({
//     model: TOOL_USE_MODEL,
//     messages: messages,
//     tools: [{ type: 'function', function: tools[toolName as keyof typeof tools] }],
//     tool_choice: 'auto',
//     max_completion_tokens: 4096,
//   });

//   const responseMessage = response.choices[0].message;
//   const toolCalls = responseMessage.tool_calls;

//   if (toolCalls) {
//     messages.push(responseMessage);

//     for (const toolCall of toolCalls) {
//       const functionName = toolCall.function.name;
//       const functionToCall = functionMap[functionName as keyof typeof functionMap];
//       const functionArgs = JSON.parse(toolCall.function.arguments);
//       const functionResponse = await functionToCall(...Object.values(functionArgs));

//       messages.push({
//         tool_call_id: toolCall.id,
//         role: 'tool',
//         name: functionName,
//         content: JSON.stringify(functionResponse),
//       });
//     }

//     const secondResponse = await client.chat.completions.create({
//       model: TOOL_USE_MODEL,
//       messages: messages,
//     });

//     return secondResponse.choices[0].message.content;
//   }

//   return responseMessage.content;
// }

// async function processGeneralQuery(query: string) {
//   const response = await client.chat.completions.create({
//     model: GENERAL_MODEL,
//     messages: [
//       { role: 'system', content: 'You are a helpful assistant.' },
//       { role: 'user', content: query },
//     ],
//   });
//   return response.choices[0].message.content;
// }

// export async function processQuery(query: string) {
//   try {
//     const route = await routeQuery(query);
//     let response;

//     if (route === 'none') {
//       response = await processGeneralQuery(query);
//     } else {
//       response = await processWithTool(query, route);
//     }

//     return {
//       query,
//       route,
//       response,
//       error: null
//     };
//   } catch (error) {
//     return {
//       query,
//       route: 'error',
//       response: null,
//       error: error instanceof Error ? error.message : 'An unknown error occurred'
//     };
//   }
// }

import { Groq } from 'groq-sdk';

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
    // Note: Using eval() is not safe for production. Consider using a proper math expression parser
    const result = eval(expression);
    return JSON.stringify({ result });
  } catch (error) {
    return JSON.stringify({ error: 'Invalid expression' });
  }
}

function getWeatherInfo(location: string) {
  // Mock weather data - in production, this would call a real weather API
  const temperatures = { "New York": 22, "London": 18, "Tokyo": 26, "Sydney": 20 };
  const conditions = { "New York": "Sunny", "London": "Rainy", "Tokyo": "Cloudy", "Sydney": "Clear" };
  
  const temp = temperatures[location as keyof typeof temperatures] || "N/A";
  const condition = conditions[location as keyof typeof conditions] || "N/A";
  
  return `${location}: Temperature: ${temp}°C, Condition: ${condition}`;
}

function translateText(text: string, targetLanguage: string) {
  // Mock translation data - in production, this would call a translation API
  const translations: Record<string, Record<string, string>> = {
    "Hello": {
      "es": "Hola",
      "fr": "Bonjour",
      "de": "Hallo"
    },
    "Goodbye": {
      "es": "Adiós",
      "fr": "Au revoir",
      "de": "Auf Wiedersehen"
    }
  };

  return translations[text]?.[targetLanguage] || "Translation not available";
}

function convertUnits(value: number, from: string, to: string) {
  const conversions: Record<string, Record<string, number>> = {
    "km": { "miles": 0.621371, "meters": 1000 },
    "kg": { "lbs": 2.20462, "g": 1000 },
    "celsius": { "fahrenheit": (c: number) => (c * 9/5) + 32 }
  };

  const conversion = conversions[from]?.[to];
  if (typeof conversion === 'function') {
    return conversion(value);
  }
  if (conversion) {
    return value * conversion;
  }
  return "Conversion not supported";
}

// Available tools configuration
const tools = {
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
  weather: {
    name: "getWeatherInfo",
    description: "Get weather information for a location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The name of the city",
        }
      },
      required: ["location"],
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
  },
  convert: {
    name: "convertUnits",
    description: "Convert between different units",
    parameters: {
      type: "object",
      properties: {
        value: {
          type: "number",
          description: "The value to convert",
        },
        from: {
          type: "string",
          description: "The source unit",
        },
        to: {
          type: "string",
          description: "The target unit",
        }
      },
      required: ["value", "from", "to"],
    }
  }
};

// Function implementations map
const functionMap = {
  calculate,
  getWeatherInfo,
  translateText,
  convertUnits
};

async function routeQuery(query: string) {
  const routingPrompt = `
    Given the following user query, determine if any tools are needed to answer it.
    If a calculation is needed, respond with 'TOOL: CALCULATE'.
    If weather information is needed, respond with 'TOOL: WEATHER'.
    If translation is needed, respond with 'TOOL: TRANSLATE'.
    If unit conversion is needed, respond with 'TOOL: CONVERT'.
    If no tools are needed, respond with 'NO TOOL'.

    User query: ${query}

    Response:
  `;

  const response = await client.chat.completions.create({
    model: ROUTING_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are a routing assistant. Determine if tools are needed based on the user query.',
      },
      { role: 'user', content: routingPrompt },
    ],
    max_completion_tokens: 20,
  });

  const routingDecision = response.choices[0].message.content.trim().toUpperCase();
  
  if (routingDecision.includes('TOOL: CALCULATE')) return 'calculate';
  if (routingDecision.includes('TOOL: WEATHER')) return 'weather';
  if (routingDecision.includes('TOOL: TRANSLATE')) return 'translate';
  if (routingDecision.includes('TOOL: CONVERT')) return 'convert';
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