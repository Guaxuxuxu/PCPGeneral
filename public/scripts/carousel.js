document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#projectsCarousel .carousel-item img').forEach((img, idx) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function () {
      document.getElementById('fullscreen-carousel').classList.add('active');
      const fullCarousel = document.querySelectorAll('#carouselFullScreen .carousel-item');
      fullCarousel.forEach((item, i) => {
        item.classList.toggle('active', i === idx);
      });
    });
  });

  document.querySelector('.close-fullscreen').addEventListener('click', function () {
    document.getElementById('fullscreen-carousel').classList.remove('active');
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === "Escape") {
      document.getElementById('fullscreen-carousel').classList.remove('active');
    }
  });
});
                                