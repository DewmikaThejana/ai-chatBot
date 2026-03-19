async function getAIResponse(messages) {
  try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization:
          "Bearer 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",
        "HTTP-Referer": "http://localhost/ai_practical_2/index.html", // Optional. Site URL for rankings on openrouter.ai.
        "X-OpenRouter-Title": "Adacore Chatbot", // Optional. Site title for rankings on openrouter.ai.
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "stepfun/step-3.5-flash:free",
        messages: messages,
      }),
    });

    const data = await r.json();
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      console.error("Unexpected API response structure:", data);
      return "I didn't quite catch that. Could you try again?";
    }
  } catch (error) {
    console.error("Error fetching from OpenRouter:", error);
    return "Sorry, I'm having trouble connecting to the server right now.";
  }
}
