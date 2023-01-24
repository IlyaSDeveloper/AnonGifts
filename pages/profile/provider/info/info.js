import '../../../pages.js'
import 'https://unpkg.com/imask'
import { auth, db, endpoint, storageRef } from '../../../../firebase.js'

const userData = document.querySelector('.info-form')
const passwordChange = document.querySelector('.info-form_password-change')
const removeUser = document.querySelector('.info-form_account-remove')

auth.onAuthStateChanged(user => {
  if (user) {
    db.collection('users').doc(user.uid).onSnapshot(doc => {
      const recieveData = doc.data()
      if (recieveData) {
        userData['name'].value = recieveData.name || '',
          userData['lastname'].value = recieveData.lastname || '',
          userData['surname'].value = recieveData.surname || '',
          userData['gender'].value = recieveData.gender || '',
          userData['birthdate'].value = recieveData.birthdate || '',
          userData['email'].value = recieveData.email || '',
          userData['phone'].value = recieveData.phone || '',
          userData['city'].value = recieveData.city || '',
          userData['address'].value = recieveData.address || '',
          userData['passportID'].value = recieveData.passportID || ''

        userData['passportPhoto'].src = recieveData.photoURL || ''
      }
    })


    userData.addEventListener('input', () => {
      db.collection('users').doc(user.uid).set({
        name: userData['name'].value.trim(),
        lastname: userData['lastname'].value.trim(),
        surname: userData['surname'].value.trim(),
        gender: userData['gender'].value.trim(),
        birthdate: userData['birthdate'].value.trim(),
        //email: userData['email'].value.trim(),
        phone: userData['phone'].value.trim(),
        city: userData['city'].value.trim(),
        address: userData['address'].value.trim(),
        passportID: userData['passportID'].value.trim()
      }, { merge: true }).then(() => {
        console.log('success');
        // Update successful
        // ...
      }).catch((error) => {
        console.log(error, 'failure');
        // An error occurred
        // ...
      })


      userData['photoURL'].addEventListener('change', function (evt) {
        const file = evt.target.files[0] // upload the first file only
        const thisRef = storageRef.child(file.name)
        thisRef.put(file).then(res => {
          thisRef.getDownloadURL().then(url => {
            db.collection('users').doc(user.uid).set({
              photoURL: url
            }, { merge: true })
          }).catch(e => console.log('Get link error' + e))
          console.log('Загрузка завершена!');
        }).catch(e => console.log('Error' + e))
      })
    })

    passwordChange.onclick = () => {
      if (confirm('Вы уверены что хотите изменить ваш пароль?') === true) {
        const newPassword = prompt('Введите новый пароль: ').trim();
        if (newPassword) {
          db.collection('users').doc(user.uid).set({
            password: newPassword,
          }, { merge: true }).then(() => {
            alert('Пароль изменен! Ваш новый пароль: ' + newPassword)
            // Update successful
            // ...
          }).catch((error) => {
            console.log(error, 'failure');

            // An error occurred
            // ...
          })
        }
        else return null
      }
    }

    removeUser.onclick = () => {
      if (confirm(`Вы уверены что хотите удалить ваш аккаунт?`) === true) {
        db.collection('users').doc(user.uid).delete()
          .then(() => {
            const user = auth.currentUser
            user.delete().then(() => {
              // User deleted from auth.
            }).catch((error) => {
              // An error ocurred
              // ...
            });
            alert("Аккаунт успешно удален!")
            auth.signOut(auth)
            location = ('/')
          }).catch((error) => {
            console.error("Error removing document: ", error)
          });
      } else return null
    }

  } else {
    location = '/'
  }
})

//--------------------------Masks--------------------------------------

let phoneMask = IMask(userData['phone'], {
  mask: '+{7}(000)000-00-00',
  lazy: false
})
phoneMask.updateValue()

