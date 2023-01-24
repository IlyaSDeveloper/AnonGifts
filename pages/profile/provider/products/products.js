import '../../../pages.js'
import { auth, db, endpoint } from '../../../../firebase.js'

const productBox = document.querySelector('.content-list')

const cardTamplate = (photo, title, price, count) => { return `
<div class='product-item'>
<div class='product-image'><img src="${photo}" /></div>
<div class="product-name">${title}</div>
<div class="product-price">${price.replace(/\B(?=(?:\d{3})+(?!\d))/g, ' ')} р.</div>
<div class="product-footer">
    <p class="ptoduct-count">осталось ${count} шт.</p>
    <div class="product-actions">
        <button class="product-edit"></button>
        <button class="product-delete"></button>
    </div>
</div>
</div>`}

document.addEventListener('DOMContentLoaded', async () => {
    auth.onAuthStateChanged(async user => {
        if (user) {
            const userCart = await fetchProdByUser(user)

        }
    })
})

// async function fetchProdByUser(user) {
//     await axios.get(endpoint + 'users/' + user.uid)
//     .then(async response => {
//         const recieveData = response.data.fields
//         await recieveData.product.arrayValue.values.forEach(prodId => {
//             if (prodId) {
//                 fetchProduct(prodId)
//             }
//         })
//     })
// }

async function fetchProdByUser(user) {
    await axios.get(endpoint + 'products/')
    .then(response => {
        const recieveProductData = response.data.documents
        recieveProductData.forEach(prod => {
            if (prod.fields.providerId.stringValue === user.uid) {
                displayProduct(prod)
            }
        });

    })
}

function displayProduct(product) {
    const {photo, name, price, count} = product.fields
    productBox.insertAdjacentHTML('beforeend', cardTamplate(photo.arrayValue.values[0].stringValue, name.stringValue,
         price.stringValue, count.stringValue))
}