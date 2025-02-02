const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stringSimilarity = require('string-similarity');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Q&A data with answers and keywords
const qaData = [
  {
    question: ["Hello", "Hi", "Hey", "Greetings", "Good morning", "Good afternoon", "Good evening"],
    answer: "Hi there! I'm the M.A.P. Tech Chatbot. How can I assist you today?",
    keywords: ["hello", "hi", "hey", "greetings"]
  },
  {
    question: [
      "What does M.A.P. Tech do?", 
      "What services does M.A.P. Tech offer?", 
      "What are the services provided by M.A.P. Tech?", 
      "Can you tell me what M.A.P. Tech does?"
    ],
    answer: "M.A.P. Tech specializes in a variety of IT solutions including AI ChatBot Development, System/Software Development, Mobile App Development, Website Development, UI/UX Design, and Graphics Design.",
    keywords: ["services","service", "what does", "offer", "do", "specializes in"]
  },
  {
    question: [
      "When was M.A.P. Tech founded?", 
      "What year was M.A.P. Tech established?", 
      "When did M.A.P. Tech start?", 
      "What is the founding year of M.A.P. Tech?", 
      "How long has M.A.P. Tech been in business?"
    ],
    answer: "M.A.P. Tech was founded in 2024, marking the beginning of our journey to provide innovative IT solutions.",
    keywords: ["founded", "established", "start", "year", "when"]
  },
  {
    question: [
      "What is your mission?", 
      "What is the mission of M.A.P. Tech?", 
      "Can you tell me your mission?", 
      "What does M.A.P. Tech aim to achieve?", 
      "What is the purpose of M.A.P. Tech?"
    ],
    answer: "Our mission is to deliver exceptional IT solutions tailored to our clients' unique needs while building lasting partnerships through trust and excellence.",
    keywords: ["mission", "purpose", "aim", "objectives"]
  },
  {
    question: [
      "What is your vision?", 
      "What is the vision of M.A.P. Tech?", 
      "Can you tell me your vision?", 
      "What does M.A.P. Tech envision for the future?", 
      "What is M.A.P. Tech's long-term vision?"
    ],
    answer: "Our vision is to drive digital transformation and brand success by empowering businesses to thrive in today's competitive market through innovative technology solutions.",
    keywords: ["vision", "future", "long-term", "goals"]
  },
  {
    question: [
      "Do you develop AI chatbots?", 
      "Does M.A.P. Tech create AI chatbots?", 
      "Can you build AI chatbots?", 
      "Do you offer AI chatbot development?"
    ],
    answer: "Absolutely! We specialize in developing AI ChatBots designed to enhance user interaction and streamline customer service processes for various industries.",
    keywords: ["AI chatbots", "develop", "build", "create"]
  },
  {
    question: [
      "How can I contact M.A.P. Tech?", 
      "What is the contact information for M.A.P. Tech?", 
      "How do I get in touch with M.A.P. Tech?"
    ],
    answer: "You can reach us at +977 9745673009 or email us at info@maptechnepal.com for any inquiries or support.",
    keywords: ["contact", "reach", "get in touch", "how to contact"]
  },
  {
    question: [
      "What are your working hours?", 
      "When are your office hours?", 
      "What time do you operate?", 
      "What are the business hours?"
    ],
    answer: "Our working hours are from 9 AM to 6 PM, Sunday to Friday, ensuring we are available to assist you during business days.",
    keywords: ["working hours", "office hours", "business hours", "operating hours"]
  },
  {
    question: [
      "What technologies does M.A.P. Tech specialize in?", 
      "What tech stack does M.A.P. Tech use?", 
      "What technologies is M.A.P. Tech skilled in?"
    ],
    answer: "M.A.P. Tech utilizes a diverse tech stack that includes Web Development frameworks, System Development tools, Database Management systems, and cutting-edge UI/UX Design methodologies.",
    keywords: ["technologies", "specialize", "tech stack", "tools"]
  },
  {
    question: [
      "Can you provide examples of M.A.P. Tech's recent projects?", 
      "What are some recent projects by M.A.P. Tech?", 
      "Can you share some of M.A.P. Tech's recent work?"
    ],
    answer: "Recently, we have completed projects such as a comprehensive Hotel Management System, an intuitive E-commerce Application, and a user-friendly Food Ordering Application.",
    keywords: ["recent projects", "examples", "work", "projects"]
  },
  {
    question: [
      "Do you provide training for your software solutions?",
      "Can I get training on using your applications?",
      "Is there training available for your products?"
    ],
    answer: "Yes, we offer comprehensive training sessions for all our software solutions to ensure that our clients can utilize them effectively and maximize their benefits.",
    keywords: ["training", "software solutions", "applications"]
  },
  {
    question: [
      "What industries do you serve?",
      "Which sectors does M.A.P. Tech work with?",
      "Who are your typical clients?"
    ],
    answer: `We serve a variety of industries including healthcare, education, e-commerce, hospitality, and finance, providing tailored IT solutions that meet specific sector needs.`,
    keywords: ["industries served", 'sectors', 'clients', 'typical clients']
  },
  {
    question: [
      "What is the process of software development?",
      "How does M.A.P. Tech develop software?",
      "What steps are involved in creating software at M.A.P. Tech?"
    ],
    answer: "At M.A.P. Tech Pvt. Ltd., we follow a meticulous process to deliver innovative software solutions. 1. Planning: We define clear objectives and align project goals with your vision through a strategic roadmap. 2. Research: Analyzing your business, target audience, and market trends provides a foundation for impactful solutions. 3. Design: Intuitive and visually appealing designs are created through wireframes, prototypes, and feedback loops. 4. Development: Our team builds robust, scalable, and secure systems using the latest frameworks and technologies. 5. Testing: Comprehensive testing ensures performance and quality standards are met. 6. Deployment: A smooth launch is ensured with precision and ongoing support post-deployment. This structured approach ensures every project aligns with client needs and delivers exceptional value.",
    keywords: ["software development process", "steps in software creation", "how M.A.P. Tech works", "software lifecycle"]
  }
];

// Chatbot endpoint for message processing
app.post('/api/chat', (req, res) => {
  if (!req.body.message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const { message } = req.body;

  // Preprocess message: convert to lowercase and remove unwanted characters
  const cleanMessage = message.toLowerCase().replace(/[^a-z0-9\s]/gi, '');

  // Find the most similar question using string similarity
  let highestScore = 0;
  let bestMatch = null;

  qaData.forEach((qa) => {
    qa.question.forEach((q) => {
      const score = stringSimilarity.compareTwoStrings(cleanMessage, q.toLowerCase());
      if (score > highestScore) {
        highestScore = score;
        bestMatch = qa;
      }
    });
  });

  // Check for keywords regardless of similarity score
  const messageKeywords = cleanMessage.split(' ');
  
  let foundAnswer = false;
  
  qaData.forEach((qa) => {
    const matchedKeywords = qa.keywords.filter(keyword => messageKeywords.includes(keyword));
    
    if (matchedKeywords.length > 0) {
      res.json({ reply: qa.answer });
      foundAnswer = true;
      return; // Exit loop early since we found a match
    }
  });

  // If similarity score is above a threshold, return the best match answer
  if (highestScore > 0.6 && bestMatch) {
    return res.json({ reply: bestMatch.answer });
  }

  // If no match is found, return a default response
  if (!foundAnswer) {
    res.json({ reply: 'I\'m sorry, I couldn\'t find an answer to your question. Please try again.' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
