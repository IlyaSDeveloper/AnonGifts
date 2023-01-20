import { auth, db } from './firebase.js'

export function signIn(logInForm) {
    logInForm.addEventListener('submit', e => {
        e.preventDefault()

        const email = logInForm['email'].value
        const password = logInForm['password'].value

        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                logInForm.reset()
                location = './pages/profile/provider/info'
            }).catch((error) => {
                alert('«Неверные логин или пароль»')
            })
    })
}

export function signUp(logOnForm) {
    logOnForm.addEventListener('submit', e => {
        e.preventDefault()
        const name = logOnForm['name'].value.trim()
        const email = logOnForm['email'].value.trim()
        const password = logOnForm['password'].value.trim()
        auth.createUserWithEmailAndPassword(email, password)
            .then((cred) => {
                return db.collection('users').doc(cred.user.uid).set({
                    email, password, name
                }).then(() => {
                    console.log('success')
                    auth.currentUser.sendEmailVerification()
                        .then(() => {
                            alert('Регистрация успешна, вам было отправлено письмо для подтверждения')
                            logOnForm.reset()
                        });
                })
                    .catch((err) => {
                        console.log(err.message)
                    })
            })
            .catch((err) => {
                console.log(err.message)
            })
    })
}


export const logOut = () => {
    const answer = confirm('Вы уверены что хотите выйти?')
    if (answer) {
        auth.signOut(auth).then(() => {
            location = '/'
        }).catch((error) => {
            console.log(error, 'Что-то не так')
        });
    } else return null

    //localStorage.removeItem('user')
}

export const resetPassword = () => {
    const email = prompt('Для восстановления пароля введите ваш Email')
    if (email) {
    auth.sendPasswordResetEmail(email)
        .then(() => {
            alert('Письмо для сброса пароля отправлено.')
            //Password reset email sent!
        }).catch((error) => {
            alert('Пользователь с указанной почтой не найден')
        })
    }
}