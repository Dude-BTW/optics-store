document.addEventListener("DOMContentLoaded", () => {
  const indicators = document.querySelectorAll(".carousel-indicator");
  if (indicators.length > 0) {
    indicators[0].classList.add("active");
  }
});

document.querySelectorAll(".carousel-indicator").forEach((indicator, index) => {
  indicator.addEventListener("click", function () {
    document
      .querySelectorAll(".carousel-indicator")
      .forEach((ind) => ind.classList.remove("active"));
    this.classList.add("active");
    $("#photoCarousel").carousel(index);
  });
});

$("#photoCarousel").on("slide.bs.carousel", function (e) {
  const indicators = document.querySelectorAll(".carousel-indicator");
  indicators.forEach((ind) => ind.classList.remove("active"));
  if (indicators[e.to]) {
    indicators[e.to].classList.add("active");
  }
});

/**
 * Responsive Interface Controller:
 * Calculates viewport width in real-time to center-align slider UI components,
 * ensuring structural integrity across diverse device form factors.
 */
function adjustSwiperPaginationMargin() {
  const screenWidth = window.innerWidth;
  const pagination = document.querySelector(".swiper-pagination");
  if (pagination) {
    const paginationWidth = pagination.offsetWidth;
    const marginLeft = (screenWidth - paginationWidth) / 2;
    pagination.style.marginLeft = marginLeft + "px";
  }
}

window.addEventListener("DOMContentLoaded", adjustSwiperPaginationMargin);
window.addEventListener("resize", adjustSwiperPaginationMargin);

document.addEventListener("DOMContentLoaded", () => {
  /**
   * Dynamic Interactive Carousel Instance:
   * Initializes touch-responsive product brand showcases using hardware-accelerated
   * cross-fade transition logic and infinite looping mechanisms.
   */
  const swiper = new Swiper(".swiper-container", {
    slidesPerView: 5,
    spaceBetween: 10,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    fadeEffect: {
      crossFade: true,
    },
  });

  const bullet = document.querySelector(".swiper-pagination-bullet");
  const paginationBullets = document.querySelectorAll(
    ".swiper-pagination-bullet",
  );
  const paginationContainer = document.querySelector(".swiper-pagination");
  let distanceFromLeft;
  let objectBullet;

  if (bullet && paginationContainer) {
    const bulletRect = bullet.getBoundingClientRect();
    const paginationRect = paginationContainer.getBoundingClientRect();

    const width = bulletRect.width;
    distanceFromLeft = bulletRect.left - paginationRect.left;
    objectBullet = width + distanceFromLeft * 2;

    paginationContainer.style.width = `${objectBullet * 9}px`;
  } else {
    console.warn(
      "Could not find .swiper-pagination-bullet or .swiper-pagination in the DOM.",
    );
  }

  let previousActiveIndex = 0;

  function scrollPaginationToActiveBullet(activeIndex) {
    const activeBullet = paginationBullets[activeIndex];
    const offsetLeft = activeBullet.offsetLeft;
    const scrollLeft = paginationContainer.scrollLeft;
    const containerWidth = paginationContainer.offsetWidth;

    const distanceJumped = Math.abs(activeIndex - previousActiveIndex);
    const shouldAnimate = distanceJumped <= 5;

    const scrollOptions = {
      left: 0,
      behavior: shouldAnimate ? "smooth" : "auto",
    };

    if (offsetLeft < scrollLeft + objectBullet) {
      scrollOptions.left = offsetLeft - objectBullet - distanceFromLeft;
    } else if (
      offsetLeft + objectBullet + distanceFromLeft >
      scrollLeft + containerWidth
    ) {
      scrollOptions.left =
        offsetLeft - containerWidth + objectBullet * 2 - distanceFromLeft;
    } else {
      previousActiveIndex = activeIndex;
      return;
    }

    paginationContainer.scrollTo(scrollOptions);
    previousActiveIndex = activeIndex;
  }

  paginationBullets.forEach((bullet, index) => {
    bullet.addEventListener("click", () => {
      paginationBullets.forEach((b) =>
        b.classList.remove("swiper-pagination-bullet-active"),
      );
      bullet.classList.add("swiper-pagination-bullet-active");
      swiper.slideToLoop(index);
      scrollPaginationToActiveBullet(index);
    });
  });

  swiper.on("slideChange", function () {
    paginationBullets.forEach((b) =>
      b.classList.remove("swiper-pagination-bullet-active"),
    );
    paginationBullets[swiper.realIndex].classList.add(
      "swiper-pagination-bullet-active",
    );
    scrollPaginationToActiveBullet(swiper.realIndex);
  });
});
