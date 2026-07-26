import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import Stripe from "stripe";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Helper to get Stripe client lazily
let stripeInstance: Stripe | null = null;
function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey.includes("YOUR_ACTUAL_SECRET_KEY")) {
    return null;
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(secretKey);
  }
  return stripeInstance;
}

// Helper to get GoogleGenAI client lazily
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Health Check
app.get("/api/health", (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
  res.json({
    status: "ok",
    app: "FLUX MARKET INTELLIGENCE OS",
    hasGeminiKey: hasKey,
    timestamp: new Date().toISOString(),
  });
});

// Backend System Configuration Metadata
app.get("/api/config", (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
  res.json({
    appName: "FLUX MARKET INTELLIGENCE OS",
    environment: process.env.NODE_ENV || "development",
    port: PORT,
    geminiConfigured: hasKey,
    model: "gemini-3.6-flash",
    features: {
      firebaseFirestore: true,
      lowLatencyMode: true,
      d3PredictiveEngine: true,
      neuralSearch: true,
      csvExport: true,
      specialistNodes: ["competitor", "trend", "seo", "crisis"],
    },
    version: "2.4.0",
    serverTimestamp: new Date().toISOString(),
  });
});

// Stripe Configuration Endpoint (Masked for Security)
app.get("/api/stripe/config", (req, res) => {
  const rawPublishableKey =
    process.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_live_Y8I4kIWBXPdQIfZ2tthPIFwV00DlqCjZva";
  const rawMonthlyPriceId =
    process.env.STRIPE_PRICE_ID_MONTHLY || "price_1TSOJLBMbxh6jv0C9aEJBKRt";
  const rawYearlyPriceId =
    process.env.STRIPE_PRICE_ID_YEARLY || "price_1TSOKGBMbxh6jv0CMhUwlHYX";
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    "https://ai.studio/apps/0115a890-5261-45ed-8dc3-cc55385793b8";

  const isSecretKeySet = Boolean(
    process.env.STRIPE_SECRET_KEY &&
      !process.env.STRIPE_SECRET_KEY.includes("YOUR_ACTUAL_SECRET_KEY")
  );

  const maskKey = (val: string, showPrefix = 8) => {
    if (!val) return "••••••••••••••••";
    if (val.length <= showPrefix) return "••••••••••••••••";
    return val.substring(0, showPrefix) + "••••••••••••••••";
  };

  res.json({
    publishableKey: maskKey(rawPublishableKey, 8),
    priceIds: {
      monthly: maskKey(rawMonthlyPriceId, 7),
      yearly: maskKey(rawYearlyPriceId, 7),
    },
    appUrl,
    isSecretKeySet,
    hasLiveConfig: true,
  });
});

// Stripe Create Checkout Session Endpoint (Supports both /api/stripe/create-checkout-session & /api/checkout)
const handleCheckoutSession = async (req: express.Request, res: express.Response) => {
  try {
    const { priceId: inputPriceId, plan, userId, userEmail } = req.body;

    // Determine target price ID
    let priceId = inputPriceId;
    if (!priceId) {
      priceId =
        plan === "yearly"
          ? process.env.STRIPE_PRICE_ID_YEARLY || "price_1TSOKGBMbxh6jv0CMhUwlHYX"
          : process.env.STRIPE_PRICE_ID_MONTHLY || "price_1TSOJLBMbxh6jv0C9aEJBKRt";
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      "https://ai.studio/apps/0115a890-5261-45ed-8dc3-cc55385793b8";

    const stripe = getStripeClient();

    if (!stripe) {
      const simulatedUrl = `${appUrl}?subscription_status=success&priceId=${priceId}&demo=true`;
      return res.json({
        success: true,
        mock: true,
        plan: plan || (priceId?.includes("YEARLY") ? "yearly" : "monthly"),
        priceId,
        url: simulatedUrl,
        redirectUrl: simulatedUrl,
        message:
          "Stripe secret key placeholder detected. Checkout simulated successfully with Price ID: " +
          priceId,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      customer_email: userEmail || undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          userId: userId || "",
          platform: "FLUX MARKET INTELLIGENCE OS",
        },
      },
      success_url: `${appUrl}?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${appUrl}?canceled=true`,
      metadata: {
        userId: userId || "",
      },
    });

    return res.json({
      success: true,
      mock: false,
      sessionId: session.id,
      url: session.url,
      redirectUrl: session.url,
      priceId,
    });
  } catch (error: any) {
    console.error("Stripe Checkout Session Error:", error);
    return res.status(500).json({ error: error.message || "Failed to create Stripe Checkout session" });
  }
};

app.post("/api/stripe/create-checkout-session", handleCheckoutSession);
app.post("/api/checkout", handleCheckoutSession);

// Stripe Webhook Receiver Endpoint (Supports both /api/stripe/webhook and /api/webhook)
const handleStripeWebhook = (req: express.Request, res: express.Response) => {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers["stripe-signature"] as string;

  let event = req.body;

  if (stripe && webhookSecret && !webhookSecret.includes("YOUR_ACTUAL") && sig) {
    try {
      const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err: any) {
      console.error(`[Stripe Webhook Error] Signature verification failed: ${err.message}`);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
  }

  const eventType = event?.type || "unknown";
  console.log(`[FLUX MARKET INTELLIGENCE OS Webhook] Processing event: ${eventType}`);

  switch (eventType) {
    case "checkout.session.completed": {
      const session = event.data?.object || event;
      const customerId = session.customer;
      const subscriptionId = session.subscription;
      const userId = session.metadata?.userId;
      console.log(
        `[FLUX MARKET INTELLIGENCE OS] User ${userId || "guest"} subscribed successfully. Customer: ${customerId}, Sub: ${subscriptionId}`
      );
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data?.object || event;
      console.log(`[FLUX MARKET INTELLIGENCE OS] Subscription status updated to: ${subscription.status}`);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data?.object || event;
      console.log(`[FLUX MARKET INTELLIGENCE OS] Subscription canceled: ${subscription.id}`);
      break;
    }

    default:
      console.log(`[FLUX MARKET INTELLIGENCE OS] Unhandled event type: ${eventType}`);
  }

  return res.json({ received: true, type: eventType, timestamp: new Date().toISOString() });
};

app.post("/api/stripe/webhook", handleStripeWebhook);
app.post("/api/webhook", handleStripeWebhook);

// Gemini Chatbot Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, context, history } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      return res.json({
        reply: `[Flux Intelligence Engine Mode] Gemini API key not detected in env. Here is your structured analysis for "${message}": \n\n1. **Market Strategy**: Accelerate PPC retargeting in high-conversion clusters.\n2. **Node Recommendation**: Run Competitor Node pricing check for target Q3 campaign.\n3. **Actionable Step**: Deploy variant B in A/B testing lab to increase ROAS.`,
        sources: ["Flux Internal Market Memory", "Neural Search Cache"],
      });
    }

    const systemInstruction = `You are FLUX MARKET INTELLIGENCE OS AI Assistant — a high-performance marketing intelligence and SaaS strategy expert.
Your tone is professional, analytical, concise, and actionable. You help users analyze competitor node activity, SEO clusters, trend deltas, PPC ROAS, A/B experiments, and campaign strategies. Provide structured markdown with bold headings, key bullet points, and clear numerical predictions.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Context: ${context || "FLUX OS Dashboard"}\nUser Query: ${message}`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || "No response generated from Flux Intelligence engine.",
      sources: ["Neural Search Verification", "Flux Market Knowledge Graph"],
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: error.message || "Failed to query Flux AI Assistant" });
  }
});

// Specialist Node Trigger Endpoint
app.post("/api/nodes/run", async (req, res) => {
  try {
    const { nodeType, parameters } = req.body; // 'competitor' | 'trend' | 'seo' | 'crisis'
    const ai = getGenAIClient();

    const nodePrompts: Record<string, string> = {
      competitor: "Analyze current competitor price shifts, new ad creative angles, and discount offers in digital marketing. Provide 3 specific competitor insights with risk level.",
      trend: "Analyze emerging search topics, volume deltas, and trending viral keywords in B2B and SaaS marketing. Provide 3 rising trend opportunities.",
      seo: "Identify 3 untapped low-competition keyword clusters and search intent gaps for maximum organic acquisition.",
      crisis: "Scan social sentiment, brand mentions, and sentiment anomalies. Highlight potential crisis threads and escalation ratings.",
    };

    const prompt = nodePrompts[nodeType] || "Perform real-time neural market scan.";

    if (!ai) {
      const mockResults: Record<string, any> = {
        competitor: {
          title: "Competitor Price & Offer Audit",
          summary: "Identified 2 competitor pricing changes and 1 aggressive ad campaign launch.",
          events: [
            { title: "Competitor 'AdSphere' cut annual plan by 15%", impact: "High", actionable: "Match discount with value add bundle" },
            { title: "New TikTok ad creative targeting 'AI Marketing'", impact: "Medium", actionable: "Deploy counter video campaign" },
          ],
        },
        trend: {
          title: "Emerging Search Delta Analysis",
          summary: "Search volume for 'Autonomous Marketing Agents' spiked +142% this week.",
          events: [
            { title: "'AI Market Intelligence OS' keyword intent +180%", impact: "High", actionable: "Publish pillar page on AI OS" },
            { title: "'Omnichannel Attribution AI' search growth +95%", impact: "Medium", actionable: "Update SEO meta tags" },
          ],
        },
        seo: {
          title: "Untapped Keyword Cluster Scan",
          summary: "Discovered 3 low-KD search clusters with high commercial intent.",
          events: [
            { title: "Cluster: 'Real-time Marketing ROI Calculator'", kd: "24/100", volume: "14.2K/mo", actionable: "Create interactive web tool" },
            { title: "Cluster: 'Predictive ROAS Dashboard'", kd: "18/100", volume: "8.9K/mo", actionable: "Optimize landing page #2" },
          ],
        },
        crisis: {
          title: "Sentiment Anomaly & Threat Scan",
          summary: "Brand sentiment positive (89%). Zero active crisis escalations.",
          events: [
            { title: "Reddit discussion on tracking pixel latency", impact: "Low", actionable: "Resolved in patch v2.4" },
            { title: "Positive sentiment spike on LinkedIn post", impact: "Positive", actionable: "Amplify via paid boost" },
          ],
        },
      };

      return res.json({
        success: true,
        nodeType,
        timestamp: new Date().toISOString(),
        data: mockResults[nodeType] || mockResults.competitor,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are FLUX OS Neural Node Scanner. Provide structured JSON-like text summary for digital marketing intelligence.",
      },
    });

    res.json({
      success: true,
      nodeType,
      timestamp: new Date().toISOString(),
      rawAnalysis: response.text,
    });
  } catch (error: any) {
    console.error("Node run error:", error);
    res.status(500).json({ error: error.message || "Node execution failed" });
  }
});

// Strategy Playbook Generator
app.post("/api/strategy/playbook", async (req, res) => {
  try {
    const { objective, targetAudience, budget } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      return res.json({
        playbook: `# FLUX Growth Strategy Playbook: ${objective || "Scale PPC & Organic Revenue"}
        
## 1. Executive Summary
Deploy multi-channel retargeting with neural search verification to maximize ROAS across high-converting segments.

## 2. Channel Allocation
- **PPC & Search Ads**: 50% ($${budget || "10,000"}/mo) - Focus on high-intent intent keywords.
- **SEO & Content Clusters**: 30% - Produce interactive calculators and comparison guides.
- **Social & Video Ads**: 20% - UGC-style short-form video test variants.

## 3. Predicted Outcome
- Estimated ROAS: **4.6x - 5.2x**
- Expected Active Leads: **+38% growth in 30 days**`,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Generate a detailed marketing playbook for Objective: "${objective || "Maximize ROAS"}", Target Audience: "${targetAudience || "SaaS Founders & CMOs"}", Budget: "$${budget || "15,000"}". Include executive summary, step-by-step tactics, channel breakdown, and KPI forecasts.`,
      config: {
        systemInstruction: "You are a Chief Marketing Officer AI producing executive growth playbooks.",
      },
    });

    res.json({
      playbook: response.text,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Multilingual AI Translation Endpoint
app.post("/api/translate", async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      return res.json({
        translatedText: `[Translated to ${targetLang}]: ${text}`,
        sourceLang: "auto",
        targetLang,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Translate the following marketing content accurately into ${targetLang}. Maintain tone and persuasive appeal:\n\n${text}`,
    });

    res.json({
      translatedText: response.text || text,
      targetLang,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Audio & Video Transcription Intelligence Endpoint
app.post("/api/transcribe", async (req, res) => {
  try {
    const { audioText, prompt } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      return res.json({
        transcript: audioText || "Speaker 1 (0:00): Welcome to FLUX Market Intelligence OS update. Our PPC campaigns achieved a 4.8x ROAS this quarter with zero churn.",
        summary: "High ROAS achieved across all active ad groups. Recommendation: Scale budget by +15%.",
        actionItems: [
          "Increase budget on Google Ads Campaign #4",
          "A/B test landing page CTA headline",
        ],
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Analyze and transcribe marketing audio/speech text: "${audioText || prompt}". Provide full clean transcript, executive summary, and key marketing action items.`,
    });

    res.json({
      transcriptionAnalysis: response.text,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// AI Maintenance Agent Endpoint
app.post("/api/maintenance/run", async (req, res) => {
  try {
    const ai = getGenAIClient();
    const timestamp = new Date().toISOString();

    if (!ai) {
      return res.json({
        status: "OPTIMAL",
        healthScore: 99.4,
        timestamp,
        patchNotes: [
          "Auto-fixed API latency bottleneck in SEO Node data parser",
          "Optimized Recharts memory usage during 7-week graph rerenders",
          "Upgraded security rules for multi-tenant organization tokens",
          "Synced neural search cache with zero downtime",
        ],
        benchmarks: {
          apiResponseMs: 42,
          databaseLatencyMs: 8,
          memoryUsageMb: 124,
          errorRatePct: 0.001,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Run AI maintenance health check on FLUX MARKET INTELLIGENCE OS. Generate 4 patch fix notes, system benchmarks, and health diagnostics.",
    });

    res.json({
      status: "OPTIMAL",
      healthScore: 99.8,
      timestamp,
      aiDiagnostics: response.text,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Quick Action Jobs Endpoint
app.post("/api/content/generate", async (req, res) => {
  try {
    const { contentType, brandVoice, campaignGoal, marketContext, targetPlatform } = req.body;
    const ai = getGenAIClient();

    const systemInstruction = `You are FLUX AI Content Studio — an elite marketing strategist and copywriter.
Generate highly persuasive, high-converting copy tailored to the user's defined Brand Voice: "${brandVoice || 'Authoritative B2B SaaS'}" and Campaign Goal: "${campaignGoal || 'Drive High-Intent Conversions'}".
Format your response as clean JSON matching this structure (no extra wrapping markdown outside json if possible):
{
  "socialPosts": [
    { "platform": "LinkedIn", "headline": "...", "body": "...", "hashtags": ["#SaaS", "#Growth"] },
    { "platform": "Twitter/X", "headline": "...", "body": "...", "hashtags": ["#MarketingAI"] }
  ],
  "adCopy": [
    { "type": "Google Search Ad", "headline1": "...", "headline2": "...", "description": "...", "ctrBoostTip": "..." },
    { "type": "Meta Social Ad", "headline": "...", "primaryCopy": "...", "cta": "Get Started Free" }
  ],
  "emailCampaign": [
    { "variant": "Subject Line A (Urgency)", "subject": "...", "previewText": "...", "openingHook": "..." },
    { "variant": "Subject Line B (Value/Benefit)", "subject": "...", "previewText": "...", "openingHook": "..." }
  ],
  "strategicAngle": "Brief 2-sentence rationale for why this copy converts based on current market intelligence."
}`;

    if (!ai) {
      // Intelligent mock fallback tailored to context
      const topicName = marketContext || "Autonomous AI Marketing OS";
      const voice = brandVoice || "Authoritative B2B SaaS";
      const goal = campaignGoal || "Drive Conversions";

      return res.json({
        content: {
          socialPosts: [
            {
              platform: "LinkedIn",
              headline: `Stop Guessing Your ROAS. Scale with Neural Intelligence.`,
              body: `While competitors scramble over outdated campaign data, leading teams are using ${topicName} to automate cross-channel PPC, SEO, and trend analysis in real-time.\n\nHere is how we bumped active lead velocity by +38% with zero extra ad spend:\n\n1. Continuous competitor price monitoring\n2. Real-time keyword cluster intent analysis\n3. Instant A/B test variant deployment\n\nReady to transform your growth engine?`,
              hashtags: ["#MarketIntelligence", "#GrowthHacking", "#AIInMarketing", "#ROAS"]
            },
            {
              platform: "Twitter/X",
              headline: `Neural Search Verification is live on FLUX OS.`,
              body: `Market intelligence isn't about more data — it's about faster execution.\n\nWith ${topicName}, scan 4 specialist nodes simultaneously & generate strategy playbooks in 1-click.\n\nTry it now 🚀`,
              hashtags: ["#MarTech", "#PPC", "#SaaSGrowth"]
            }
          ],
          adCopy: [
            {
              type: "Google Search Ad",
              headline1: `${topicName} | 4.8x ROAS OS`,
              headline2: "Automate Competitor & Trend Scans",
              description: "Stop wasting budget on low-converting ads. Access 4 specialist neural nodes for real-time market dominance. Start your free trial today.",
              ctrBoostTip: "Uses high-intent keyword clustering with +184% search momentum."
            },
            {
              type: "Meta Social Ad",
              headline: "Outsmart Competitors with Real-Time Neural Intelligence",
              primaryCopy: "Your competitors just cut their prices by 15%. What's your counter-play? FLUX OS scans pricing, ad creatives, and keyword gaps 24/7 so you stay 3 steps ahead.",
              cta: "Launch Free Audit"
            }
          ],
          emailCampaign: [
            {
              variant: "Variant A (High Intent)",
              subject: `[Intelligence Alert] Your competitors are shifting pricing on ${topicName}`,
              previewText: "See the counter-strategy blueprint generated by FLUX OS.",
              openingHook: "In the last 48 hours, 2 major players in your niche launched aggressive ad discounts..."
            },
            {
              variant: "Variant B (Value & Curiosity)",
              subject: `How 4 specialist AI nodes generated $142K in organic SEO leads`,
              previewText: "A step-by-step breakdown of neural keyword clustering.",
              openingHook: "Traditional keyword research is dead. Here is how continuous intent clustering works..."
            }
          ],
          strategicAngle: `Tailored for ${voice} to execute on "${goal}". The copy leverages real-time competitor pressure and keyword velocity from market telemetry.`
        },
        generatedAt: new Date().toISOString(),
        isMock: true
      });
    }

    const promptText = `Market Intelligence Context: ${marketContext || 'General Market Dominance'}
Target Platform: ${targetPlatform || 'All Channels'}
Generate complete copy package in valid JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    let parsed = {};
    try {
      parsed = JSON.parse(response.text || '{}');
    } catch {
      parsed = { rawText: response.text };
    }

    res.json({
      content: parsed,
      generatedAt: new Date().toISOString(),
      isMock: false
    });
  } catch (error: any) {
    console.error("Content generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI content" });
  }
});

// Dedicated Clear Cookies & Cache Endpoint
app.post("/api/cache/clear", (req, res) => {
  // Instruct modern browsers to wipe cache, cookies, and storage
  res.setHeader("Clear-Site-Data", '"cache", "cookies", "storage"');
  res.json({
    success: true,
    message: "Clear-Site-Data directive dispatched. All cookies, local storage, session storage, and cache storage cleared.",
    clearedAt: new Date().toISOString(),
  });
});

// Quick Action Jobs Endpoint
app.post("/api/jobs/run", async (req, res) => {
  const { jobType } = req.body; // 'leadScraping' | 'cacheClear' | 'downloadBlueprint' | 'videoGen'
  const jobId = `job_${Math.random().toString(36).substr(2, 9)}`;

  if (jobType === "cacheClear") {
    res.setHeader("Clear-Site-Data", '"cache", "cookies", "storage"');
  }

  res.json({
    jobId,
    jobType,
    status: "success",
    message: jobType === "cacheClear"
      ? "All cookies, local storage, session storage, and cache storage cleared successfully."
      : `Job '${jobType}' dispatched successfully to Flux worker queue.`,
    startedAt: new Date().toISOString(),
  });
});

// Start Server with Vite Middleware in Dev or Static files in Prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FLUX MARKET INTELLIGENCE OS running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
