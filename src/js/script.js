'use strict';

const select1 = new ItcCustomSelect('#select-1');

let rubricSelect = document.getElementById('select-1');

let toggleButton = rubricSelect.querySelector('button.itc-select__toggle_disabled');

if (toggleButton != null) {
	select1.dispose();
}

const picker = new Pikaday({ field: document.getElementById('datepicker') });