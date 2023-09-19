import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://realtime-database-6ecbd-default-rtdb.asia-southeast1.firebasedatabase.app/"
}; 

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDb = ref(database, "shoppingList");

const addButtonEl = document.getElementById("add-button");
const inputFieldEl = document.getElementById("input-field");
const shoppingListEl = document.getElementById("shopping-list");

onValue(shoppingListInDb, function(snapshot) {

    if (snapshot.exists()) {

    let itemsArray = Object.entries(snapshot.val());
    
    clearShoppingListEl();

    for (let i = 0; i < itemsArray.length; i++) {
        let currentItem = itemsArray[i];
        let currentItemID = currentItem[0];
        let currentItemValue = currentItem[1];

        appendItemToShoppingListEl(currentItem);
    }
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }

})

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;
    push(shoppingListInDb, inputValue);

    clearInputFieldEl();
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
    inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];

    let newEl = document.createElement('li');

    newEl.textContent = itemValue;
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDb = ref(database, `shoppingList/${itemID}`);

        remove(exactLocationOfItemInDb);
    })

    shoppingListEl.append(newEl);
}
