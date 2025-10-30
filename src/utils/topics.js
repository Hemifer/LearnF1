import { collection, addDoc, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";

// Fetch all topics
export async function getAllTopics() {
  const snapshot = await getDocs(collection(db, "topics"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Fetch one topic
export async function getTopicById(id) {
  const docRef = doc(db, "topics", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Topic not found");
  }
}

// Create a topic
export async function createTopic(title, description, userId, tags = []) {
  const q = query(collection(db, "topics"), where("title", "==", title));
  const existing = await getDocs(q);
  if (!existing.empty) throw new Error("A topic with this title already exists.");

  await addDoc(collection(db, "topics"), {
    title,
    description,
    tags,               // ✅ new field
    createdBy: userId,
    createdAt: new Date(),
  });
}
