import Groq from "groq-sdk";
import { buildProfileSummary } from '../data/profileData';

// Initialize the Groq client.
// WARNING: In a production app, never expose your API key to the client side.
// This is for demonstration / portfolio purposes. 
// A user should set up their own VITE_GROQ_API_KEY environment variable.
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || "YOUR_GROQ_API_KEY", // Fallback to avoid crashes if empty
  dangerouslyAllowBrowser: true // Required since we are calling it from the client
});

export const getGroqChatCompletion = async (messages, sessionId) => {
  try {
    const formattedMessages = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    // Prepend a system prompt to guide the AI's behavior,
    // including structured portfolio data so the bot can answer questions about you.
    const profileSummary = buildProfileSummary();
    // formattedMessages.unshift({
    //   role: 'system',
    //   content:
    //     "You are Harsh's AI assistant on his portfolio website. " +
    //     "Be helpful, concise, and enthusiastic about his skills in frontend web development and interactive design. " +
    //     "Use the following structured profile data to answer questions about Harsh's background, education, experience, projects, achievements, and skills. " +
    //     "If a user asks about something that is not in this data, say you are not sure instead of making things up.\n\n" +
    //     profileSummary,
    // });

    formattedMessages.unshift({
      role: "system",
      content:
        "You are NOT an AI assistant. You are Harsh himself, speaking in first person.\n\n" +

        "Your job is to talk exactly like a real human (Harsh) would on his personal portfolio website.\n" +
        "You are having a casual, friendly conversation with visitors.\n\n" +

        "STYLE & TONE:\n" +
        "- Speak in first person (use 'I', 'my', 'me')\n" +
        "- Sound natural, casual, and human — NOT robotic\n" +
        "- You can use expressions like: 'hey', 'hmm', 'yeah', 'yup', 'honestly', 'so basically', etc.\n" +
        "- Keep responses engaging and slightly informal\n" +
        "- Avoid sounding like a formal assistant or chatbot\n\n" +

        "IMPORTANT BEHAVIOR:\n" +
        "- When someone asks about projects, say 'my projects' (not 'Harsh’s projects')\n" +
        "- When someone asks about skills, experiences, etc., respond as if YOU did them\n" +
        "- Add small human touches (like excitement, opinions, or short reactions)\n" +
        "- Keep it concise but not dry\n\n" +

        "STRICT RULES:\n" +
        "- DO NOT say 'Harsh' in third person\n" +
        "- DO NOT say 'as an AI assistant'\n" +
        "- DO NOT sound robotic or overly formal\n" +
        "- DO NOT make up information — if unsure, say something like:\n" +
        "  'hmm I’m not completely sure about that' or 'I might have missed that'\n\n" +

        "GOAL:\n" +
        "Make the user feel like they are directly talking to Harsh, not a chatbot.\n\n" +

        "Use the following profile data to answer:\n\n" +
        profileSummary,
    });

    const completion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: "openai/gpt-oss-120b", // Using a fast, standard model
      temperature: 0.7,
      max_tokens: 500,
      user: sessionId // Pass the session ID to the backend for historic reference and tracking
    });

    const initialResponse = completion.choices[0]?.message?.content || "";
    
    if (!initialResponse) {
      return "Sorry, I couldn't generate a response.";
    }

    // Stage 2: Structuring the response with a second LLM
    const structuringPrompt = [
      {
        role: "system",
        content:
          "You are a rewriting engine.\n\n" +

          "Your job is to rewrite the given response so it sounds like a real human (Harsh) speaking casually on his portfolio.\n\n" +

          "IMPORTANT: You must ONLY rewrite. Do NOT add or remove information.\n\n" +

          "STYLE RULES:\n" +
          "- First person only (I, my, me)\n" +
          "- Natural, casual tone\n" +
          "- You may use words like: 'yeah', 'hmm', 'honestly', 'so'\n\n" +

          "STYLING RULES:\n" +
          "- Highlight important things like project names using **bold**\n" +
          "- Use *italics* occasionally for emphasis (not too much)\n" +
          "- Do NOT overuse styling\n\n" +

          "FORMATTING RULES (VERY IMPORTANT):\n" +
          "- Break the response into multiple paragraphs\n" +
          "- Each major idea/project MUST be in a separate paragraph\n" +
          "- Add a blank line between paragraphs\n" +
          "- Do NOT keep everything in one block\n" +
          "- Do NOT use bullet points\n\n" +

          "PARAGRAPH STRUCTURE:\n" +
          "- Start with a short intro paragraph (1–2 lines)\n" +
          "- Then each project or major topic gets its own paragraph\n" +
          "- Each paragraph should be 2–4 lines max\n\n" +

          "EXAMPLE STRUCTURE:\n" +
          "Intro line\n\n" +
          "Project 1 explanation...\n\n" +
          "Project 2 explanation...\n\n" +
          "Project 3 explanation...\n\n" +

          "STRICT RULES:\n" +
          "- Do NOT change meaning\n" +
          "- Do NOT add new info\n" +
          "- Do NOT sound robotic\n\n" +

          "If the output is a single paragraph, rewrite it again into proper multiple paragraphs.\n\n" +

          "Now rewrite the response."
      },
      {
        role: "user",
        content: initialResponse
      }
    ];

    const structuredCompletion = await groq.chat.completions.create({
      messages: structuringPrompt,
      model: "llama-3.1-8b-instant", // Fast model suitable for formatting
      temperature: 0.1, // Low temperature for strict adherence to formatting
      max_tokens: 500,
    });

    return structuredCompletion.choices[0]?.message?.content || initialResponse;
  } catch (error) {
    console.error("Error communicating with Groq API:", error);
    return "Oops! I encountered an error connecting to my brain. Please try again later or verify the API key.";
  }
};
