import { PageHead, OrganizationSchema, WebsiteSchema, BreadcrumbSchema } from "@/components/SEO";
import LandingPageLayout from "@/components/LandingPageLayout";

export default function AboutPage() {
  return (
    <>
      <PageHead
        title="About TRION AI"
        description="Learn about TRION AI, the AI-powered Wingo30 prediction and signals platform. How the platform works, its Korven and FX1 models, and how to get support."
        canonical="https://wingo30.com/about"
      />
      <OrganizationSchema />
      <WebsiteSchema />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "About TRION AI", url: "https://wingo30.com/about" }
      ]} />
      <LandingPageLayout>
        <article className="seo-page">
          <div className="seo-meta">Official information</div>
          <h1>About TRION AI</h1>
          <p className="seo-lead">
            TRION AI is an AI-powered prediction and signals platform built for the Wingo 30-second game. It analyzes live game history to produce number, color, and size signals for every new period.
          </p>

          <h2>What TRION AI does</h2>
          <p>
            TRION AI (wingo30.com) is centered around one tool: a real-time analysis engine for the Wingo 30-Second lottery-style game. Every 30 seconds a new period starts, and the platform reads the latest drawing history to estimate the direction of the next outcome. Results are presented as:
          </p>
          <ul>
            <li><strong>Number signals</strong> – the most relevant digits (0–9) from the recent pattern.</li>
            <li><strong>Color signals</strong> – Green, Violet, or Red based on the number distribution.</li>
            <li><strong>Size signals</strong> – Big (5–9) or Small (0–4).</li>
          </ul>
          <p>
            All predictions are statistical estimates derived from pattern and trend analysis. TRION AI does not guarantee results, wins, or returns.
          </p>

          <h2>Platform features</h2>
          <ul>
            <li><strong>Live prediction tool</strong> – generate a signal for the current period with one tap. See the <a href="/ai-prediction">AI prediction tool</a>.</li>
            <li><strong>Trend and hot-cold analysis</strong> – which numbers repeat most, and which are due. Explained on the <a href="/wingo-signal">Wingo signals</a> page.</li>
            <li><strong>Analytics dashboard</strong> – win-rate, prediction history, and frequency board. See the <a href="/ai-dashboard">TRION AI dashboard</a>.</li>
            <li><strong>Premium models</strong> – the <a href="/korven-model">Korven model</a> (₹749) and <a href="/fx1-model">FX1 model</a> (₹1,100), both with lifetime access.</li>
            <li><strong>Developer API</strong> – real-time Wingo30 data for builders. Visit the <a href="/developer">Developer API portal</a>.</li>
          </ul>

          <h2>The two models</h2>
          <p>
            TRION AI offers two analysis models with different performance profiles. The Korven model is the entry-level premium option, while the FX1 model is built for faster convergence on results. You can compare them side by side on the <a href="/models">models page</a> and choose one at <a href="/subscription">subscription</a>.
          </p>

          <h2>Responsible use</h2>
          <p>
            TRION AI is an analysis tool, not a guarantee of profit. Wingo games are chance-based, and even the best statistical signals can lose. Use the platform responsibly, set limits for yourself, and never rely on predictions for essential funds. Our <a href="/terms">terms</a> and <a href="/privacy">privacy policy</a> explain our rules in detail.
          </p>

          <h2>Support</h2>
          <p>
            Need help with activation, payments, or the tool itself? Visit the <a href="/faq">FAQ</a>, reach out on the <a href="/contact">contact page</a>, or join our Telegram support channel.
          </p>
        </article>
      </LandingPageLayout>
    </>
  );
}