const GITHUB = "https://github.com/babayevjavid";

export function AboutPanel() {
  return (
    <div className="about-panel">
      <p className="about-lead">
        <strong>Vocab</strong> is a Wordle-style word puzzle built as a portfolio piece — focused on
        polish, accessibility, and playful extras.
      </p>

      <div className="about-block">
        <h3>Features</h3>
        <ul>
          <li>Daily, Practice &amp; Blitz modes</li>
          <li>Hard mode, hints, streaks &amp; stats</li>
          <li>6 color themes &amp; sound effects</li>
        </ul>
      </div>

      <div className="about-block">
        <h3>Built with</h3>
        <div className="tech-tags">
          <span>React</span>
          <span>TypeScript</span>
          <span>Vite</span>
          <span>CSS</span>
        </div>
      </div>

      <div className="about-block">
        <h3>Author</h3>
        <p>
          Javid Babayev — developer &amp; portfolio builder.
        </p>
        <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="about-github">
          github.com/babayevjavid →
        </a>
      </div>
    </div>
  );
}
