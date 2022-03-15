/* jshint node: true */
'use strict';

var path = require('path');
var fs = require('fs-extra');

module.exports = {
  name: 'ember-cli-post-build-copy',

  configObject: {},
  buildEnv: "",

  log:function(msg){
    if(this.configObject["ember-cli-post-build-copy"] && this.configObject["ember-cli-post-build-copy"].verbose){
      console.log(msg);
    }
  },

  postBuild: function (results) {
      var self = this;
      self.log("ember-cli-post-build-copy: copying from "+results.directory+".");
      if(self.configObject && self.configObject["ember-cli-post-build-copy"]){
        let copyConfig = self.configObject["ember-cli-post-build-copy"];

        let replace = false;
        if(copyConfig.replace){
          replace = copyConfig.replace
        }

        let fsExtraConfig = {};
        if (copyConfig.fsExtra) {
          fsExtraConfig = copyConfig.fsExtra;
        }
        if (fsExtraConfig.overwrite === undefined) {
          fsExtraConfig.overwrite = replace;
        }

        if(copyConfig[self.buildEnv]){
          let copyEnvConfig = copyConfig[self.buildEnv];
          self.log("ember-cli-post-build-copy: copying files "+JSON.stringify(copyEnvConfig)+".");
          for (var i = 0; i < copyEnvConfig.length; i++) {
              let pair = copyEnvConfig[i]
              let src = path.resolve(results.directory+pair[0])
              let dest = path.resolve(pair[1])
              self.log("ember-cli-post-build-copy: copying "+src+" to "+dest);
              try {
                fs.copySync(src, dest, fsExtraConfig);
              } catch (err) {
                console.error('Oh no, there was an error: ' + err.message)
              }
          }
        }else{
          self.log("ember-cli-post-build-copy: no copy config for "+this.buildEnv)
        }
      }else{
        self.log("ember-cli-post-build-copy: no ENV['ember-cli-post-build-copy']");
      }
  },

  config: function (env, baseConfig) {

    if(this.buildEnv === ""){
      this.configObject = baseConfig;
      this.log("ember-cli-post-build-copy: build env set to "+env);
      this.buildEnv = env;
    }

  }
};
