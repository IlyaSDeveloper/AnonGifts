import '../../../pages.js'
import { auth, db, endpoint } from '../../../../firebase.js'

const userData = document.querySelector('.info-form')
const passwordChange = document.querySelector('.info-form_password-change')
const removeUser = document.querySelector('.info-form_account-remove')
const passportPhoto = document.querySelector('.info-passport')

auth.onAuthStateChanged(user => {
  if (user) {
    axios.get(endpoint + 'users/' + user.uid)
      .then(response => {
        const recieveData = response.data.fields
        if (recieveData) {  
          userData['name'].value = recieveData.name?.stringValue || '',
          userData['lastname'].value = recieveData.lastname?.stringValue || '',
          userData['surname'].value = recieveData.surname?.stringValue || '',
          userData['gender'].value = recieveData.gender?.stringValue || '',
          userData['birthdate'].value = recieveData.birthdate?.stringValue || '',
          userData['email'].value = recieveData.email?.stringValue || '',
          userData['phone'].value = recieveData.phone?.stringValue || '',
          userData['city'].value = recieveData.city?.stringValue || '',
          userData['address'].value = recieveData.address?.stringValue || '',
          userData['passportID'].value = recieveData.passportID?.stringValue || ''

          userData['passportPhoto'].src = recieveData.photoURL?.stringValue || ''
        }
      })
      .catch(error => {
        console.log(error);
      })


    userData.addEventListener('change', () => {
      console.log(userData['photoURL'].files[0].name)
      db.collection('users').doc(user.uid).set({
        name: userData['name'].value.trim(),
        lastname: userData['lastname'].value.trim(),
        surname: userData['surname'].value.trim(),
        gender: userData['gender'].value.trim(),
        birthdate: userData['birthdate'].value.trim(),
        email: userData['email'].value.trim(),
        phone: userData['phone'].value.trim(),
        city: userData['city'].value.trim(),
        address: userData['address'].value.trim(),
        passportID: userData['passportID'].value.trim(),
        photoURL: userData['photoURL'].files[0]
        
      }, { merge: true }).then(() => {
        console.log('success');
        // Update successful
        // ...
      }).catch((error) => {
        console.log(error, 'failure');
        // An error occurred
        // ...
      })
      console.log(firebase.storage().ref(),'conf');
      // userData['photoURL'].addEventListener('change', function(evt) {
      //   let firstFile = evt.target.files[0] // upload the first file only
      //   let locationRef = storage.ref('images/' + firstFile.name)
      //   location.put(file)
      //   console.log('sended');
        // let uploadTask = storageRef.put(firstFile)
    // })
      // storageRef.put(file).then((snapshot) => {
      //   console.log('Uploaded a blob or file!');
      // });
      // photoURL: userData['photoURL'].value
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