import { signUp, signIn, resetPassword} from '../user.js'
import styles from './styles.css' assert { type: "css" }
    document.adoptedStyleSheets = [styles];


const userIcon = document.querySelector('.user')
const modal = document.querySelector('.modal')
const close = document.querySelector('.close')
const signUpForm = document.querySelector('.sign-up-container form')
const signInForm = document.querySelector('.sign-in-container form')
const passwordReset = document.querySelector('.password-reset')

const togglePassword = document.querySelectorAll('#togglePassword')
const signUpButton = document.querySelector('#signUp')
const signInButton = document.querySelector('#signIn')
const container = document.querySelector('#container')

signUpButton.addEventListener('click', () =>
container.classList.add('right-panel-active'))

signInButton.addEventListener('click', () =>
container.classList.remove('right-panel-active'))

userIcon.addEventListener('click', () => {
    if (!userIcon.href) {
        modal.style.display = 'block'
        document.body.style.overflow = 'hidden'
    }
})

close.addEventListener('click', () => {
    onClose()
})

passwordReset.addEventListener('click', () => {
    resetPassword()
})

function onClose() {
    document.body.style.overflow = 'auto'
    modal.style.display = 'none'
}

togglePassword.forEach(toggle => {
    toggle.addEventListener('click', () => {
        console.dir(toggle,'hjn');
        showPassword(toggle, toggle.previousElementSibling)
    })    
});


function showPassword (toggle, password) {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password'
    password.setAttribute('type', type)
    // toggle icon
    toggle.classList.toggle('fa-eye')
    toggle.classList.toggle('fa-eye-slash')
}

signIn(signInForm)
signUp(signUpForm)

