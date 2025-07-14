//u
const API_KEY = "";
const API_URL = "";

async function processNote(action) {
  const note = document.getElementById("note").value.trim();
  if (!note) return alert("Please enter some notes first.");

  let prompt = "";
  switch (action) {
    case 'summarize':
      prompt = `Summarize the following note:\n\n${note}`;
      break;
    case 'improve':
      prompt = `Suggest improvements and corrections for this note:\n\n${note}`;
      break;
    case 'highlight':
      prompt = `Highlight the most important points in the following note:\n\n${note}`;
      break;
    case 'formal':
      prompt = `Rewrite this note in a more formal tone:\n\n${note}`;
      break;
  }

  const outputDiv = document.getElementById("output");
  outputDiv.textContent = "⏳ Generating response...";

  const res = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await res.json();
  const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
  outputDiv.textContent = result || "⚠️ No response. Try again.";
}

function toggleMode() {
  document.body.classList.toggle("light");
}

function downloadNote() {
  const text = document.getElementById("note").value;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "note.txt";
  a.click();
  URL.revokeObjectURL(url);
}

function startDictation() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Voice recognition not supported in this browser.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById("note").value += " " + transcript;
  };

  recognition.onerror = function() {
    alert("Voice input failed. Try again.");
  };

  recognition.start();
}

