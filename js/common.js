var $slide = $(".slide")
  .slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    speed: 3000,
    autoplaySpeed: 4000,
    autoplay: true
  })
  .on({
    beforeChange: function (event, slick, currentSlide, nextSlide) {
      $(".slick-slide", this).eq(currentSlide).addClass("preve-slide");
      $(".slick-slide", this).eq(nextSlide).addClass("slide-animation");
    },
    afterChange: function () {
      $(".preve-slide", this).removeClass("preve-slide　slide-animation");
    }
  });
$slide.find(".slick-slide").eq(0).addClass("slide-animation");


/*ハンバーガーメニュー*/
$(function () {
  $('.hamburger').click(function () {
    $(this).toggleClass('active');

    if ($(this).hasClass('active')) {
      $('.globalMenuSp').addClass('active');
    } else {
      $('.globalMenuSp').removeClass('active');
    }
  });
});

/*これ元から入れといれくれよコピー元さん*/
$('.globalMenuSp a').on('click', function () {
  $('.globalMenuSp').removeClass('active');
  $('.hamburger').removeClass('active');
});


/*----------スキルバー-------*/
window.addEventListener('DOMContentLoaded', () => {

  // DOM要素を取得
  const skillEls = document.querySelectorAll('.skill');

  // カウントアップの設定
  const animationDuration = 2000;
  const frameDuration = 1000 / 60;
  const totalFrames = Math.round(animationDuration / frameDuration);
  const easeOut = t => t * (2 - t);
  const animateCountUp = el => {
    let frame = 0;
    const countTo = parseInt(el.innerHTML, 10);
    const counter = setInterval(() => {
      frame++;
      const progress = easeOut(frame / totalFrames);
      const currentCount = Math.round(countTo * progress);

      if (parseInt(el.innerHTML, 10) !== currentCount) {
        el.innerHTML = currentCount;
      }

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);
  };

  // Intersection observerに渡すコールバック関数
  const cb = function (entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const proficiencyVal = entry.target.dataset.proficiency;
        const skillBar = entry.target.querySelector('.skill-bar');
        const percentage = entry.target.querySelector('.skill-percentage');
        const countup = entry.target.querySelector('.countup');

        if (skillBar) {
          skillBar.style.width = proficiencyVal + '%';
        }
        if (percentage) {
          percentage.style.opacity = 1;
        }
        if (countup) {
          countup.textContent = proficiencyVal;
          animateCountUp(countup);
        }

        observer.unobserve(entry.target);
      }
    });
  };

  // Intersection observerに渡すオプション
  const options = {
    rootMargin: "-50px 0px"
  };

  // IntersectionObserver初期化
  const io = new IntersectionObserver(cb, options);
  io.POLL_INTERVAL = 100; // Polyfillの設定
  skillEls.forEach(el => {
    io.observe(el);
  });

});


/*スムーズスクロール*/
$(function () {
  // #で始まるアンカーをクリックした場合に処理
  $('a[href^="#"]').click(function () {
    // 移動先を50px上にずらす
    var adjust = 50;
    // スクロールの速度
    var speed = 400; // ミリ秒
    // アンカーの値取得
    var href = $(this).attr("href");
    // 移動先を取得
    var target = $(href == "#" || href == "" ? 'html' : href);
    // 移動先を調整
    var position = target.offset().top - adjust;
    // スムーススクロール
    $('body,html').animate({
      scrollTop: position
    }, speed, 'swing');
    return false;
  });
});

/*円形スキルバー*/
const progressItems = document.querySelectorAll('.progress-item');

const observeAction = (entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || entry.target.classList.contains('is-visible')) {
      return;
    }

    const percent = parseFloat(entry.target.dataset.percent);

    if (!Number.isFinite(percent)) {
      return false;
    }

    const duration = parseInt(entry.target.dataset.duration) || 1500;
    const eleProgressBar = entry.target.querySelector('.progress-bar');
    const eleProgressValue = entry.target.querySelector('.progress-value');
	
	if (!eleProgressBar || !eleProgressValue) {
      return;
    }
	
    const radius = eleProgressBar.getAttribute('r');
    const circumference = 2 * Math.PI * radius;
    const strokeDashOffset = Math.round(circumference - (circumference * percent) / 100);

    const startPosition = {
      'right': '0deg',
      'bottom': '90deg',
      'left': '180deg',
      'default': '-90deg'
    }[entry.target.dataset.startPosition] || '-90deg';

    const deciamlPointLength = (String(percent).split('.')[1] || '').length;
    const startTime = performance.now();
    let countValue = 0;

    const countUp = timestamp => {
      const elapsed = timestamp - startTime;
      countValue = (elapsed / duration) * percent;
      eleProgressValue.innerText = countValue.toFixed(deciamlPointLength);

      if (elapsed < duration) {
        requestAnimationFrame(countUp);
      } else {
        eleProgressValue.innerText = percent;
      }
    };

    entry.target.style.cssText = `
      --duration: ${duration}ms;
      --start-rotate: ${startPosition};
      --stroke-dashoffset: ${strokeDashOffset};
      --stroke-color: ${entry.target.dataset.strokeColor};
      --stroke-width: ${entry.target.dataset.strokeWidth};
    `;

    requestAnimationFrame(countUp);

    entry.target.classList.add('is-visible');
  });
};

const options = {
  rootMargin: "0px 0px -40% 0px"
};

const observer = new IntersectionObserver(observeAction, options);

progressItems.forEach(target => {
  observer.observe(target);
});