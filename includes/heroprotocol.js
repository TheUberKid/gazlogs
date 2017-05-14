'use strict';

// this script runs a replay through heroprotocol.py using a python shell

const PythonShell = require('python-shell');

function run(path){
  PythonShell.run('./heroprotocol/heroprotocol.py', {
    mode: 'json',
    args: [path, '--json', '--details']
  }, function(err, res){
    
  });
}
