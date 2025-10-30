import { db } from "../firebase";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";

// ✅ Create a new category
export async function createCategory(title, description, topicIds = []) {
  await addDoc(collection(db, "categories"), {
    title,
    description,
    topics: topicIds,
    createdAt: new Date(),
  });
}

// ✅ Fetch all categories
export async function getCategories() {
  const snapshot = await getDocs(collection(db, "categories"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ✅ Add topic to category
export async function addTopicToCategory(categoryId, topicId) {
  const categoryRef = doc(db, "categories", categoryId);
  const categorySnap = await getDocs(collection(db, "categories"));
  const category = categorySnap.docs.find(d => d.id === categoryId);
  if (!category) throw new Error("Category not found");

  const topics = category.data().topics || [];
  if (!topics.includes(topicId)) {
    await updateDoc(categoryRef, { topics: [...topics, topicId] });
  }
}
