'use strict';

var loginLink = document.getElementById('login-link');

var returnURL = window.location.href.split('?callback=')[1];
if(returnURL) loginLink.href += '?callback=' + returnURL;
