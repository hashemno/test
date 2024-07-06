/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;

/*
function displayDoor(state: unknown) {
    if (state === true) {
        WA.room.showLayer('door/door_opened');
        WA.room.hideLayer('door/door_closed');
    } else {
        WA.room.hideLayer('door/door_opened');
        WA.room.showLayer('door/door_closed');
    }
}
*/

WA.onInit().then(async () => {
    console.log('Scripting API ready');
    console.log('Player tags: ', WA.player.tags);

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = `${today.getHours()}:${today.getMinutes()}`;
        currentPopup = WA.ui.openPopup("clockPopup", `It's ${time}`, []);
    });

    WA.room.area.onLeave('clock').subscribe(closePopup);

    WA.state.onVariableChange('doorState').subscribe((doorState) => {
        // displayDoor(doorState);
    });

    // displayDoor(WA.state.doorState);

    /*
    WA.room.onEnterLayer('doorsteps/inside_doorstep').subscribe(() => {
        WA.state.doorState = true;
    });

    WA.room.onLeaveLayer('doorsteps/inside_doorstep').subscribe(() => {
        WA.state.doorState = false;
    });
    */

    try {
        await bootstrapExtra();
        console.log('Scripting API Extra ready');
    } catch (e) {
        console.error(e);
    }

}).catch(e => console.error(e));

/*
function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}
*/

export {};
