import * as dotenv from 'dotenv'
dotenv.config()

import {GoogleGenerativeAI} from "@google/generative-ai"
console.log(process.env.GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const gemini = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
})

export const Summarize = async (diff: string) => {
    const prompt = [
        "You are an expert code reviewer and Git specialist. Analyze the following Git diff and provide a detailed yet concise summary.",
        "",
        "FORMAT YOUR RESPONSE IN THIS EXACT STRUCTURE:",
        "📋 SUMMARY",
        "One or two sentences describing the overall changes, starting with the most relevant emoji.",
        "",
        "🔍 KEY CHANGES",
        "Bullet points listing specific changes, each starting with an appropriate emoji and including file paths in [brackets].",
        "",
        "💡 TECHNICAL DETAILS (only if significant)",
        "- Impact on performance, security, or architecture",
        "- Breaking changes or dependency updates",
        "- Migration requirements",
        "",
        "CHANGE TYPE EMOJIS:",
        "🆕 New Feature/Addition",
        "🔄 Update/Modification",
        "🔨 Refactor",
        "🐛 Bug Fix",
        "🧪 Tests",
        "📝 Documentation",
        "🔧 Configuration",
        "🔒 Security",
        "⚡ Performance",
        "📦 Dependencies",
        "",
        "GUIDELINES:",
        "1. File Paths:",
        "   • Use [brackets] for all file paths",
        "   • For multiple related files, use [directory/*]",
        "   • Group related file changes together",
        "",
        "2. Content Focus:",
        "   • Be specific about function/method changes",
        "   • Highlight API or interface changes",
        "   • Note configuration or dependency updates",
        "   • Include test modifications",
        "",
        "3. Important Rules:",
        "   • Focus on WHAT changed, not WHY",
        "   • Be specific and factual",
        "   • Exclude unchanged code or context lines",
        "   • Don't speculate about intentions",
        "",
        "EXAMPLE FORMAT (do not use this content):",
        "```",
        "📋 SUMMARY",
        "🔒 Implemented JWT authentication system with comprehensive test coverage",
        "",
        "🔍 KEY CHANGES",
        "• 🆕 Added JWT authentication middleware [src/auth/middleware.ts]",
        "• 🔨 Updated user routes with auth integration [src/routes/*.ts]",
        "• 🧪 Added authentication test suite [tests/auth/*]",
        "",
        "💡 TECHNICAL DETAILS",
        "• Requires new JWT_SECRET environment variable",
        "• Breaking change: all API routes now require Authorization header",
        "```",
        "",
        "Git diff format reminders:",
        "• Lines starting with '+' are additions",
        "• Lines starting with '-' are deletions",
        "• Other lines are context (not changes)",
        "",
        `Please analyze and summarize this diff following the above format:\n\n${diff}`
    ].join("\n");
    const response = await gemini.generateContent(prompt);
    console.log(response.response.text())
    return response.response.text();
};

