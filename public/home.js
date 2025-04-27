const posts = [
    {
        user: "mario_rossi_1",
        place: "#Roma",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/960px-Colosseo_2020.jpg",
        description: "Una bella giornata!"
    },
];

function loadPosts() {
    const container = document.getElementById('post-container');
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';

        postDiv.innerHTML = `
            <div class="user-info">${post.user} ${post.place}</div>
            <img src="${post.image}" alt="Post Image">
            <div class="description">${post.description}</div>
            <div class="like">
                <button onclick="likePost(this)">❤️</button>
                <span id="like-count-${index}">0</span>
            </div>
        `;
        container.appendChild(postDiv);
    });
}

function likePost(button) {
    posts[index].likes++;
    button.style.color = 'red'; 
    document.getElementById(`like-count-${index}`).innerText = posts[index].likes; // Aggiorna numero
}

window.onload = loadPosts;