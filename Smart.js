class SmartAI {
  constructor(name = "Smart.js", vectorSize = 16) {
    this.name = name;
    this.vectorSize = vectorSize; // dimension of math-space
    this.memory = []; // store {vector, seed} pairs
  }

  // Convert input text to numeric vector (simple hash -> vector)
  textToVector(text) {
    const vec = Array(this.vectorSize).fill(0);
    for (let i = 0; i < text.length; i++) {
      vec[i % this.vectorSize] += text.charCodeAt(i) / 256; // normalized
    }
    return vec.map(v => v * 2 - 1); // scale -1..1
  }

  // Cosine similarity
  cosineSimilarity(v1, v2) {
    let dot = 0, mag1 = 0, mag2 = 0;
    for (let i = 0; i < this.vectorSize; i++) {
      dot += (v1[i] || 0) * (v2[i] || 0);
      mag1 += (v1[i] || 0) ** 2;
      mag2 += (v2[i] || 0) ** 2;
    }
    return dot / (Math.sqrt(mag1) * Math.sqrt(mag2) + 1e-10);
  }

  // Learn a new input (store its vector)
  learn(input) {
    const vector = this.textToVector(input);
    this.memory.push({ vector, seed: input });
  }

  // Generate a “word” procedurally from a vector
  generateWord(vector) {
    const vowels = ["a","e","i","o","u"];
    const consonants = [
      "b","c","d","f","g","h","j","k","l","m",
      "n","p","q","r","s","t","v","w","x","y","z"
    ];
    const length = 3 + Math.floor(Math.random() * 4);
    let word = "";
    for (let i = 0; i < length; i++) {
      const useVowel = i % 2 === 0 ? vector[i % this.vectorSize] > 0 : vector[i % this.vectorSize] <= 0;
      const pool = useVowel ? vowels : consonants;
      const idx = Math.floor(((vector[i % this.vectorSize] + 1) / 2) * pool.length);
      word += pool[idx % pool.length];
    }
    return word;
  }

  // Generate a sentence from a vector
  generateSentence(vector) {
    const wordCount = 3 + Math.floor(Math.random() * 5);
    const sentence = [];
    for (let i = 0; i < wordCount; i++) {
      const newVec = vector.map(v => v + (Math.random() - 0.5) * 0.3); // mutate vector
      sentence.push(this.generateWord(newVec));
    }
    return sentence.join(" ");
  }

  // Respond to input using real vector math
  respond(input) {
    const inputVec = this.textToVector(input);

    if (this.memory.length === 0) {
      return this.generateSentence(inputVec); // no memory yet
    }

    // Find the most similar memory
    let bestSim = -1;
    let bestVec = null;
    for (const mem of this.memory) {
      const sim = this.cosineSimilarity(inputVec, mem.vector);
      if (sim > bestSim) {
        bestSim = sim;
        bestVec = mem.vector;
      }
    }

    return this.generateSentence(bestVec);
  }
      }
