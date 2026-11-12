JIYA'S INTERVIEW ROOM: NETLIFY DEPLOY

Files
  index.html                   the whole app
  netlify/functions/ask.mjs    small server function that calls Claude with your API key
  netlify.toml                 tells Netlify where things are

Deploy (about 5 minutes)
  1. Get an API key at https://console.anthropic.com (Settings → API keys). Add a few dollars of credit.
     A full mock interview costs only a few cents.
  2. Go to https://app.netlify.com → Add new site → Deploy manually,
     and drag this whole folder in. (Use the folder, not just index.html, so the function is included.)
     Or push the folder to GitHub and import it in Netlify.
  3. In Netlify: Site configuration → Environment variables → Add variable
       Key:   ANTHROPIC_API_KEY
       Value: your key
  4. Deploys → Trigger deploy → Deploy site (so the function picks up the key).
  5. Open the site. Under the Start button it should say "AI panel ready."

Notes
  - Without the key, the site still works: questions, hints, model-answer pointers and prep notes.
  - Voice and mic use the browser's own speech features. They work best in Chrome or Edge.
    Firefox has no mic support, and Safari's support is partial.
  - Anyone with the link can use your key. Share it only with Jiya, and set a spending limit in the Anthropic console.
