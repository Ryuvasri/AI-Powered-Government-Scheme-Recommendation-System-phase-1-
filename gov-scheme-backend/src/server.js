const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Load environment variables (make sure to create a .env file)
require('dotenv').config();

// Initialize Google GenAI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "your-api-key-here");
console.log("Using API key:", process.env.GEMINI_API_KEY ? "***loaded***" : "MISSING!");

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'running', 
    message: 'Government Schemes Recommendation API' 
  });
});

// Main endpoint for generating content
app.post('/generate-content', async (req, res) => {
  try {
    // Validate request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        error: "Request body is empty or missing" 
      });
    }

    const userResponses = req.body;
    console.log("Received user input:", userResponses);

    // Create the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content
    const prompt = `You are an AI expert on Indian government schemes and educational scholarships.
Based on the following user details, recommend the most relevant and beneficial schemes available:
${JSON.stringify(userResponses, null, 2)}

IMPORTANT FORMATTING INSTRUCTIONS:
Use ONLY markdown formatting with DOUBLE LINE BREAKS between elements to ensure proper spacing.

For each scheme, use this exact format:

# 🎓 [Scheme Name]

**🔎 Description:**  
[A brief summary of the scheme – 1-2 sentences]

**✅ Eligibility:**
- [Eligibility criteria 1]
- [Eligibility criteria 2]
- [etc.]

**🎁 Benefits:**
- [Benefit 1]
- [Benefit 2]
- [etc.]

**🌐 Official Link:**  
[ALWAYS include a functioning official URL for each scheme. Do not provide explanations about missing links. If the exact direct URL is not available, provide the URL to the parent ministry/department website that hosts the scheme information (e.g., https://scholarships.gov.in/, https://www.education.gov.in/scholarships, https://tribal.nic.in/scholarships, https://socialjustice.gov.in/schemes, etc.). NEVER say "Unfortunately" or explain that a link is not available.]

---

After listing all schemes, add:

# Additional Information

**Important Notes:**
- [Note about verifying details]
- [Note about documentation needed]

**Application Deadlines:**
- [Information about deadlines if available]

**Useful Resources:**
- [MUST include at least 3 functioning, official government websites that contain information about scholarships, such as:
  1. National Scholarship Portal (https://scholarships.gov.in/)
  2. Ministry of Education (https://www.education.gov.in/)
  3. MyScheme Portal (https://myscheme.gov.in/)
  4. Ministry of Social Justice (https://socialjustice.gov.in/)]
- [MUST include description and complete URL for each]

REMEMBER: Always use TWO line breaks between sections to ensure proper spacing.
2. ALWAYS provide working URLs - no explanations about missing links.
3. For every scheme, include at least one working URL to a relevant government website.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log("Successfully generated response");
    res.status(200).json({ result: responseText });

  } catch (error) {
    console.error("Error in /generate-content:", error);
    
    // Enhanced error diagnostics
    if (!process.env.GEMINI_API_KEY) {
      console.error("Environment Error: GEMINI_API_KEY is not set");
    }
  
    if (error.message && error.message.includes("API key")) {
      res.status(401).json({ 
        error: "Authentication failed. Please check the API key.",
        details: process.env.GEMINI_API_KEY 
          ? "API key is set but might be invalid"
          : "API key is not set in environment variables"
      });
    } else {
      res.status(500).json({ 
        error: "Failed to process your request",
        details: error.message || "Unknown error" 
      });
    }
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    error: "Endpoint not found. Please check the URL and try again." 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`/generate-content endpoint ready for POST requests`);
});