
if (!customElements.get("swiper-slider")) {
    class SwiperSlider extends HTMLElement {
        constructor() {
            super();

            var _this = this;
            this.isThumbnails = false;

            // swiper container
            this.swiperContainer = this.querySelector(".swiper-container");
            this.config = this.swiperContainer?.dataset || {};

            // Check thumbnails available or not
            if (this.config.thumbs) {
                this.isThumbnails = true;
            }

            // wait for swiper slider
            this.waitForSwiper(function () {
                // If thumbnails available
                _this.initSwiperWithThumbs(_this.swiperContainer);
            });
        }

        // Wit for swiper slider
        waitForSwiper(trigger) {
            var interval = setInterval(function () {
                if (typeof Swiper !== "undefined") {
                    clearInterval(interval);
                    trigger();
                }
            }, 50);
            setTimeout(function () {
                clearInterval(interval);
            }, 15000);
        }

        // Thumbnail configuration
        thumbConfig(thumbConfig) {
            var config = {
                slidesPerView: 3,
                spaceBetween: 12,
                centeredSlides: false,
                grabCursor: true,
                freeMode: false,
                mousewheel: false,
                slideToClickedSlide: true,
                slidesPerColumn: 1,
                slidesPerColumnFill: "column",
                loop: true,
                a11y: false,
                keyboard: {
                    enabled: true,
                },
                direction: "horizontal",
            };

            // Loop
            if (thumbConfig.loop == "true") {
                config.loop = true;
            } else {
                config.loop = false;
            }

            // Slide per view
            if (thumbConfig?.slidesPerView > 1) {
                config.slidesPerView = thumbConfig.slidesPerView;
            }

            // direction
            if (thumbConfig.direction) {
                config.direction = thumbConfig.direction;
            }

            // Breakpoints
            if (thumbConfig.breakpoints) {
                config.breakpoints = JSON.parse(thumbConfig.breakpoints);
            }

            //autoplay
            if (thumbConfig.autoplay == "true") {
                config.autoplay = {
                    delay: thumbConfig.delay || 5000,
                };
            }
            // allowTouchMove

            if (thumbConfig.allowTouchMove == "true") {
                config.allowTouchMove = true;
            } else {
                config.allowTouchMove = false;
            }

            return config;
        }

        // Gallery slider configuration
        galleryConfiguration(galleryConfig, thumbs) {
            var config = {
                slidesPerView: 1,
                spaceBetween: 12,
                centeredSlides: false,
                loop: true,
                a11y: false,
                direction: "horizontal",
                thumbs: {},
                pagination: {
                    el: "",
                    clickable: true,
                },
                navigation: {
                    nextEl: "",
                    prevEl: "",
                },
                on: {
                    init: function (resp) {

                        resp.el.parentElement.parentElement.classList.add('slideCount-' + resp.slides.length);

                    }, 
                    slideChange: function (e, i) {
                        function videoClick() {
                            if (document.querySelectorAll('.newbornNestVideoWrapper video')) {
                                document.querySelectorAll('.newbornNestVideoWrapper video').forEach(function (video) {
                                    video.pause();
                                });
                            }

                            if (document.querySelectorAll('.VideoSliderContainer video') && e.el.closest('.VideoSliderContainer')) {
                                document.querySelectorAll('.VideoSliderContainer video').forEach(function (video) {
                                    video.pause();
                                });
                                document.querySelectorAll('.newbornNestVideoWrapper').forEach(function (item) {
                                    item.classList.remove('playing');
                                });
                                document.querySelector('.VideoSliderContainer .swiper-wrapper .swiper-slide:nth-child(' + (e.activeIndex + 1) + ') .newbornNestVideoWrapper').classList.add('playing');
                                var currentVideo = document.querySelector('.VideoSliderContainer .swiper-wrapper .swiper-slide:nth-child(' + (e.activeIndex + 1) + ') video');
                                if (currentVideo) {
                                    currentVideo.volume = .5;
                                    currentVideo.play();
                                }
                            }

                            // Resetting the 'data-clicked' attribute after the actions are performed
                            document.querySelectorAll('.videoSliderSection .slider-navigation .swiper-button-prev, .videoSliderSection .slider-navigation .swiper-button-next, .newbornNestVideoWrapper video').forEach(function (element) {
                                element.removeAttribute('data-clicked');
                            });
                        }

                        // Adding event listeners with a check for the 'data-clicked' attribute
                        document.querySelector('.videoSliderSection .slider-navigation .swiper-button-prev').addEventListener('click', function (event) {
                            if (!this.getAttribute('data-clicked')) {
                                this.setAttribute('data-clicked', 'true');
                                videoClick();
                            }
                        });

                        document.querySelector('.videoSliderSection .slider-navigation .swiper-button-next').addEventListener('click', function (event) {
                            if (!this.getAttribute('data-clicked')) {
                                this.setAttribute('data-clicked', 'true');
                                videoClick();
                            }
                        });

                        document.querySelector('.newbornNestVideoWrapper video').addEventListener('click', function (event) {
                            if (!this.getAttribute('data-clicked')) {
                                this.setAttribute('data-clicked', 'true');
                                videoClick();
                            }
                        });
                    }

                }
            };

            // Pagination
            if (galleryConfig.dots) {
                config.pagination.el = galleryConfig.pagination;
            }
            // Loop
            if (galleryConfig.loop == "true") {
                config.loop = true;
            } else {
                config.loop = false;
            }

            // If prev/next element
            if (galleryConfig?.nav) {
                config.navigation.prevEl = galleryConfig.prevEl;
                config.navigation.nextEl = galleryConfig.nextEl;
            }

            // direction
            if (galleryConfig.direction) {
                config.direction = galleryConfig.direction;
            }

            // per view
            if (galleryConfig?.slidesPerView > 1) {
                config.slidesPerView = thumbConfig.slidesPerView;
            }

            // if thumbs
            if (thumbs) {
                config.thumbs.swiper = thumbs;
            }

            //autoplay
            if (galleryConfig.autoplay == "true") {
                config.autoplay = {
                    delay: galleryConfig.delay || 4000,
                };
            }

            // Breakpoints
            if (galleryConfig.breakpoints) {
                config.breakpoints = JSON.parse(galleryConfig.breakpoints);
            }


            // allowTouchMove
            if (galleryConfig.allowTouchMove == "true") {
                config.allowTouchMove = true;
            } else {
                config.allowTouchMove = false;
            }

            return config;
        }

        // remove duplicate slider
        removeDuplicateSlides(slides) {
            slides.forEach(function (slide) {
                if (slide.classList.contains("swiper-slide-duplicate")) {
                    slide.remove();
                }
            });
        }

        // Initlize swiper slider with thums
        initSwiperWithThumbs() {
            // Thumbnails
            var sliderThumbs = document.querySelector(`${this.config["thumbsId"]}`);

            // Thumbnails initialize
            var thumbs;
            if (sliderThumbs) {
                var thumbConfig = sliderThumbs.dataset;
                thumbConfig = this.thumbConfig(thumbConfig);
                // Thumbnails
                thumbs = new Swiper(sliderThumbs, thumbConfig);
            }

            if (this.swiperContainer) {
                var galleryConfig = this.galleryConfiguration(this.config, thumbs);

                // Add click event listener to the swiper slider
                var gallerySl = new Swiper(this.swiperContainer, galleryConfig);


                // Add an event listener to the gallery swiper's 'slideChange' event
                if (thumbs) {
                    thumbs.params.slideToClickedSlide = true;

                    // Remove loop
                    var totalSlides = 0;
                    thumbs.slides.forEach(function (slide) {
                        if (!slide.classList.contains("swiper-slide-duplicate")) {
                            totalSlides++;
                        }
                    });

                    if (totalSlides === thumbs.params.slidesPerView) {
                        thumbs.params.loop = false;
                        gallerySl.params.loop = false;
                        this.removeDuplicateSlides(thumbs.slides);
                        this.removeDuplicateSlides(gallerySl.slides);
                        thumbs.update();
                        gallerySl.update();
                    }

                    gallerySl.on("slideChange", function () {
                        if (thumbs.params.slidesPerView === 1.5) {
                            // Get the active slide index of the gallery swiper
                            var activeSlideIndex = gallerySl.activeIndex;

                            // Calculate the corresponding active thumbnail slide index
                            var activeThumbnailIndex = Math.floor(activeSlideIndex * 1.5);

                            if (activeThumbnailIndex - activeSlideIndex > 1) {
                                activeThumbnailIndex = activeThumbnailIndex - 1;
                            }

                            // Slide to the active thumbnail slide to make it fully visible
                            thumbs.slideTo(activeThumbnailIndex);
                        }
                    });
                }
            }
        }
    }
    customElements.define("swiper-slider", SwiperSlider);
}