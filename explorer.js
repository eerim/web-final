document.addEventListener('DOMContentLoaded', () => {
  fetch('./gestures.json') // ✅ дәл осылай жаз
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load gestures.json');
      }
      return response.json();
    })
    .then(data => {
      const searchBox = document.getElementById('searchBox');
      const regionSelect = document.getElementById('regionSelect');
      const generationSelect = document.getElementById('generationSelect');
      const container = document.getElementById('gestureContainer');

      function renderGestures(gestures) {
        container.innerHTML = '';
        gestures.forEach(g => {
          const card = `
            <div class="col-md-3 col-sm-6 mb-4">
              <div class="card p-3 text-center shadow gesture-card">
                <h1>${g.emoji}</h1>
                <h2>${g.flag || ''}</h2>
                <h5>${g.name}</h5>
                <p>🌍 ${g.region}</p>
                <p> ${g.generation}</p>
              </div>
            </div>`;
          container.innerHTML += card;
        });
      }

      function filterGestures() {
        const search = searchBox.value.toLowerCase();
        const region = regionSelect.value;
        const gen = generationSelect.value;

        const filtered = data.filter(g =>
          g.name.toLowerCase().includes(search) &&
          (region === 'All' || g.region === region) &&
          (gen === 'All' || g.generation === gen)
        );
        renderGestures(filtered);
        renderGestures(filtered);
animateCards();
      }

      searchBox.addEventListener('input', filterGestures);
      regionSelect.addEventListener('change', filterGestures);
      generationSelect.addEventListener('change', filterGestures);

      renderGestures(data);
    })
    .catch(error => {
      console.error('Error loading gestures:', error);
      alert('⚠️ Could not load gestures.json. Please use Live Server to run the project.');
    });
});
// Анимациямен пайда болу
function animateCards() {
  const cards = document.querySelectorAll('.gesture-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
      card.style.transition = 'all 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 100);
  });
}
