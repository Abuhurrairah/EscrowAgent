import { NextResponse } from "next/server";
import { AgreementDraft, mockAgreementDraft } from "@/lib/agreement";

type OpenAIResponse = {
  output_text?: string;
};

const schema = {
  name: "escrow_agreement",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      title: { type: "string" },
      workerRole: { type: "string" },
      budgetSuggestion: { type: "string" },
      deadlineSuggestion: { type: "string" },
      deadlineIso: { type: "string" },
      acceptanceCriteria: {
        type: "array",
        items: { type: "string" }
      },
      agreementSummary: { type: "string" }
    },
    required: [
      "title",
      "workerRole",
      "budgetSuggestion",
      "deadlineSuggestion",
      "deadlineIso",
      "acceptanceCriteria",
      "agreementSummary"
    ]
  }
};

async function generateWithOpenAI(description: string): Promise<AgreementDraft> {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-5",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "Turn a freelance task description into a short escrow agreement for a hackathon MVP. Keep it practical, concise, and realistic for a local demo."
            }
          ]
        },
        {
          role: "user",
          content: [{ type: "input_text", text: description }]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          ...schema
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with ${response.status}`);
  }

  const data = (await response.json()) as OpenAIResponse;
  if (!data.output_text) {
    throw new Error("OpenAI response did not include structured output.");
  }

  return JSON.parse(data.output_text) as AgreementDraft;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { description?: string };
    const description = body.description?.trim();

    if (!description) {
      return NextResponse.json({ error: "Description is required." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ agreement: mockAgreementDraft(description), source: "mock" });
    }

    try {
      const agreement = await generateWithOpenAI(description);
      return NextResponse.json({ agreement, source: "openai" });
    } catch {
      return NextResponse.json({ agreement: mockAgreementDraft(description), source: "mock" });
    }
  } catch {
    return NextResponse.json({ error: "Failed to generate agreement." }, { status: 500 });
  }
}
