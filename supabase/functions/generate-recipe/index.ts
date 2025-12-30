import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

Deno.serve(async (req) => {
  try {
    const { ingredients } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a chef that provides recipe data in strict JSON format." },
        { role: "user", content: `Create a recipe using: ${ingredients.join(", ")}` }
      ],
      // THIS IS THE KEY: We define the exact schema allowed
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "recipe_generation",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: {type:"string"},
              steps: { type: "array", items: { type: "string" } },
              cookingTimeMinutes: { type: "number" },
              ingredients: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    quantity: { type: "number" },
                    unit: { type: "string" },
                    price_estimate: { type: "number" }
                  },
                  required: ["name", "quantity", "unit", "price_estimate"],
                  additionalProperties: false
                }
              }
            },
            required: ["title", "description", "steps", "cookingTimeMinutes", "ingredients"],
            additionalProperties: false
          }
        }
      }
    });

    return new Response(completion.choices[0].message.content, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});