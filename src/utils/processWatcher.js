"use strict";

var pusage           = require("pidusage");
var psTree           = require("ps-tree");
var exec             = require("child_process").exec;

class ProcessWatcher {
  constructor(pid) {
    this._pid = pid;
    this._maxCpu = 95;
    this._frequency = 5;
    this._interval = 2000;
    this._children = [];

    this._exceedCount = 0;
    this._handle = 0;
  }

  maxCpu(n) {
    if (n) {
      this._maxCpu = n;
      return this;
    } else {
      return this._maxCpu;
    }
  }

  frequency(n) {
    if (n) {
      this._frequency = n;
      return this;
    } else {
      return this._frequency;
    }
  }

  interval(n) {
    if (n) {
      this._interval = n;
      return this;
    } else {
      return this._interval;
    }
  }

  watch() {
    function processStat(err, stat) {
      console.log('Pcpu: %s', stat.cpu);
      console.log('Mem: %s', stat.memory); //those are bytes
      if (stat.cpu > self.maxCpu) {
        self._exceedCount++;
        if (self._exceedCount >= self._frequency) {
          self.kill();
        }
      }
    }
    function doWatch() {
      pusage.stat(self._pid, (err, stat) => {
        if (err) {
          self.unwatch();
        }
        processStat(err, stat);
      });
      psTree(self._pid, (err, children) => {
        children.forEach(child => {
          if (self._children.indexOf(child.PID) === -1) {
            self._children.push(child.PID);
          }
          pusage.stat(child.PID, processStat);
        });
      });
    }
    const self = this;
    this._exceedCount = 0;
    this._handle = setInterval(doWatch, this._interval);
  }

  unwatch() {
    clearInterval(this._handle);
    pusage.unmonitor(this._pid);
    this._children.forEach(pid => pusage.unmonitor(pid));
  }

  kill() {
    var pid = this.pid;
    psTree(pid, (err, children) => {
      if (!err) {
        exec(['kill', '-9', pid].concat(children.map(p => p.PID)).join(" "));
      }
    });
  }
}

module.exports = ProcessWatcher;
