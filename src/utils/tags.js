import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function getAllTags() {
  const snapshot = await getDocs(collection(db, "topics"));
  const tags = new Set();
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.tags && Array.isArray(data.tags)) {
      data.tags.forEach((tag) => tags.add(tag));
    }
  });
  return Array.from(tags);
}
