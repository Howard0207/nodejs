window.onload = () => {
  let toLogin = document.querySelector('.toLogin')
  let toReg = document.querySelector('.toReg')
  let signIn = document.querySelector('.signIn')
  let signUp = document.querySelector('.signUp')
  let header = document.querySelector('.header-content')
  toLogin.onclick = () => {
    signIn.style.display = 'block'
    signUp.style.display = 'none'
    header.style.backgroundImage = 'url(/public/imgs/base/signIn.png)'
    header.style.backgroundRepeat = 'no-repeat'
  }

  toReg.onclick = () => {
    signIn.style.display = 'none'
    signUp.style.display = 'block'
    header.style.backgroundImage = 'url(/public/imgs/base/signUp.png)'
    header.style.backgroundRepeat = 'no-repeat'
  }
}