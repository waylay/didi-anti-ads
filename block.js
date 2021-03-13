// global on/off state
blockingEnabled = false;

// register all callbacks
function enable(icon = true) {
	if (blockingEnabled) {
		return;
	}

	blockingEnabled = true;
	if (icon) {
		chrome.browserAction.setIcon(enabledImageData);
	}
}

// unregister all callbacks
function disable(icon = true) {

	blockingEnabled = false;
	if (icon) {
		chrome.browserAction.setIcon(disabledImageData);
	}
}

// power-cycle
function refreshFilters() {
	// work around some weird Chrome issue. seems like: on first load,
	// if you call setIcon twice in a row, the second call is ignored (?)
	disable(false);
	enable(true);
}

// switch-flip
function toggleEnabled() {
	if (blockingEnabled) {
		disable();
	} else {
		enable();
	}
}

// toggle blocking on-off via the extension icon in the Omnibar
chrome.browserAction.onClicked.addListener(toggleEnabled);
// main screen turn on
enable();


function popupStop() {
    'use strict';
    var page = chrome.extension.getBackgroundPage();
    page.console.log('Didi Loaded');

    page.addEventListener('error', function (e) {e.preventDefault();e.stopPropagation();}, false);
    window.addEventListener('click', function (e) {

        console.log('ei da');
    }, false);

    let handlers = [
        'copy', 'cut', 'paste',
        'beforeunload', 'blur', 'change', 'click', 'contextmenu', 'dblclick', 'focus', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'selectstart',
        'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified', 'DOMElementNameChanged', 'DOMAttributeNameChanged', 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'online', 'offline', 'input',
        'abort', 'close', 'drop', 'dragstart', 'drag', 'load', 'paint', 'reset', 'select', 'submit', 'unload'
    ];

    function eventHandler(e) {
        if (!blockingEnabled) {
            chrome.extension.getBackgroundPage().console.log('foo');
            e.preventDefault();
            e.stopPropagation();
        }
        
        // e.preventDefault(); // Stop for the form controls, etc., too?
    }
    for(let i=0; i < handlers.length; i++) {
        window.addEventListener(handlers[i], eventHandler, true);
    }

    if(window.stop) {
        window.stop();
    }
    
    Array.prototype.forEach.call(document.querySelectorAll("*"), el => {
        if( document.defaultView.getComputedStyle(el)["-webkit-user-select"] == "none" ) {
            //el.style.webkitUserSelect = "auto";
            el.style.setProperty("-webkit-user-select", "auto", "important");
        }
    });

    throw '';
}

if (blockingEnabled) {
    popupStop();
}
