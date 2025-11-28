import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Você precisa enviar 'message' no corpo da requisição." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OPENAI_API_KEY não está configurada.' }, { status: 500 })
    }

    // Chamada direta à API OpenAI (Chat Completions)
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: message }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI API returned non-ok:", openaiRes.status, errText)
      return NextResponse.json({ error: 'OpenAI API error', details: errText }, { status: 500 })
    }

    const openaiJson = await openaiRes.json();
    const text = openaiJson?.choices?.[0]?.message?.content ?? openaiJson?.choices?.[0]?.text ?? ""

    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error("Chat handler error:", error)
    const details = error?.message ?? (error && JSON.stringify(error)) ?? String(error)
    const stack = error?.stack ?? undefined
    return NextResponse.json(
      { error: "Erro ao gerar resposta da IA.", details, stack },
      { status: 500 }
    );
  }
}
