const element =  document.getElementsByClassName('err')[0]
    const inputs = document.querySelectorAll('input');

    inputs.forEach((item)=> {
      item.addEventListener('click', () => {
        element.style.display = 'none'
      })

    })  
    
    