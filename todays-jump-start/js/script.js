let addItemForm = document.querySelector('#addItemForm');
let itemsList = document.querySelector('.actionItems');
let storage = chrome.storage.sync;

let actionItemsUtils = new ActionItems();

storage.get(['actionItems', 'name'], (data)=>{
let actionItems = data.actionItems;
let name = data.name;
setUsersName(name);
setGreeting();
setGreetingImage();
createQuickActionListener();
renderActionItems(actionItems);
createUpdateNameDialogListener();
createUpdateNameListener();
actionItemsUtils.setProgress();
chrome.storage.onChanged.addListener(()=>{
  actionItemsUtils.setProgress();
})
});


const filterActionItems = (actionItems) => {
  var currentDate = new Date();
  currentDate.setHours(0,0,0,0);

  const filteredItems = actionItems.filter((item)=>{
    if(item.completed){
      const completedDate = new Date(item.completed);
      if(completedDate < currentDate){
        return false;
      }
    }
    return true;
  })
  return filteredItems;
}

const renderActionItems = (actionItems) => {
  const filteredItems = filterActionItems(actionItems);
  filteredItems.forEach((item)=>{
    renderActionItem(item.text, item.id, item.completed, item.website);
  })
  storage.set({
    actionItems: filteredItems
  })
}

const createQuickActionListener = () => {
  let buttons = document.querySelectorAll('.quick-action');
  buttons.forEach((button)=>{
    button.addEventListener('click', handleQuickActionListener);
  })
} 

async function getCurrentTab(){
  return await new Promise((resolve, reject)=>{
    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, (tabs)=>{
      resolve(tabs[0]);
  })
  })
}

const handleQuickActionListener = (e) => {
  const text = e.target.getAttribute('data-text');
  const id = e.target.getAttribute('data-id');
  getCurrentTab().then((tab)=>{
    actionItemsUtils.addQuickActionItem(id, text, tab, (actionItem)=>{
      renderActionItem(actionItem.text, actionItem.id, actionItem.completed, actionItem.website, 250);
    });
  })
}

addItemForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  let itemText = addItemForm.elements.namedItem('itemText').value;
  if(itemText){
  actionItemsUtils.add(itemText, null, (actionItem)=>{
    renderActionItem(actionItem.text, actionItem.id, actionItem.completed, actionItem.website, 250);
    addItemForm.elements.namedItem('itemText').value = '';
  });
  }
})

const handleCompletedEventListener = (e) =>{
const id = e.target.parentElement.parentElement.getAttribute('data-id');
const parent = e.target.parentElement.parentElement;

if(parent.classList.contains('completed')){
  actionItemsUtils.markUnmarkCompleted(id, null);
  parent.classList.remove('completed');
}else{
  actionItemsUtils.markUnmarkCompleted(id, new Date().toString());
  parent.classList.add('completed');
}
}

const handleDeleteEventListener = (e) => {
  const id = e.target.parentElement.parentElement.getAttribute('data-id');
  const parent = e.target.parentElement.parentElement; 
  let jElement = $(`div[data-id="${id}"]`);
  actionItemsUtils.remove(id, ()=>{
    animateUp(jElement);
  });
}

const renderActionItem = (text, id, completed, website=null, animationDuration=450) => {
  let element = document.createElement('div');
  element.classList.add('actionItem__item');
  let mainElement = document.createElement('div');
  mainElement.classList.add('actionItem__main');
  let checkEl = document.createElement('div');
  checkEl.classList.add('actionItem__check');
  let textEl = document.createElement('div');
  textEl.classList.add('actionItem__text');
  let deleteEl = document.createElement('div');
  deleteEl.classList.add('actionItem__delete');

  checkEl.innerHTML = `
  <div class="actionItem__checkBox">
    <i class="fas fa-check" aria-hidden="true"></i>
  </div>
  `
  if(completed){
    element.classList.add('completed');
  }
  element.setAttribute('data-id', id);
  deleteEl.addEventListener('click',handleDeleteEventListener);
  checkEl.addEventListener('click',handleCompletedEventListener);
  textEl.textContent = text;
  deleteEl.innerHTML = `<i class="fas fa-times" aria-hidden="true"></i>`;
  mainElement.appendChild(checkEl);
  mainElement.appendChild(textEl);
  mainElement.appendChild(deleteEl);
  element.appendChild(mainElement);
  if(website){
  let linkContainer = createLinkContainer(website.url, website.fav_icon, website.title);
  element.appendChild(linkContainer);
  }
  itemsList.prepend(element);
  let jElement = $(`div[data-id="${id}"`);
  animateDown(jElement, animationDuration);
}

const createUpdateNameDialogListener = () => {
  let greetingName = document.querySelector('.greeting__name');
  greetingName.addEventListener('click', ()=>{
    storage.get(['name'], (data)=>{
      let name = data.name ? data.name: '';
      document.getElementById('inputName').value = name;
    })
    $('#updateNameModal').modal('show');
  })
}

const setGreeting = () => {
  let greeting = "Good ";
  const date = new Date();
  const hours = date.getHours();
  if(hours >= 5 && hours <= 11){
    greeting += "Morning,";
  }else if(hours >= 12 && hours <= 16){
    greeting += "Afternoon,";
  }else if(hours >= 17 && hours <= 20){
    greeting += "Evening,";
  }else{
    greeting += "Night,";
  }

  document.querySelector('.greeting__type').innerText = greeting;
}

const setGreetingImage = () => {
  let image = document.getElementById('greeting__image');
  const date = new Date();
  const hours = date.getHours();
  if(hours >= 5 && hours <= 11){
    image.src = './images/good-morning.png';
  }else if(hours >= 12 && hours <= 16){
    image.src = './images/good-afternoon.png';
  }else if(hours >= 17 && hours <= 20){
    image.src = './images/good-evening.png';
  }else{
    image.src = './images/good-night.png';
  }
}

const animateUp = (element) => {
  let height = element.innerHeight();
  element.animate({
    opacity: '0',
    marginTop: `-${height}px`
  }, 250, ()=>{
    element.remove();
  })
}

const animateDown = (element, duration) => {
  let height = element.innerHeight();
  element.css({marginTop: `-${height}px`, opacity: 0}).animate({
    opacity: 1,
    marginTop: '12px'
  }, duration)
}

const setUsersName = (name) =>{
  let newName = name ? name : 'Add Name';
  document.querySelector('.name__value').innerText = newName;
}

const handleUpdateName = (e) => {
  const name = document.getElementById('inputName').value;
  if(name){
    actionItemsUtils.saveName(name, ()=>{
      setUsersName(name);
      $('#updateNameModal').modal('hide');
    })
  }
}

const createUpdateNameListener = () => {
  let element = document.querySelector('#updateName');
  element.addEventListener('click', handleUpdateName)
}

const createLinkContainer = (url, favIcon, title) => {
  let element = document.createElement('div');
  element.classList.add('actionItem__linkContainer');
  element.innerHTML = `
  <div class="actionItem__linkContainer">
    <a href="${url}" target="_blank">
      <div class="actionItem__link">
          <div class="actionItem__favIcon">
              <img src="${favIcon}" alt="">
          </div>
          <div class="actionItem__title">
              <span>${title}</span>
          </div>
      </div> 
    </a>
  </div>
  `
  return element;
}