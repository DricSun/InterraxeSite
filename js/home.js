
const commandesListe = ['/help', '/help-commande' , '/coordonnée', '/date']

const button = document.getElementById('button');

const displayList = document.getElementById('list-commande')

const boutonRouge1 = document.getElementById('bouton-rouge1')

const error = document.getElementById('error')

const listCoordonnée = ['/coordonnée-x', '/coordonnée-y', '/coordonnée-z']

const date = '15/05/91';

let compt = 0 

const valueCoordonnées = [202 , 523, 496]


let secondButton = document.getElementById('second-button');

let firstButton = document.getElementById('first-button');

let thirdButton = document.getElementById('third-button');

let fourthButton = document.getElementById('fourth-button')

let bravo = document.getElementById('bravo')


button.addEventListener('click', getMessage);

// closeButton.addEventListener('click', () =>{
//     commandesListe.style.display = 'none'
//     console.log('test')
// })

const buttonValidate = document.getElementById('decollage')

const etatButton = document.querySelectorAll('.changeButton')

const closeButton =document.getElementById('close-list')

const buttonJV = document.getElementById('planete4')

const button3d = document.getElementById('planete3')

const buttonCréa = document.getElementById('planete2')

const buttonCdeb = document.getElementById('planete1')

const verifIsGreen1 = false

const verifIsGreen2 = false

const verifIsGreen3 = false

const verifIsGreen4 = false




buttonJV.addEventListener('click' , () => {
   window.open('jvHome.html')
})

button3d.addEventListener('click' , () => {
    window.open('3d.html')
 })

 buttonCréa.addEventListener('click' , () => {
    window.open('crea.html')
 })

 buttonCdeb.addEventListener('click' , () => {
    window.open('cdeb.html')
 })





// button.addEventListener('keyup' , getMessage);

// buttonValidate.addEventListener('click' , verifIfLightsisGreen);

function getMessage(){

    

    let textUser = document.getElementById('message').value

    if(textUser === commandesListe[0]){
       displayList.style.display = 'flex'
    }
    else if (textUser === commandesListe[1]){
        error.innerHTML = 'Pour entrer une nouvelle coordonnée faire : /coordonnées-x valeur <br>Pour entrer une nouvelle date faire : /date jour/mois/année'
        error.style.color = 'white' 
        error.style.fontFamily =  'Cairo Regular'; 
    }else if(textUser === ''){
        error.innerHTML = 'Veuillez remplir le champ'
        error.style.color = 'white'
        error.style.fontFamily =  'Cairo Regular'; 
    } 
    
    else if(textUser === listCoordonnée[0] + ' ' +valueCoordonnées[0]){
        firstButton.innerHTML = '<img id="bouton-rouge1" src="/asset/bouton_vert.png" alt="bouton-rouge"/>'
        // compt += 1
        // console.log(compt)
        // verifIsGreen1 = true
    }
    else if(textUser === listCoordonnée[1] + ' ' + valueCoordonnées[1]){
        secondButton.innerHTML = '<img id="bouton-rouge2" src="/asset/bouton_vert.png" alt="bouton-rouge"/>'
        // compt +=1
        // verifIsGreen2
    }
    else if(textUser === listCoordonnée[2] + ' ' + valueCoordonnées[2]){
        thirdButton.innerHTML = '<img id="bouton-rouge3" src="/asset/bouton_vert.png" alt="bouton-rouge"/>'
        // compt +=1
        // verifIsGreen3 = true
    }
    else if(textUser == commandesListe[3] + ' '+ date){
        fourthButton.innerHTML =  '<img id="bouton-rouge3" src="/asset/bouton_vert.png" alt="bouton-rouge"/>'
        // compt +=1
        
    }
    else if(textUser == listCoordonnée + ' ' + textUser != valueCoordonnées){
        error.innerHTML = 'Veuillez saisir la bonne coordonnée'
        error.style.color = 'white'
        error.style.fontFamily =  'Cairo Regular'; 
    }else if(textUser == commandesListe[3]+ ' ' + textUser != date){
        error.innerHTML = 'Veuillez saisir la bonne date'
        error.style.color = 'white'
        error.style.fontFamily =  'Cairo Regular'; 
    }

    // else if(compt == 4){
    //     buttonValidate.style.display = 'block'
    // }
      
    else{
        error.innerHTML = "Ce n'est pas une commande valide "
        error.style.color = 'white'
        throw new Error('Pas bon message')
        }
}



// function verifIfLightsisGreen(){

//      if(verifIsGreen1 && verifIsGreen2 && verifIsGreen3 && verifIsGreen4){
//         console.log('test')
//         buttonValidate.style.display = 'flex'
//     }
// }