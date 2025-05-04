import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "./index";

// Check if a user has permission to edit a project
export const userCanEditProject = async (projectId, userId) => {
  try {
    // First check if user is the owner
    const projectDoc = await getDoc(doc(db, "projects", projectId));
    if (!projectDoc.exists()) {
      return false;
    }

    const projectData = projectDoc.data();
    if (projectData.userId === userId) {
      return true;
    }

    // Check if user is a collaborator with write or admin permissions
    const collaboratorQuery = query(
      collection(db, "projectCollaborators"),
      where("projectId", "==", projectId),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(collaboratorQuery);
    if (snapshot.empty) {
      return false;
    }

    const collaboratorData = snapshot.docs[0].data();
    return ["write", "admin"].includes(collaboratorData.role);
  } catch (error) {
    console.error("Error checking edit permissions:", error);
    return false;
  }
};

// Get collaborator role for a project
export const getCollaboratorRole = async (projectId, userId) => {
  try {
    // First check if user is the owner
    const projectDoc = await getDoc(doc(db, "projects", projectId));
    if (!projectDoc.exists()) {
      return null;
    }

    const projectData = projectDoc.data();
    if (projectData.userId === userId) {
      return "owner";
    }

    // Check collaborator role
    const collaboratorQuery = query(
      collection(db, "projectCollaborators"),
      where("projectId", "==", projectId),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(collaboratorQuery);
    if (snapshot.empty) {
      return null;
    }

    const collaboratorData = snapshot.docs[0].data();
    return collaboratorData.role;
  } catch (error) {
    console.error("Error checking collaborator role:", error);
    return null;
  }
};

// Get all projects a user can access (owned + collaborated)
export const getUserProjects = async (userId) => {
  try {
    // Get projects owned by the user
    const ownedProjectsQuery = query(
      collection(db, "projects"),
      where("userId", "==", userId)
    );

    const ownedSnapshot = await getDocs(ownedProjectsQuery);
    const ownedProjects = ownedSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      role: "owner",
    }));

    // Get projects where user is a collaborator
    const collaboratorQuery = query(
      collection(db, "projectCollaborators"),
      where("userId", "==", userId)
    );

    const collabSnapshot = await getDocs(collaboratorQuery);
    const collaboratedProjectIds = collabSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.projectId,
        role: data.role,
      };
    });

    // Fetch the actual projects
    const collaboratedProjects = [];
    for (const { id, role } of collaboratedProjectIds) {
      const projectDoc = await getDoc(doc(db, "projects", id));
      if (projectDoc.exists()) {
        collaboratedProjects.push({
          id: projectDoc.id,
          ...projectDoc.data(),
          role,
        });
      }
    }

    return [...ownedProjects, ...collaboratedProjects];
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return [];
  }
};

// Get all collaborators for a project
export const getProjectCollaborators = async (projectId) => {
  try {
    const collaboratorsQuery = query(
      collection(db, "projectCollaborators"),
      where("projectId", "==", projectId)
    );

    const snapshot = await getDocs(collaboratorsQuery);
    const collaborators = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      // Get user details
      const userDoc = await getDoc(doc(db, "users", data.userId));
      if (userDoc.exists()) {
        collaborators.push({
          id: doc.id,
          ...data,
          email: userDoc.data().email,
          displayName: userDoc.data().displayName,
          photoURL: userDoc.data().photoURL,
        });
      } else {
        collaborators.push({
          id: doc.id,
          ...data,
          email: "Unknown User",
          displayName: "Unknown User",
        });
      }
    }

    return collaborators;
  } catch (error) {
    console.error("Error fetching project collaborators:", error);
    return [];
  }
};
