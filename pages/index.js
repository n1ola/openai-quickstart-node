import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [ingredientsInput, setIngredientsInput] = useState("");
  const [result, setResult] = useState();
  const [imageResult, setImageResult ] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: ingredientsInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      console.log(data);

      setResult(data.result);
      setIngredientsInput("");
      setImageResult(data.imageResult);

    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Suggerisci ricetta</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="ingredienti"
            placeholder="Inserisci ingredienti"
            value={ingredientsInput}
            onChange={(e) => setIngredientsInput(e.target.value)}
          />
          <input type="submit" value="Genera ricetta" />
        </form>
        <div className={styles.result}>{result}</div>
        <div className={styles.imageResult}>
          <img src={imageResult} />
        </div>
      </main>
    </div>
  );
}
