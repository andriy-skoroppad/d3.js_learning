window.onload = function () {
  console.log('load done')
  var number = document.querySelectorAll('.number div');
  var display = document.querySelector('.display');
  var events = document.querySelectorAll('.events');
  var Val1 = '';
  var Val2 = '';
  var operator = '';

function show(){
  if(typeof(Val1) == 'string'){
    Val1 = Val1.replace(/^0+(?=[0-9])/, '')
  }
  if(typeof(Val2) == 'string'){
    Val2 = Val2.replace(/^0+(?=[0-9])/, '')
  }
  if (!operator) {
    display.innerHTML = Val1;
  } else {
    display.innerHTML = Val2;
  }
}

  
function clickNumber(){
  if(!operator){
    Val1 += this.dataset.value;
  } else {
    Val2 += this.dataset.value;
  };
  show();
}

function clickEvents(){
  operator = this.dataset.value;
  show();
}
function clickDisplay(){
  Val1 = '';
  Val2 = '';
  operator = '';
  show();
}
function clickEnter(){
  Val1 = parseFloat( Val1 );
  Val2 = parseFloat( Val2 );
  console.log( Val1 , Val2, operator)
  switch(operator) {
    case '+':
      Val1 += Val2;
      break;
    case '-':
      Val1 -= Val2;
      break;
    case '*':
      Val1 *= Val2;
      break;
    case '/':
     Val1 /= Val2;
      break;
  }
  operator = '';
  Val2 = '';
  show();
}



enter.addEventListener('click', clickEnter)
display.addEventListener('click', clickDisplay)

  for(var i = 0; i < number.length ; i++){
    number[i].addEventListener('click', clickNumber)

  }
  for(var i = 0; i < events.length ; i++){
    events[i].addEventListener('click', clickEvents)

  }
}