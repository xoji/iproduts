document.addEventListener('DOMContentLoaded' , () => {
    let backedIcon = document.querySelector('.backed-block-icon')
    let backedNav = document.querySelector('.basked_item_block')
    let collapse = document.querySelector('.icon')
    backedIcon.addEventListener('click' , () => {
        backedNav.classList.add('active-nav')
    });
    collapse.addEventListener('click' , () => {
        backedNav.classList.remove('active-nav')
    });



    const counters = document.querySelectorAll('[data-counter]')

    if (counters) {
        counters.forEach( counter => {
            counter.addEventListener('click' , e=> {
                const target = e.target;
                if (target.closest('.counter__btn')){
                    let value = parseInt(target.closest('.product-number').querySelector('input').value);
                    let clear_product = document.querySelector('.delete-product');
                    if (target.classList.contains('plus')){
                        value++;
                    }else {
                        --value;
                        if (value <= 1) {
                            value = 1;
                        }
                    }
                    target.closest('.product-number').querySelector('input').value = value;
                }
            })
        })
    }

    document.querySelectorAll('.select_des_btn').forEach((el) => {
        el.addEventListener('click', () => {
            let content = el.nextElementSibling;
            if (content.style.maxHeight) {
                document.querySelectorAll('.select_product_text_des').forEach((el) => el.style.maxHeight = null)
            }else {
                document.querySelectorAll('.select_product_text_des').forEach((el) => el.style.maxHeight = null)
                content.style.maxHeight = content.scrollHeight + 'px'
            }
        })
    });

    const nav = document.querySelector('.product-order')
    const menu = document.querySelector('.modal')
    nav.addEventListener('click' , (event) =>{
        event.preventDefault()
        menu.classList.add('active_modal_box')
        document.body.style.overflow = 'hidden'
    })
    if (menu) {
        menu.addEventListener('click' , (event) => {
            if (event.target.classList.contains('modal')){
                menu.classList.remove('active_modal_box')
                document.body.style.overflow = 'visible'
            }
        });
    }

    const sliders = document.querySelectorAll('.swiper');
    const single = document.querySelector('.single-swiper');

    if (sliders && sliders.length) {
        for (let i=0;i<sliders.length;i++) {
            new Swiper(`.swiper_${i}` ,{
                direction: 'horizontal',
                slidesPerView: 1,
                slidesPerGroup: 1,
                loop: true,
                effect: 'slide',
                navigation: {
                    nextEl: `.swiper_${i} .btn-next`,
                    prevEl: `.swiper_${i} .btn-prev`,
                },
                pagination:{
                    clickable: true,
                    enabled: true,
                    type: "bullets",
                    bulletActiveClass: "slider-dots-active",
                    el: `.swiper_${i} .dots-container-js`,
                    bulletClass: "s-dot",
                }
            });
        }
    }

    if (single) {
        new Swiper('.single-swiper' ,{
            direction: 'horizontal',
            slidesPerView: 1,
            slidesPerGroup: 1,
            loop: true,
            effect: 'slide',
            navigation: {
                nextEl: '.btn-next',
                prevEl: '.btn-prev',
            },
            thumbs:{
                swiper:{
                    el: '.image-mini-slider',
                    slidesPerView:3
                }
            }
        });
    }
});