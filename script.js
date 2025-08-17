const backendURL = "https://mp3-deletion.onrender.com";
let allSongs = [];

async function loadSongs() {
  try {
    const res = await fetch(`${backendURL}/songs`);
    allSongs = await res.json();
    displaySongs(allSongs);
    updateSongCount(allSongs.length);
  } catch (error) {
    console.error("Error loading songs:", error);
    alert("Failed to load songs. Please try again later.");
  }
}

function displaySongs(songs) {
  const container = document.getElementById("songList");
  container.innerHTML = "";

  if (songs.length === 0) {
    container.innerHTML = '<div class="no-songs">No songs found</div>';
    return;
  }

  songs.forEach(song => {
    const card = document.createElement("div");
    card.className = "song-card";

    card.innerHTML = `
      <img src="${song.cover}" alt="${song.title}" class="song-cover">
      <div class="song-info">
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
      </div>
      <audio src="${song.url}" controls></audio>
      <button class="delete-btn" onclick="deleteSong('${song._id}')">Delete</button>
    `;
    container.appendChild(card);
  });
}

function updateSongCount(count) {
  const countElement = document.getElementById("songCount");
  countElement.textContent = `${count} ${count === 1 ? 'song' : 'songs'}`;
}

async function deleteSong(id) {
  if (confirm("Are you sure you want to delete this song?")) {
    try {
      await fetch(`${backendURL}/songs/${id}`, {
        method: "DELETE"
      });
      loadSongs();
    } catch (error) {
      console.error("Error deleting song:", error);
      alert("Failed to delete song. Please try again.");
    }
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  loadSongs();
});






document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  
  // Live search as user types
  searchInput.addEventListener('input', performSearch);
  
  // Debounce function to limit how often search is performed
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }

  // Debounced search to prevent excessive filtering while typing
  const debouncedSearch = debounce(performSearch, 300);

  // Listen for input with debounce
  searchInput.addEventListener('input', debouncedSearch);

  function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
      displaySongs(allSongs);
      updateSongCount(allSongs.length);
      return;
    }

    const filteredSongs = allSongs.filter(song => 
      song.title.toLowerCase().includes(searchTerm) || 
      song.artist.toLowerCase().includes(searchTerm)
    );

    displaySongs(filteredSongs);
    updateSongCount(filteredSongs.length);
  }
});
