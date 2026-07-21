// ============================================================
//  -trivia
//  Get a random trivia question! Answer within 15 seconds.
// ============================================================

// Decode HTML entities from the trivia API (e.g. &amp; → &)
function decode(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

module.exports = {
  name: "trivia",
  description: "Answer a random trivia question. You have 15 seconds!",
  usage: "-trivia",

  async execute(message) {
    try {
      // Fetch a random trivia question from Open Trivia DB (free, no key needed)
      const res = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
      const data = await res.json();
      const q = data.results[0];

      const question = decode(q.question);
      const correct = decode(q.correct_answer);
      const wrong = q.incorrect_answers.map(decode);

      // Shuffle all 4 answer choices randomly
      const allAnswers = [correct, ...wrong].sort(() => Math.random() - 0.5);
      const labels = ["🇦", "🇧", "🇨", "🇩"];

      // Build the answer list text
      const answerList = allAnswers
        .map((ans, i) => `${labels[i]} ${ans}`)
        .join("\n");

      // Find which letter is the correct one
      const correctIndex = allAnswers.indexOf(correct);
      const correctLabel = labels[correctIndex];

      await message.reply(
        `❓ **Trivia** *(${decode(q.category)} — ${q.difficulty})*\n\n` +
        `**${question}**\n\n` +
        `${answerList}\n\n` +
        `_Type the letter of your answer! You have 15 seconds..._`
      );

      // Wait for anyone in the channel to reply with a letter
      const filter = (m) =>
        !m.author.bot &&
        ["a", "b", "c", "d"].includes(m.content.toLowerCase().trim());

      const collector = message.channel.createMessageCollector({
        filter,
        time: 15000, // 15 seconds
        max: 1,      // Only collect the first answer
      });

      collector.on("collect", (m) => {
        const chosen = m.content.toLowerCase().trim();
        const chosenIndex = ["a", "b", "c", "d"].indexOf(chosen);
        const isCorrect = chosenIndex === correctIndex;

        if (isCorrect) {
          m.reply(`✅ **Correct!** The answer was ${correctLabel} **${correct}**. Well done!`);
        } else {
          m.reply(
            `❌ **Wrong!** The correct answer was ${correctLabel} **${correct}**.`
          );
        }
      });

      collector.on("end", (collected) => {
        // If nobody answered in time
        if (collected.size === 0) {
          message.channel.send(
            `⏰ **Time's up!** The correct answer was ${correctLabel} **${correct}**.`
          );
        }
      });
    } catch (error) {
      message.reply("😅 Couldn't fetch a trivia question right now. Try again later!");
    }
  },
};
