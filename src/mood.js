// import standart from './assets/ducks/duck.png';
// import realistic from './assets/ducks/duck_PNG5011.png';
// import cool from './assets/ducks/83e4a943664a198eb141cd46d6e36b21.png';
let activeMood = 'Standart';
console.log(activeMood)
function setDuck(mood){
    let duck = document.getElementById('duck')

    console.log(duck)
    switch (mood.id){
        case "standart":
            duck.src = 'assets/ducks/duck.png';
            break;
        case "realistic":
            duck.src = 'assets/ducks/duck_PNG5011.png';
            break;
        case "cool":
            duck.src = 'assets/ducks/83e4a943664a198eb141cd46d6e36b21.png';
            break;
    }
}