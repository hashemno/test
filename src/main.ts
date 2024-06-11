/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { ActionMessage } from "@workadventure/iframe-api-typings";

console.log('Script started successfully');

let currentPopup: any = undefined;
let doorState: boolean = true; 

function displayDoor(state: boolean) {
    if (state) {
        WA.room.showLayer('door/door_opened');
        WA.room.hideLayer('door/door_closed');
    } else {
        WA.room.hideLayer('door/door_opened');
        WA.room.showLayer('door/door_closed');
    }
}

WA.onInit().then(async () => {
    console.log('Scripting API ready');

    try {
        await bootstrapExtra();
        console.log('Scripting API Extra ready');
    } catch (e) {
        console.error(e);
    }

    displayDoor(doorState);

    WA.state.onVariableChange('doorState').subscribe((newDoorState) => {
        doorState = newDoorState as boolean;
        displayDoor(doorState);
    });

    WA.room.onEnterLayer('doorsteps/inside_doorstep').subscribe(() => {
        WA.state.doorState = true;
        displayDoor(true);
    });

    WA.room.onLeaveLayer('doorsteps/inside_doorstep').subscribe(() => {
        WA.state.doorState = false;
        displayDoor(false);
    });

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = `${today.getHours()}:${today.getMinutes()}`;
        currentPopup = WA.ui.openPopup("clockPopup", `It's ${time}`, []);
        WA.camera.set(100, 100, 500, 500, false, false); 
    });

    WA.room.area.onLeave('clock').subscribe(() => {
        closePopup();
        WA.camera.set(0, 0, 0, 0, false, false); 
    });

 
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            doorState = !doorState;
            WA.state.doorState = doorState;
            displayDoor(doorState);
        }
    });

}).catch(e => console.error(e));

function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};
