export async function sendAnswersToGemini(userResponses) {
  try {
    const response = await fetch("http://localhost:5000/generate-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userResponses),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Backend Error:", data.error);
      if (data.error.includes("API key")) {
        return "Server configuration error. Please contact support.";
      }
      return data.error;
    }

    return data.result || "No relevant schemes found.";
  } catch (error) {
    console.error("Network Error:", error);
    return "Connection problem. Please check your network and try again.";
  }
}
