import '../../../pages.js'
import { auth, db, endpoint, storageRef } from '../../../../firebase.js'
import 'https://unpkg.com/imask'

const createProductForm = document.querySelector('.create-product-form')
const imageBox = document.querySelector('.image-box')

auth.onAuthStateChanged(async user => {
    if (user) {
        if (createProductForm) {
            let photoUrls = []
            console.log('523');
            createProductForm['photo'].addEventListener('change', function (elem) {
                const files = elem.currentTarget.files
                for (let i = 0; i < files.length; i++) {
                    const thisRef = storageRef.child(files[i].name)
                    thisRef.put(files[i]).then(res => {
                        thisRef.getDownloadURL().then(url => {
                            photoUrls.push(url)
                            imageBox.insertAdjacentHTML('beforeend',`<img src="${url}" class="img"
                             alt="${files[i].name.split('.')[0]}" />`)
                        }).catch(e => console.log('Get link error' + e))
                        console.log('Загрузка завершена!');
                    }).catch(e => console.log('Error' + e))
                }
            })

            console.log(photoUrls);
            createProductForm.addEventListener('submit', e => {
                e.preventDefault();
                db.collection('products').add({
                    name: createProductForm['product-label'].value.trim(),
                    shortDesc: createProductForm['short-desc'].value.trim(),
                    fullDesc: createProductForm['full-desc'].value.trim(),
                    count: createProductForm['count'].value.trim(),
                    price: createProductForm['price'].value.trim(),
                    providerId: user.uid,
                    // photo: createProductForm['photo'].files[0].name,
                    photo: photoUrls
                    //video
                }).then(async (prod) => {
                    createProductForm.reset()
                    console.log('Product added to collection')
                    alert('Продукт добавлен')
                }).catch((error) => {
                    console.log(error, 'failure')
                    // An error occurred
                    // ...
                })

            })
        } else console.log('form not found');
    }
})

// let priceMask = IMask(createProductForm['price'], {
//     mask: Number,
//     scale: 2,
//     thousandsSeparator: ' ',
//     normalizeZeros: true,
//     padFractionalZeros: true,
// });
// priceMask.updateValue()
