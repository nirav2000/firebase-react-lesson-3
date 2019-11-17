// Import base firebase code
import firebase from 'firebase/app';
// Import database functions, because we plan on using them
import 'firebase/database';

// Set the configuration for your app
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

/**
 * Listens to a path in Firebase and then will call the passed function with the data as a parameter
 *
 * @param {string} dataToListenTo E.g. "messages"
 * @param {Function} callbackFunction
 * @returns {Object} Firebase reference
 */
const listenTo = (dataToListenTo = '', callbackFunction = () => {}) => {
    const databaseRef = database.ref(dataToListenTo);

    databaseRef.on('value', (snapshot) => {
        callbackFunction(snapshot);
    });

    return databaseRef;
}

/**
 * Adds a piece of information to the passed collection.
 * If the collection does not exist, it is created
 * @param {string} dataToWriteTo E.g. "messages"
 * @param {*} value E.g. { data: "value" }
 */
const writeTo = (dataToWriteTo = '', value) => {
    const databaseRef = database.ref(dataToWriteTo);

    databaseRef.push(value);
}

/**
 * Updates a path with the passed value
 * @param {string} keyToUpdate E.g. "messages/{messageId}"
 * @param {*} value { data: "value" }
 */
const update = (keyToUpdate = '', value) => {
    const databaseRef = database.ref(keyToUpdate);

    databaseRef.update(value);
}

/**
 * Removes a particular entry in Firebase
 * @param {string} keyToUpdate E.g. "messages/{messageId}"
 */
const remove = (keyToUpdate = '') => {
    const databaseRef = database.ref(keyToUpdate);

    databaseRef.remove();
}

const getCurrentUser = () => {
    return firebase.auth().currentUser;
}

const isLoggedIn = () => {
    if (firebase.auth().currentUser) {
        return true;
    }

    return false;
}

const signIn = async (email, password) => {
    try {
        const result = await firebase.auth().signInWithEmailAndPassword(email, password)
        console.log(result);
    } catch(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log("An error occurred", errorCode, errorMessage);
    }
}

const onLoginChange = (callbackFunction = () => {}) => {
    firebase.auth().onAuthStateChanged((user) => {
        callbackFunction(user);
    });
}

const signOut = async () => {
    await firebase.auth().signOut();
}

export default {
    writeTo,
    listenTo,
    update,
    remove,
    getCurrentUser,
    isLoggedIn,
    signIn,
    onLoginChange,
    signOut
}