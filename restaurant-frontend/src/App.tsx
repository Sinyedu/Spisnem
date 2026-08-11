import "./App.scss";

function App() {
  return (
    <main className="construction">
      <div className="construction__glow construction__glow--top" />
      <div className="construction__glow construction__glow--bottom" />

      <section className="construction__content" aria-labelledby="page-title">
        <div className="construction__mark">
          <span aria-hidden="true" />
          <img src="/images/logo2.png" alt="SpisNem" />
        </div>

        <p className="construction__eyebrow">
          <span aria-hidden="true" />
          Something good is cooking
        </p>

        <h1 id="page-title">Under construction</h1>
        <p className="construction__description">
          We&rsquo;re putting the finishing touches on a better way to find your
          next meal. Check back soon.
        </p>
      </section>

      <footer className="construction__footer">
        <span>&copy; {new Date().getFullYear()} SpisNem</span>
        <span className="construction__status">
          <span aria-hidden="true" />
          Work in progress
        </span>
      </footer>
    </main>
  );
}

export default App;
