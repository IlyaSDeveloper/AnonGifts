import { endpoint } from '../firebase.js'
const menuForm = document.querySelector('.dropdown-menu')
const productList = document.querySelector('.content__products-list')
const countElem = document.querySelector('.main__content-count')

let filters = {
    new: false,
    priceUp: false,
    priceDown: false,
    popular: false,
}

const cardTamplate = (prodId, photo, title, price) => { return `
<a href='./${prodId}' class='product-item'>
<div class='product-image'><img src="${photo}" loading='lazy' /></div>
<div class="product-name">${title}</div>
<div class="product-price">${price.replace(/\B(?=(?:\d{3})+(?!\d))/g, ' ')} р.</div>
<div class="product-footer">
<button class="product-buy">В корзину</button>
</div>
</a>`}

menuForm.addEventListener('change', e => {
    e.stopPropagation()
})

fetchProduct()


async function fetchProduct() {
    axios.get(endpoint + 'products')
    .then(async response => {
        let recieveProductData = response.data

        if (countElem) {
            countElem.textContent = `найдено товаров: ${recieveProductData.documents.length}`
        }

        //sorting
        console.dir(menuForm['sort'].value);
        switch (menuForm['sort'].value) {
            case 'new':
                recieveProductData.documents.sort(( a, b ) => new Date(a.updateTime) - new Date(b.updateTime))
                break
            case 'priceUp':
                recieveProductData.documents = recieveProductData.documents.sort(( a, b ) => a.fields.price.stringValue - b.fields.price.stringValue)
                break
            case 'priceDown':
                recieveProductData.documents = recieveProductData.documents.sort(( a, b ) => b.fields.price.stringValue - a.fields.price.stringValue)
            default:
                break;
        }

        function clear() {
            document.querySelector('input[value="all"]').checked = true
        }
        fetchProduct()
        productList.textContent = ''
        
        for (let i = 0; i < recieveProductData.documents.length; i++) {
            displayProduct(recieveProductData.documents[i])
        }
    })
}

function displayProduct(product) {
    //  console.log(product);
    const {photo, name, price, count} = product.fields
    productList.insertAdjacentHTML('beforeend', cardTamplate(product.name.split('/')[product.name.split('/').length-1], 
    photo.stringValue, name.stringValue, price.stringValue))
}