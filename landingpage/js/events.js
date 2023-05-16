// Navbar
const navbar = document.getElementById('navbar');
const navLinks = document.getElementsByClassName('nav-link');

window.addEventListener('scroll', () => {
	const scrollTop = window.scrollY;
	if (scrollTop > 50) {
		navbar.classList.add('fixed-top', 'bg-light');
	} else {
		navbar.classList.remove('fixed-top', 'bg-light');
	}
});

for (let i = 0; i < navLinks.length; i++) {
	navLinks[i].addEventListener('click', () => {
		for (let j = 0; j < navLinks.length; j++) {
			if (j === i) {
				navLinks[i].classList.add('active');
				continue;
			}
			navLinks[j].classList.remove('active');
		}
	});
}

// Counters
const counters = document.getElementsByClassName('counter');

const count = (element, intialCount, counter = 0) => {
	element.innerText = counter;
	if (intialCount === counter) {
		return;
	}
	setTimeout(() => {
		if (counter + intialCount / 15 > intialCount) {
			count(element, intialCount, intialCount);
			return;
		}
		count(element, intialCount, Math.round(counter + intialCount / 15));
	}, 50);
};

const observer = new IntersectionObserver((entries) => {
	for (let i = 0; i < entries.length; i++) {
		if (entries[i].isIntersecting) {
			count(entries[i].target, parseInt(entries[i].target.innerText), 0);
			observer.unobserve(entries[i].target);
		}
	}
});

for (let i = 0; i < counters.length; i++) {
	observer.observe(counters[i]);
}

// Features Carousel
const carousel = document.getElementById('features-carousel');
const prevtBtn = document.getElementsByClassName(
	'features-carousel__control--prev'
)[0];
const nextBtn = document.getElementsByClassName(
	'features-carousel__control--next'
)[0];

const carouselItemCount = carousel.childElementCount;
let isAnimating = false;
const carouselIndex = 0;

const setActive = () => {
	carousel.children[carouselIndex].classList.remove(
		'features-carousel__item--active'
	);
	carousel.children[carouselIndex + 1].classList.add(
		'features-carousel__item--active'
	);
	carousel.children[carouselIndex + 2].classList.remove(
		'features-carousel__item--active'
	);
};

const prev = (index) => {
	isAnimating = true;
	if (index === 0) {
		carousel.insertBefore(
			carousel.lastElementChild.cloneNode(true),
			carousel.firstElementChild
		);
		for (let i = carouselIndex; i <= carouselIndex + 3; i++) {
			carousel.children[i].style.transition = 'none';
			carousel.children[i].style.transform =
				'translateX(calc(-100% - 5rem))';
		}
		setTimeout(() => {
			for (let i = carouselIndex; i <= carouselIndex + 3; i++) {
				carousel.children[i].style.transition = 'transform 0.3s ease';
				carousel.children[i].style.transform = 'translateX(0)';
			}
			setTimeout(() => {
				carousel.lastElementChild.remove();
				setActive();
				isAnimating = false;
			}, 300);
		}, 300);
	}
};

const next = (index) => {
	isAnimating = true;
	if (index === carouselItemCount - 3) {
		carousel.appendChild(carousel.firstElementChild.cloneNode(true));
		setTimeout(() => {
			for (let i = carouselIndex; i <= carouselIndex + 3; i++) {
				carousel.children[i].style.transition = 'transform 0.3s ease';
				carousel.children[i].style.transform =
					'translateX(calc(-100% - 5rem))';
			}
			setTimeout(() => {
				carousel.firstElementChild.remove();
				for (let i = carouselIndex; i < carouselIndex + 3; i++) {
					carousel.children[i].style.transition = 'none';
					carousel.children[i].style.transform = 'translateX(0)';
				}
				setActive();
				isAnimating = false;
			}, 300);
		}, 300);
	}
};

prevtBtn.addEventListener('click', () => {
	if (!isAnimating) {
		prev(carouselIndex);
	}
});
nextBtn.addEventListener('click', () => {
	if (!isAnimating) {
		next(carouselIndex);
	}
});

setInterval(() => {
	if (!isAnimating) {
		next(carouselIndex);
	}
}, 10 * 1000); // 10 seconds
