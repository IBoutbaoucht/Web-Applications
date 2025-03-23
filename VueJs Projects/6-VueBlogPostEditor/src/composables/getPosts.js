import { ref } from "vue";

const API_URL = "http://localhost:3000";

export function usePosts() {
  const posts = ref([]);
  const error = ref(null);
  const loading = ref(true);

  const load = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      posts.value = await response.json();
      loading.value = false;
    } catch (err) {
      error.value = err.message;
      loading.value = false;
    }
  };

  // Load posts immediately
  load();

  return {
    posts,
    error,
    loading,
    load, // Exposing load function to allow manual refresh
  };
}

export function usePost(id) {
  const post = ref(null);
  const error = ref(null);
  const loading = ref(true);

  const load = async () => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`);
      if (!response.ok) throw new Error("Post not found");
      post.value = await response.json();
      loading.value = false;
    } catch (err) {
      error.value = err.message;
      loading.value = false;
    }
  };

  // Load post immediately
  load();

  return {
    post,
    error,
    loading,
  };
}

export async function createPost(postData) {
  try {
    // Get all posts to determine the next ID
    const response = await fetch(`${API_URL}/posts`);
    if (!response.ok) throw new Error("Failed to fetch posts");
    const posts = await response.json();

    // Find the highest ID and add 1, or start at 1 if no posts exist
    const nextId =
      posts.length > 0
        ? Math.max(...posts.map((post) => parseInt(post.id))) + 1
        : 1;

    const newPost = {
      ...postData,
      id: nextId.toString(), // Convert to string
    };

    const createResponse = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });

    if (!createResponse.ok) throw new Error("Failed to create post");
    return await createResponse.json();
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function updatePost(id, postData) {
  try {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...postData, id: id.toString() }),
    });

    if (!response.ok) throw new Error("Failed to update post");
    return await response.json();
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function deletePost(id) {
  try {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete post");
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
}
