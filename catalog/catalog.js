import { endpoint } from '../firebase.js'
const menuForm = document.querySelector('.dropdown-menu')
const productList = document.querySelector('.content__products-list')
const countElem = document.querySelector('.main__content-count')
const formClean = document.querySelector('.form-clean')

const cardTamplate = (prodId, photo, title, price) => { return `
<a href='./${prodId}' class='product-item'>
<div class='product-image'><img src="${photo}" /></div>
<div class="product-name">${title}</div>
<div class="product-price">${price.replace(/\B(?=(?:\d{3})+(?!\d))/g, ' ')} р.</div>
<div class="product-footer">
<button class="product-buy">В корзину</button>
</div>
</a>`}

let initialData = null
let filteredData = null

menuForm.addEventListener('change', e => {
    e.stopPropagation()
    sortProduct()
})
fetchProduct()


function sortProduct() {
    //sorting
    let productData = initialData.slice(0)
    switch (menuForm['sort'].value) {
        case 'new':
            filteredData = productData.sort(( a, b ) => new Date(b.updateTime) - new Date(a.updateTime))
            break
        case 'priceUp':
            filteredData = productData.sort(( a, b ) => a.fields.price.stringValue - b.fields.price.stringValue)
            break
        case 'priceDown':
            filteredData = productData.sort(( a, b ) => b.fields.price.stringValue - a.fields.price.stringValue)
            break
        default:
            filteredData = initialData
            break;
    }

    displayProduct(filteredData)
}

async function fetchProduct() {
    if (!initialData) {
    await axios.get(endpoint + 'products')
    .then(async response => {
        initialData = response.data.documents

    })}
    displayProduct(initialData)
}

formClean.addEventListener('click', () => {
    menuForm.reset()
    displayProduct(initialData)
})

function displayProduct(product) {
    productList.textContent = ''
    if (product) {
        if (countElem) {
            countElem.textContent = `найдено товаров: ${product.length}`
        }
        
        for (let i = 0; i < product.length; i++) {
            const {photo, name, price} = product[i].fields
            productList.insertAdjacentHTML('beforeend', cardTamplate(product[i].name.split('/')[product[i].name.split('/').length-1], 
            photo.arrayValue.values[0].stringValue, name.stringValue, price.stringValue))
        }
    }

}