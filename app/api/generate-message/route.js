import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",
            content: `
You write warm first-contact WhatsApp messages for Nomichi.

Style:
- Warm
- Human
- Short
- Friendly
- No emojis
- No exclamation marks
- No salesy language
- Sound personal
`,
          },
          {
            role: "user",
            content: `
Traveller Name: ${body.name}

Trip: ${body.trip}

What they want:
${body.expectations}

Generate a WhatsApp message.
`,
          },
        ],
      });

    return Response.json({
      message:
        completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed",
      },
      { status: 500 }
    );
  }
}
