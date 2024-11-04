//api.github.com/repos/rootv890/stage-project-manager

export const fetchGitRepo = async () => {
  try {
    const response = await fetch(
      "https://api.github.com/repos/rootv890/stage-project-manager"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return {
      forkCount: data.forks_count,
      forkUrl: "https://github.com/rootv890/stage-project-manager/forks",
      startsCount: data.stargazers_count,
    };
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};
