'use strict';

/* ============================================================ */
/* -----------------------  C  O  D  E  ----------------------- */
/* ============================================================ */

/* SELECTORS */
const select = {
  form: {
    inputTaskTheme: '.task-theme',
    inputTaskDate: '.task-date',
    inputTaskTime: '.task-time',
    inputTaskContents: '.task-contents',
    inputButton: '.btn',
    inputs: 'form [class^="task-"]',
    inputsWrapper: 'form',
  },
  tasks: {
    tasksList: '.tasks-list ul',
    taskAccordion: '.btn-accordion',
    taskDone: '.btn-done',
    taskRemove: '.btn-remove',
  },
  tags: {
    tagsTheme: '.tags-theme ul',
    tagsDate: '.tags-date ul',
  },
};


/* CLASSes / IDs */
const className = {
  task: {
    taskVisible: '.task-visible',  //TO DO class css to creat (click on tag)
    taskDetailsVisible: '.task-details-visible', //TO DO class css to creat (accordion)
  },
};

/* GLOBAL VARIABLES */
/* empty object of all inputs genereted when website is running */
const inputsObj = {};
let taskCounter = 1;
const tasksArr = [];

/* INPUT CLASS */
/* class get id of input and set value of input */
class Inputs {
  constructor(input) {
    const thisInput = this;
    
    /*props*/ 
    thisInput.input = input;
    thisInput.id = input.name;
    thisInput.type = input.type;
    thisInput.placeholder = input.placeholder;
   
    //console.log('>>>NEW INPUT<<<');
  
    /*methods*/
    thisInput.getValue();
    thisInput.addInputToObj();
  }
  
  addInputToObj() {
    const thisInput = this;
    
    inputsObj[thisInput.input.getAttribute('name').replace('task-', '')] = {
      id: thisInput.id,
      type: thisInput.type,
      placeholder: thisInput.placeholder ? thisInput.placeholder : false,
      dom: thisInput.dom ? thisInput.dom : false,
      value: thisInput.value ? thisInput.value : false,
    }; 
  }

  getValue() {
    const thisInput = this;
    
    thisInput.dom = document.querySelector(`form .${thisInput.id}`);
    thisInput.value = thisInput.dom.value;
  }

}


/* TASK CLASS */
/* task get values from dataTask in eventhandler of button and render dom element */
class Task {
  constructor(data) {
    const thisTask = this;
    
    //preferences
    thisTask.data = data;
    
    //methods
    thisTask.getValue();
    thisTask.render();
    thisTask.getElements();
    thisTask.initAccordion();
    thisTask.initTaskDone();
    thisTask.initTaskRemove();
  }
  
  getValue() {
    const thisTask = this;
    
    thisTask.isDeleted = false;
    //create preferences of thisTask using all values form inputs
    for (let keys in thisTask.data) {
      //  input key  = input value
      thisTask[keys] = thisTask.data[keys];
    }
  }
  
  getElements() {
    const thisTask = this;
    
    thisTask.dom = {};
    thisTask.dom.wrapper = document.querySelector(`.task-wrapper-${thisTask.id}`);
    thisTask.dom.accordion = document.querySelector(`.task-id-${thisTask.id} ${select.tasks.taskAccordion}`);
    thisTask.dom.taskDone = document.querySelector(`.task-id-${thisTask.id} ${select.tasks.taskDone}`);
    thisTask.dom.taskRemove = document.querySelector(`.task-id-${thisTask.id} ${select.tasks.taskRemove}`);
    thisTask.dom.taskMain = document.querySelector(`.task-id-${thisTask.id}`);
    thisTask.dom.content = document.querySelector(`.task-content-${thisTask.id}`);
  }
  
  render() {
    const thisTask = this;
    
    //taskCounter++;
    //thisTask.id = taskCounter;
    
    const tplTaskSource = document.querySelector('#template-task').innerHTML; //source - part of kode html with {{xx}} elements
    const tplTask = Handlebars.compile(tplTaskSource); // try sth like this: const tplHello = Handlebars.compile('{{ firstName }}');
        
    const generatedHTML = tplTask(thisTask.data);

    const targetElement = document.querySelector(select.tasks.tasksList);
    targetElement.insertAdjacentHTML('beforeend', generatedHTML);
  }
  
  initAccordion() {
    const thisTask = this;
    
    console.log('init Button Accordion');
    thisTask.dom.accordion.addEventListener('click', function(event) {
      event.preventDefault();
      console.log('click acc');
      thisTask.dom.content.classList.toggle('task-content-active');
    });
  }
  
  initTaskDone() {
    const thisTask = this;
    
    console.log('init Button Done');
    thisTask.dom.taskDone.addEventListener('click', function(event) {
      event.preventDefault();
      console.log('click done');
      thisTask.dom.taskMain.classList.toggle('task-done');
    });
  }
  
  initTaskRemove() {
    const thisTask = this;
    
    console.log('init Button Remove');
    thisTask.dom.taskRemove.addEventListener('click', function(event) {
      event.preventDefault();
      console.log('click remove');
      //1. remove html/dom
      thisTask.dom.wrapper.remove();
      //2. set thisTask.isDeleted = true;
      thisTask.isDeleted = true;
      //3. set thisTask.isDeleted = true inside global tasksArr
      tasksArr[thisTask.id - 1].isDeleted = thisTask.isDeleted;
      console.log(tasksArr);
    });
    
  }
  
}


/* TAGS CLASS <TO DO> */


/* APP */
const app = {

  init: function() {
    const thisApp = this;

    thisApp.getElements();
    thisApp.initInputs();
    thisApp.initButton();
  },

  getElements: function() {
    const thisApp = this;
    //code belowe is not used anywhere -> maybe to delete 
    thisApp.dom = {};
    thisApp.dom.inputWrapper = document.querySelector(select.form.inputsWrapper);
    thisApp.dom.inputTaskTheme = document.querySelector(select.form.inputTaskTheme);
    thisApp.dom.inputTaskDate = document.querySelector(select.form.inputTaskDate);
    thisApp.dom.inputTaskTime = document.querySelector(select.form.inputTaskTime);
    thisApp.dom.inputTaskCont = document.querySelector(select.form.inputTaskContents);
    thisApp.dom.inputTaskBtn = document.querySelector(select.form.inputButton);
    
    thisApp.dom.inputs = document.querySelectorAll(select.form.inputs);
    
    //console.log('Input Dom: ', thisApp.dom);

  },

  initButton: function() {
    const thisApp = this;
    
    //console.log('>>> INIT BUTTON <<<')
    thisApp.addTaskButton = document.querySelector(select.form.inputButton);
    
    thisApp.addTaskButton.addEventListener('click', function(event) {
      event.preventDefault();
      //IT WORKS!!!!
      //console.log('Button clicked!');
       
      //1) take values of all inputs >>> DONE!
      const dataTask = {
        id: taskCounter,
      };
      
      let wrongData = false;
      
      for (let input in inputsObj) {
        const singleInput = inputsObj[input];
        singleInput.value = singleInput.dom.value;
             
        if (!singleInput.value) {
          singleInput.dom.classList.add('input-error');
          wrongData = true;
        } else {
          for (let params in singleInput) {
            
            if (params == 'value' || params == 'id') {
              //set values to dataTask form inputs
              dataTask[input] = singleInput[params];
            }
          };

          if (singleInput.dom.classList.contains('input-error')) {
            singleInput.dom.classList.remove('input-error');   
          };
        }
      }
      
       
      if (!wrongData) {      
        //create new Task object
        const task = new Task(dataTask); 
        //add task to global tasks array
        tasksArr.push(task);
        //clear values of input and inputsObj
        for (let input in inputsObj) {
          const singleInput = inputsObj[input];
          singleInput.value = false;
          singleInput.dom.value = '';
        };
        taskCounter++;
        console.log(tasksArr);
      }; 
      
    });
  },

  initInputs: function() {
    const thisApp = this;
    thisApp.inputsDom = document.querySelectorAll('form [class^="task-"]');

    for (let input of thisApp.inputsDom) {
      thisApp.input = new Inputs (input);
    }
  },

}

app.init();