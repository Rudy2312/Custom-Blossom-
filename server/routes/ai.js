const express = require('express');
const router = express.Router();
// const { Configuration, OpenAIApi } = require('openai'); // Uncomment if using OpenAI package

// @route   POST api/ai/chat
// @desc    Process chatbot message
router.post('/chat', async (req, res) => {
  const { message } = req.body;
  
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    // Graceful fallback if no API key is provided
    if (!apiKey) {
      console.log("No AI API key found. Simulating AI Chat response.");
      
      const lowerMsg = message.toLowerCase();
      let responseMsg = "I'm the Blossom AI Assistant! How can I help you design your perfect case today? (Demo Mode)";
      
      if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
          responseMsg = "Our standard cases start at ₹249, Pro cases at ₹399, and Elite cases at ₹599. (Demo Mode)";
      } else if (lowerMsg.includes('shipping') || lowerMsg.includes('delivery')) {
          responseMsg = "We offer free standard shipping (5-7 days) and express shipping (2-3 days) for a small fee. (Demo Mode)";
      } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
          responseMsg = "Hello there! Let's craft something beautiful. What's on your mind? (Demo Mode)";
      }
      
      // Simulate network delay
      await new Promise(r => setTimeout(r, 1000));
      return res.json({ reply: responseMsg });
    }

    // --- REAL API LOGIC HERE ---
    /*
    const configuration = new Configuration({ apiKey });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
    });
    return res.json({ reply: response.data.choices[0].message.content });
    */

    return res.json({ reply: "Real API Integration is set up but commented out until dependencies are added." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ai/generate
// @desc    Generate image via AI Studio
router.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    const apiKey = process.env.OPENAI_API_KEY; // Or whatever service you use
    
    // Graceful fallback
    if (!apiKey) {
      console.log("No AI API key found. Simulating image generation.");
      await new Promise(r => setTimeout(r, 2000)); // Simulate processing time
      return res.json({ imageUrl: "https://images.unsplash.com/photo-1506744626753-1fa44df31c7f?q=80&w=600&auto=format&fit=crop" });
    }

    // --- REAL API LOGIC HERE ---
    /*
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
    });
    return res.json({ imageUrl: response.data.data[0].url });
    */

    return res.json({ imageUrl: "https://example.com/real-generated-image.png" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
