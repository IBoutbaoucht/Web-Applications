import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "./index";
import { userCanEditProject } from "./collaborations";

// Get all code snippets for a project
export const getProjectCodeSnippets = async (projectId) => {
  try {
    const snippetsQuery = query(
      collection(db, "codeSnippets"),
      where("projectId", "==", projectId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(snippetsQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching code snippets:", error);
    return [];
  }
};

// Get a single code snippet by ID
export const getCodeSnippetById = async (snippetId) => {
  try {
    const snippetDoc = await getDoc(doc(db, "codeSnippets", snippetId));
    if (snippetDoc.exists()) {
      return {
        id: snippetDoc.id,
        ...snippetDoc.data(),
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching code snippet:", error);
    return null;
  }
};

// Add a new code snippet
export const addCodeSnippet = async (projectId, snippetData) => {
  try {
    // Check if user has permission to edit this project
    const userId = auth.currentUser.uid;
    const canEdit = await userCanEditProject(projectId, userId);

    if (!canEdit) {
      throw new Error(
        "You don't have permission to add code snippets to this project"
      );
    }

    const docRef = await addDoc(collection(db, "codeSnippets"), {
      projectId,
      userId,
      title: snippetData.title,
      language: snippetData.language,
      code: snippetData.code,
      description: snippetData.description || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Add an activity record
    await addDoc(collection(db, "activities"), {
      type: "project",
      action: "code_snippet_add",
      description: `Added code snippet: ${snippetData.title}`,
      projectId,
      userId,
      timestamp: serverTimestamp(),
    });

    return {
      id: docRef.id,
      projectId,
      userId,
      ...snippetData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error adding code snippet:", error);
    throw error;
  }
};

// Update an existing code snippet
export const updateCodeSnippet = async (snippetId, snippetData) => {
  try {
    // Get the snippet to check project ID
    const snippetDoc = await getDoc(doc(db, "codeSnippets", snippetId));
    if (!snippetDoc.exists()) {
      throw new Error("Code snippet not found");
    }

    const snippetInfo = snippetDoc.data();
    const projectId = snippetInfo.projectId;

    // Check if user has permission to edit this project
    const userId = auth.currentUser.uid;
    const canEdit = await userCanEditProject(projectId, userId);

    if (!canEdit && snippetInfo.userId !== userId) {
      throw new Error("You don't have permission to edit this code snippet");
    }

    const snippetRef = doc(db, "codeSnippets", snippetId);
    await updateDoc(snippetRef, {
      title: snippetData.title,
      language: snippetData.language,
      code: snippetData.code,
      description: snippetData.description || "",
      updatedAt: serverTimestamp(),
    });

    // Add an activity record
    await addDoc(collection(db, "activities"), {
      type: "project",
      action: "code_snippet_update",
      description: `Updated code snippet: ${snippetData.title}`,
      projectId,
      userId,
      timestamp: serverTimestamp(),
    });

    return {
      id: snippetId,
      ...snippetInfo,
      ...snippetData,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error updating code snippet:", error);
    throw error;
  }
};

// Delete a code snippet
export const deleteCodeSnippet = async (snippetId) => {
  try {
    // Get the snippet to check project ID and title
    const snippetDoc = await getDoc(doc(db, "codeSnippets", snippetId));
    if (!snippetDoc.exists()) {
      throw new Error("Code snippet not found");
    }

    const snippetInfo = snippetDoc.data();
    const projectId = snippetInfo.projectId;

    // Check if user has permission to edit this project
    const userId = auth.currentUser.uid;
    const canEdit = await userCanEditProject(projectId, userId);

    if (!canEdit && snippetInfo.userId !== userId) {
      throw new Error("You don't have permission to delete this code snippet");
    }

    await deleteDoc(doc(db, "codeSnippets", snippetId));

    // Add an activity record
    await addDoc(collection(db, "activities"), {
      type: "project",
      action: "code_snippet_delete",
      description: `Deleted code snippet: ${snippetInfo.title}`,
      projectId,
      userId,
      timestamp: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error deleting code snippet:", error);
    throw error;
  }
};
