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
    theme: '.tags-theme ul',
    date: '.tags-date ul',
    themeLi: '.tags-theme a',
    dateLi: '.tags-date a',
    allLi: '.tags li',
    all: '.tags a',
  },
};

/* CLASSes / IDs */
const className = {
  task: {
    taskActive: 'task-active',  
    taskContentActive: 'task-content-active',
  },
};

/* GLOBAL VARIABLES */
/* empty object of all inputs genereted when website is running */
const inputsObj = {};
let taskCounter = 1;
const tasksArr = [];
let tagCounter = 1;
const tagsArr = [];
let themeArr = [];
let dateArr = [];

/* GLOBAL FUNCTIONS */

function removeElemFromArr(array, elem) {
  
  const ind = array.indexOf(elem);
  const newArray = array.slice(0, ind).concat(array.slice(ind + 1, array.length));
  
  return newArray;
}

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

}  //CLASS INPUTS END


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
    thisTask.dom.tasks = document.querySelectorAll(select.tasks.tasksListElem);
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
      console.log('theme:');
      console.log(thisTask.data.theme);
      console.log('date:');
      console.log(thisTask.data.date);
      //new
      //0. check is any task with the same theme or date like current removing task
      //thisTask.dom.SimilarTasks = document.querySelectorAll(select.tasks.tasksListElem);
      //thisTask.checkSimilarTask(thisTask.data.theme);
      //...
      //1. remove html/dom
      thisTask.dom.wrapper.remove();
      //new
      //0. check is any task with the same theme or date like current removing task
      thisTask.dom.SimilarTasks = document.querySelectorAll(select.tasks.tasksListElem);
      thisTask.checkSimilarTask(thisTask.data.theme, 'theme');
      thisTask.checkSimilarTask(thisTask.data.date, 'date');
      //....
      //2. set thisTask.isDeleted = true;
      thisTask.isDeleted = true;
      //3. set thisTask.isDeleted = true inside global tasksArr
      tasksArr[thisTask.id - 1].isDeleted = thisTask.isDeleted;
      //console.log(tasksArr);
    });

  }
  
  checkSimilarTask(data, dataType) {
    const thisTask = this;
    console.log('>>>> check run');
    
    let similarTaskCounter = 0;
    
    for (let task of thisTask.dom.SimilarTasks) {
      if (data == task.getAttribute(`data-${dataType}`)) {
        similarTaskCounter++;
      } 
    }
    
    if (similarTaskCounter == 0) {
      console.log(`tag /${data}/ is to deleting!`)
      const tags = document.querySelectorAll(select.tags.allLi);
      for (let tag of tags) {
        if (tag.getAttribute(`data-${dataType}`) == data) {
          tag.remove(); 
          
          if (dataType == 'theme') {
            themeArr = removeElemFromArr(themeArr, data);
          } else if (dataType == 'date') {
            dateArr = removeElemFromArr(dateArr, data);
          }

        }
      }
    }
  }
  
} //CLASS TASK END


/* TAGS CLASS */
class Tag {
  constructor(data, tagType) {
    const thisTag = this;
    
    //preferences
    thisTag.data = data;
    thisTag.id = data.id;
    thisTag.type = tagType == 'theme' ? 'theme' :  'date';
    thisTag.value = tagType == 'theme' ? data.theme :  data.date
       
    //methods
    thisTag.render();
    thisTag.getElements();
    thisTag.showTasks();
    thisTag.showAll();
  }
  
  render() {
    const thisTag = this;
    
    const tplTagSource = document.querySelector(`#template-tag-${thisTag.type}`).innerHTML; //source - part of kode html with {{xx}} elements
    const tplTag = Handlebars.compile(tplTagSource); // try sth like this: const tplHello = Handlebars.compile('{{ firstName }}');
    const generatedHTML = tplTag(thisTag.data);
    const targetElement = document.querySelector(select.tags[thisTag.type]);
    targetElement.insertAdjacentHTML('beforeend', generatedHTML);    
  }

  getElements() {
    const thisTag = this;
    
    thisTag.dom = {};
    thisTag.dom[`${thisTag.type}Wrapper`] = document.querySelector(`.tag-${thisTag.type}-wrapper-${thisTag.id}`);
    thisTag.dom[`${thisTag.type}Tag`] = thisTag.dom[`${thisTag.type}Wrapper`].querySelector('a'); 
    thisTag.dom[`${thisTag.type}Tag`].classList.add(`${thisTag.type}-xyz-${thisTag.value}`);
    //thisTag.dom[`${thisTag.type}Tag`].setAttribute('name', thisTag.value);
   
    thisTag.dom.tasks = document.querySelectorAll(select.tasks.tasksListElem); 
    
    thisTag.dom.tags = document.querySelectorAll(select.tags.all);  
    thisTag.dom.themeTags = document.querySelectorAll(select.tags.themeLi); //tags-theme li
    thisTag.dom.dateTags = document.querySelectorAll(select.tags.dateLi); //tags-theme li
    
    thisTag.dom.valueAsClassName = thisTag.dom[`${thisTag.type}Wrapper`].querySelector(`.${thisTag.type}-xyz-${thisTag.value}`); 
    //thisTag.dom.getByAtt = thisTag.dom[`${thisTag.type}Wrapper`].querySelector(`a[name='${thisTag.value}]'`); 
    thisTag.dom[`${thisTag.type}All`] = document.querySelector(`.tag-${thisTag.type}-wrapper-all`);
  }
    
  showAll() {
    const thisTag = this;
    
    thisTag.dom[`${thisTag.type}All`].addEventListener('click', function(event) {
      
      event.preventDefault();
      
      if (thisTag.dom[`${thisTag.type}All`].classList.contains('shadow')) {
        thisTag.dom[`${thisTag.type}All`].classList.remove('shadow');
      }
      
      // remove class shadow from others tags than "all" tag
      for (let x of thisTag.dom.tags) {
        if (x.classList.contains('shadow')) {
        x.classList.remove('shadow');
        }
      }
      
      for (let singleTaskDom of thisTag.dom.tasks) {

        if (!singleTaskDom.classList.contains(className.task.taskActive)) {
          singleTaskDom.classList.add(className.task.taskActive);
        }   
      } 
      
    });
  }
  
  // !!!!!!!!!!
  // REFACTOR CODE - NODE THEME TASKS AND DATE TASKS - IT WORKS BAD !
  // !!!!!!!!!
  
  showTasks() {
    const thisTag = this;
    
    //1.add event listener for dom element (tag)
    thisTag.dom[`${thisTag.type}Tag`].addEventListener('click', function(event) {
      
      event.preventDefault();
      
      thisTag.dom[`${thisTag.type}Tag`].classList.toggle('shadow');
      
      console.log(`tag ${thisTag.type} ${thisTag.value} clicked`);
      
      for (let singleTaskDom of thisTag.dom.tasks) {
        console.log('>>> TEST');
        console.log(singleTaskDom.getAttribute(`data-${thisTag.type}`));

        if (singleTaskDom.getAttribute(`data-${thisTag.type}`) == thisTag.value) {
          singleTaskDom.classList.toggle(className.task.taskActive);
        }   
      }    
    });
  }
  
} //CLASS TAG END


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
        
        let tagType = 'theme';
        
        if (themeArr.length < 1 || !themeArr.includes(task.theme)) {
          themeArr.push(task.theme);
          //create new Tag object      
          const tag = new Tag(dataTask, tagType);
          //add task to global tasks array
          tagsArr.push(tag);
          console.log('NEW TAG  >>>>>>>>>>')
        } else {
          const getTagDom = document.querySelector(`.${tagType}-xyz-${task.theme}`);

          getTagDom.parentNode.remove();
          
          //create new Tag object      
          const tag = new Tag(dataTask, tagType);
          //add task to global tasks array
          tagsArr.push(tag);
        }
           
        tagType = 'date';
        
        if (dateArr.length < 1 || !dateArr.includes(task.date)) {
          dateArr.push(task.date);
          //create new Tag object      
          const tag = new Tag(dataTask, tagType);
          //add task to global tasks array
          tagsArr.push(tag);
          console.log('NEW TAG  >>>>>>>>>>')
        } else {
          const getTagDom = document.querySelector(`.${tagType}-xyz-${task.date}`);

          getTagDom.parentNode.remove();
          
          //create new Tag object      
          const tag = new Tag(dataTask, tagType);
          //add task to global tasks array
          tagsArr.push(tag);
        }
        
        //clear values of input and inputsObj
        for (let input in inputsObj) {
          const singleInput = inputsObj[input];
          singleInput.value = false;
          singleInput.dom.value = '';
        };
        
        // console.log('tasksArr');
        // console.log(tasksArr);
        // console.log('tagsArr');
        // console.log(tagsArr);
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