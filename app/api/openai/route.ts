import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, restaurantId } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Clé API OpenAI non configurée' },
        { status: 500 }
      );
    }

    console.log(`Traitement de la requête IA pour le restaurant ${restaurantId}`);
    console.log(`Prompt: ${prompt.substring(0, 150)}...`);

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        {
          role: "system",
          content: "Tu es un expert culinaire et conseiller en restauration. Ta mission est d'aider les restaurateurs à améliorer leur offre, optimiser leur menu et suivre les tendances du secteur. Fournis des conseils personnalisés, précis et pratiques en fonction du contexte du restaurant."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    // Récupérer la réponse générée
    const response = completion.choices[0].message.content;

    console.log(`Réponse générée: ${response?.substring(0, 150)}...`);

    return NextResponse.json(completion);
  } catch (error) {
    console.error('Erreur lors de la génération de la réponse:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la communication avec l\'API OpenAI' },
      { status: 500 }
    );
  }
} 