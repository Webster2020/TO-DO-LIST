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
    tasksListElem: '.tasks-list li',
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
    taskActive: 'task-active',  //TO DO class css to creat (click on tag)
    taskContentActive: 'task-content-active', //TO DO class css to creat (accordion)
  },
};

/* GLOBAL VARIABLES */
/* empty object of all inputs genereted when website is running */
const inputsObj = {};
let taskCounter = 1;
const tasksArr = [];
let tagCounter = 1;
const tagsArr = [];
const themeArr = [];
const dateArr = [];
/*
const tagsObj = {
  theme: [],
  date: [],
} 
*/

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
    
    //console.log('data-theme:')
    //console.log(thisTask.dom.wrapper.getAttribute('data-theme'));
  }
  
  render() {
    const thisTask = this;
    
    const tplTaskSource = document.querySelector('#template-task').innerHTML; //source - part of kode html with {{xx}} elements
    const tplTask = Handlebars.compile(tplTaskSource); // try sth like this: const tplHello = Handlebars.compile('{{ firstName }}');
        
    const generatedHTML = tplTask(thisTask.data);

    const targetElement = document.querySelector(select.tasks.tasksList);
    targetElement.insertAdjacentHTML('beforeend', generatedHTML);
  }
  
  initAccordion() {
    const thisTask = this;
    
    //console.log('init Button Accordion');
    thisTask.dom.accordion.addEventListener('click', function(event) {
      event.preventDefault();
      //console.log('click acc');
      thisTask.dom.content.classList.toggle(className.task.taskContentActive);
    });
  }
  
  initTaskDone() {
    const thisTask = this;
    
    thisTask.dom.taskDone.addEventListener('click', function(event) {
      event.preventDefault();
      //console.log('click done');
      thisTask.dom.taskMain.classList.toggle('task-done');
    });
  }
  
  initTaskRemove() {
    const thisTask = this;
    
    thisTask.dom.taskRemove.addEventListener('click', function(event) {
      event.preventDefault();
      console.log('click remove');
      //1. remove html/dom
      thisTask.dom.wrapper.remove();
      //2. set thisTask.isDeleted = true;
      thisTask.isDeleted = true;
      //3. set thisTask.isDeleted = true inside global tasksArr
      tasksArr[thisTask.id - 1].isDeleted = thisTask.isDeleted;
      //console.log(tasksArr);
    });
    
    /* TO DO */
    /* IF IT WAS ONLY ONE OF TAG TYPE -> REMOVE THIS TAG FROM TAGS */
  }
  
}


/* TAGS CLASS <TO DO> */
class Tag {
  constructor(data, tagType) {
    const thisTag = this;
    
    //preferences
    thisTag.data = data;
    thisTag.id = data.id;
    thisTag.theme = data.theme;
    thisTag.date = data.date;

    thisTag.addTheme = newThemeTag;
    thisTag.addDate = newDateTag;
       
    //methods
    thisTag.render();
  }
  
  render() {
    const thisTag = this;
    
    /* THEME */
    if (thisTag.addTheme) {
      const tplTagSource = document.querySelector('#template-tag-theme').innerHTML; //source - part of kode html with {{xx}} elements
      const tplTag = Handlebars.compile(tplTagSource); // try sth like this: const tplHello = Handlebars.compile('{{ firstName }}');

      const generatedHTML = tplTag(thisTag.data);

      const targetElement = document.querySelector(select.tags.tagsTheme);
      targetElement.insertAdjacentHTML('beforeend', generatedHTML);
    }
    /* DATE */
    if (thisTag.addDate) {
      const tplTagSource = document.querySelector('#template-tag-date').innerHTML; //source - part of kode html with {{xx}} elements
      const tplTag = Handlebars.compile(tplTagSource); // try sth like this: const tplHello = Handlebars.compile('{{ firstName }}');

      const generatedHTML = tplTag(thisTag.data);

      const targetElement = document.querySelector(select.tags.tagsDate);
      targetElement.insertAdjacentHTML('beforeend', generatedHTML);
    }
  } 
   
  getElements() {
    const thisTag = this;
    
    thisTag.dom = {};
    thisTag.dom.themeWrapper = document.querySelector(`.tag-theme-wrapper-${thisTag.id}`);
    thisTag.dom.themeTag = thisTag.dom.themeWrapper.querySelector('a');
    
    thisTag.dom.dateWrapper = document.querySelector(`.tag-date-wrapper-${thisTag.id}`);
    thisTag.dom.dateTag = thisTag.dom.dateWrapper.querySelector('a');
    
    thisTag.dom.tasks = document.querySelectorAll(select.tasks.tasksListElem);
    
  }
  
  /* ========================= */
  /* \/ \/  \/   \/   \/   \/  */
  
  showTasks() {
    const thisTag = this;
    
    //1. add event listener for dom element (tag)
    thisTag.dom.themeTag.addEventListener('click', function(event) {
      
      event.preventDefault();
      //console.log(event);
      //console.log('tag theme clicked')
      //console.log(thisTag.dom.themeWrapper.getAttribute('data-theme'));
      
      //2. querySelectorAll - all tasks
      for (let task of thisTag.dom.tasks) {
        console.log('single task');
        console.log(task.getAttribute('data-theme'));
        //task.classList.toggle(className.task.taskActive);
      }
      
    });
    
    thisTag.dom.dateTag.addEventListener('click', function(event) {
      event.preventDefault();
      //console.log(event);
      //console.log('tag date clicked')
      //console.log(thisTag.dom.dateWrapper.getAttribute('data-date'));
    });
    
    
    //3. find tasks, which have the same "theme" tag as clicked tag link OR
    //4. find tasks, which have the same "date" tag as clicked tag link 
    //5. hide rest of tasks, which dont fit with this condition (toggle class className.task.taskVisible) -> create styles for this class in css before
  }
  
  /*^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
  /* ========================= */
  
}

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
  },

  initButton: function() {
    const thisApp = this;
    
    thisApp.addTaskButton = document.querySelector(select.form.inputButton);
    
    thisApp.addTaskButton.addEventListener('click', function(event) {
      event.preventDefault();
       
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
        
        let newThemeTag = true;
        let newDateTag = true;
        
        if (themeArr.length < 1 || !themeArr.includes(task.theme)) {
          themeArr.push(task.theme);
        } else {
          newThemeTag = false;
        }
        
        if (dateArr.length < 1 || !dateArr.includes(task.date)) {
          dateArr.push(task.date);
        } else {
          newDateTag = false;
        }

        /* if themeArr */
        //create new Tag object     
        const tag = new Tag(dataTask, newThemeTag, newDateTag);
        //add task to global tasks array
        tagsArr.push(tag);
        
        //clear values of input and inputsObj
        for (let input in inputsObj) {
          const singleInput = inputsObj[input];
          singleInput.value = false;
          singleInput.dom.value = '';
        };
        //console.log(tasksArr);
        //console.log(tagsArr[tagCounter - 1].data.theme);
        //console.log(tagsArr[tagCounter - 1].data.date);
        taskCounter++;
        tagCounter++;
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