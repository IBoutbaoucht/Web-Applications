const API_URL = "http://localhost:3001";

export const api = {
  async fetchJobs() {
    const response = await fetch(`${API_URL}/jobs`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  },

  async fetchJob(id) {
    const response = await fetch(`${API_URL}/jobs/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  },

  async createJob(jobData) {
    const response = await fetch(`${API_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  },

  async updateJob(id, jobData) {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  },

  async deleteJob(id) {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return true;
  },
};
