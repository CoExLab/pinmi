import React from 'react';
import { baseURL } from '../constants.js'

//testName is a string
const test = async (testName) => {
    await fetch(baseURL + testName)
    .then(function(res) {
        return res.json()
    })
    .then((res) => {
        console.log(res.message);
    })
    .catch((error) => {
        console.log("Oh no! " + testName + " didn't work");
        console.log(error);
    })
}

const CORsTestButtons = () => {
    return(
        <div>
            <button onClick = {() => test("test1")}>test1</button>
            <button onClick = {() => test("test2")}>test2</button>
            <button onClick = {() => test("test3")}>test3</button>
            <button onClick = {() => test("test4")}>test4</button>
            <button onClick = {() => test("test5")}>test5</button>
            <button onClick = {() => test("test6")}>test6</button>
        </div>
    )
}

export default CORsTestButtons;