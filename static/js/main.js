
let product = {};
let products = [];


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

    const name = document.querySelector('.modal_name');
    const phone = document.querySelector('.modal_phone');
    const modalSubmit = document.querySelector('.modal_submit');

    if (name && phone && modalSubmit) {
        modalSubmit.addEventListener('click', (e) => {
            e.preventDefault();
            if (name.value && phone.value) {
                axios.post('https://iproduct.uz/send-order', {
                    products,
                    name: name.value,
                    phone: phone.value
                }).then((res) => {
                    if (res.data.status) {
                        name.value = '';
                        phone.value = '';
                        const menu = document.querySelector('.modal');
                        if (menu) {
                            menu.classList.remove('active_modal_box');
                            document.body.style.overflow = 'visible';
                        }
                    }
                });
            }
        });
    }


    const bas = localStorage.getItem('basket');
    const basketContainer = document.querySelector('.basked_body_block');

    function createBasket() {
        basketContainer.innerHTML = '';

        if (products.length) {
            for (let i = 0; i < products.length; i++) {
                const p = products[i];
                const container = document.createElement('div');
                container.classList.add('basked-card');
                //
                const content = document.createElement('div');
                content.classList.add('basked-content-block')
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('product-img');
                const img = document.createElement('img');
                img.classList.add('product-img-item');
                img.setAttribute('src', p.images[0].link);
                imgContainer.appendChild(img);
                content.appendChild(imgContainer);
                const pInfo = document.createElement('div');
                pInfo.classList.add('product-price', 'mar-l');
                const name = document.createElement('p');
                const price = document.createElement('p');
                name.classList.add('product-text');
                price.classList.add('product-text');
                name.innerHTML = p.name;
                price.innerHTML = `${p.price} Сум`;
                pInfo.appendChild(name);
                pInfo.appendChild(price);
                content.appendChild(pInfo);
                container.appendChild(content);
                //
                const actions = document.createElement('div');
                actions.classList.add('product-number');
                const dec = document.createElement('button');
                dec.classList.add('product-num-text', 'counter__btn', 'num-product', 'minus');
                dec.innerHTML = '-';
                const iContainer = document.createElement('div');
                iContainer.classList.add('counter-input');
                const countInput = document.createElement('input');
                countInput.classList.add('product-num-text', 'counter__val');
                countInput.setAttribute('type', 'text');
                countInput.setAttribute('disabled', 'true');
                countInput.value = p.count;
                iContainer.appendChild(countInput);
                const inc = document.createElement('button');
                inc.classList.add('product-num-text', 'counter__btn', 'num-product', 'plus');
                inc.innerHTML = '+';
                inc.addEventListener('click', (e) => {
                    e.preventDefault();
                    products[i].count = p.count + 1;
                    localStorage.setItem('basket', JSON.stringify(products));
                    createBasket();
                });
                dec.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (p.count > 1) {
                        products[i].count = p.count - 1;
                        localStorage.setItem('basket', JSON.stringify(products));
                        createBasket();
                    }
                });
                const delContainer = document.createElement('div');
                delContainer.classList.add('delete-product-icon');
                delContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="delete-icon-item"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path></svg>';
                delContainer.addEventListener('click', (e) => {
                    e.preventDefault();
                    products = products.filter(prod => {
                        return prod.id !== p.id;
                    });
                    localStorage.setItem('basket', JSON.stringify(products));
                    createBasket();
                })
                actions.appendChild(dec);
                actions.appendChild(iContainer);
                actions.appendChild(inc);
                actions.appendChild(delContainer);
                container.appendChild(actions);
                basketContainer.appendChild(container);
                const subContainer = document.createElement('div');
                subContainer.classList.add('basked-nav-panel');
                const submit = document.createElement('button');
                submit.classList.add('p-btn', 'product-order');
                submit.innerHTML = 'Купить';
                submit.addEventListener('click', (event) =>{
                    event.preventDefault()
                    document.querySelector('.modal').classList.add('active_modal_box');
                    document.body.style.overflow = 'hidden'
                });
                subContainer.appendChild(submit);
                basketContainer.appendChild(subContainer);
            }
        } else {
            const span = document.createElement('span');
            span.classList.add('basked-body-text');
            span.innerHTML = 'Корзина пуста';
            basketContainer.appendChild(span);
        }
    }
    if (bas) {
        products = JSON.parse(bas);
        const btn = document.createElement('button');
        const menu = document.querySelector('.modal')
        if (menu) {
            menu.addEventListener('click' , (event) => {
                if (event.target.classList.contains('modal')){
                    menu.classList.remove('active_modal_box')
                    document.body.style.overflow = 'visible'
                }
            });
        }
        createBasket();
    } else {
        localStorage.setItem('basket', JSON.stringify(products));
    }


    const input = document.querySelector('#prod_as_string');

    if (input) {
        product = JSON.parse(input.value);
        product.count = 1;
        input.remove();
    }

    const inc = document.querySelector('.post-single-btn-inc');
    const dec = document.querySelector('.post-single-btn-dec');
    const s_input=  document.querySelector('.post-single-input');

    if (inc && dec && s_input) {
        inc.addEventListener('click', () => {
            const val = parseInt(s_input.value);
            s_input.value = val + 1;
            product.count = val + 1;
        });
        dec.addEventListener('click', () => {
            const val = parseInt(s_input.value);
            if (val > 1) {
                s_input.value = val - 1;
                product.count = val - 1;
            }
        });
    }

    const b_btn = document.querySelector('.add-to-basket');

    if (b_btn) {
        b_btn.addEventListener('click', (e) => {
            e.preventDefault();
            const candidate = products.filter(p => {
                return p.id === product.id
            });

            if (!candidate.length) {
                products.push(product);
                localStorage.setItem('basket', JSON.stringify(products));
                createBasket();
            }
        });
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