/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { ActionMessage } from "@workadventure/iframe-api-typings";

console.log('Script started successfully');

let currentPopup: any = undefined;

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
        console.error('Error initializing Scripting API Extra:', e);
    }

    // Initialize door state with type assertion
    const doorState = (await WA.state.getVariable('doorState')) as boolean;
    displayDoor(doorState);

    // Subscribe to changes in door state
    WA.state.onVariableChange('doorState').subscribe((newDoorState: any) => {
        displayDoor(newDoorState as boolean);
    });

    // Manage door state when entering or leaving the inside doorstep
    WA.room.onEnterLayer('doorsteps/inside_doorstep').subscribe(() => {
        WA.room.showLayer('door/door_opened');
        WA.room.hideLayer('door/door_closed');
        WA.state.setVariable('doorState', true);
    });

    WA.room.onLeaveLayer('doorsteps/inside_doorstep').subscribe(() => {
        WA.room.hideLayer('door/door_opened');
        WA.room.showLayer('door/door_closed');
        WA.state.setVariable('doorState', false);
    });

    // Manage popup and camera when entering or leaving the clock area
    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = `${today.getHours()}:${today.getMinutes()}`;
        currentPopup = WA.ui.openPopup("clockPopup", `It's ${time}`, []);
        WA.camera.set(100, 100, 500, 500, false, false);
    });

    WA.room.area.onLeave('clock').subscribe(() => {
        closePopup();
        WA.camera.reset();
    });

}).catch(e => console.error('Error during initialization:', e));

function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};
