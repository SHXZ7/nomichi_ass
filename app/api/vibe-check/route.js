import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const { name, expectations, tripName } = await req.json();

    if (!expectations || !expectations.trim()) {
      return Response.json({
        fit: true,
        matchPercentage: 70,
        reason: "No expectations provided yet to analyze. Standard onboarding recommended.",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are an expert travel coordinator at Nomichi, a premium slow travel community.
Analyze the traveller's written expectations and decide if they fit our slow, offbeat, small-group travel style.
Nomichi style is: slow days, deep local connection, small groups, monastery mornings, walking the route twice, patience.
Non-fit style is: rushed tourist itineraries, ticking boxes, luxury shopping hubs, loud party cruises, expecting rigid 5-star hotel luxury.

Respond ONLY with a valid JSON object in this format (no other text, no markdown wrappers):
{
  "fit": true/false,
  "matchPercentage": number (0 to 100),
  "reason": "a warm, human, one-line sentence explaining the decision in lower-case or standard sentence case, starting with the traveller's name"
}
`,
        },
        {
          role: "user",
          content: `
Traveller: ${name}
Trip: ${tripName}
Expectations: "${expectations}"
`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const data = JSON.parse(completion.choices[0].message.content);
    return Response.json(data);
  } catch (error) {
    console.error("Vibe check error:", error);
    return Response.json(
      {
        fit: true,
        matchPercentage: 50,
        reason: "Could not evaluate vibe due to an internal connector failure.",
      },
      { status: 500 }
    );
  }
}
