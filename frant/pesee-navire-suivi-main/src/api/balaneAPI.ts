import axios from "axios";

export async function getPoids(): Promise<number> {
  const apiUrl = "http://localhost:5000/poids"; // endpoint Flask

  try {
    const response = await axios.get(apiUrl);
    let poids = response.data?.poids;

    if (poids === undefined || poids === null) {
      // Générer un poids aléatoire si aucune donnée
      poids = Number((Math.random() * 100).toFixed(2));
    }

    return Number(poids);
  } catch (error) {
    console.warn("Erreur API, génération aléatoire :", error);
    return Number((Math.random() * 100).toFixed(2));
  }
}
