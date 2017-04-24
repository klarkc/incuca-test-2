"use strict";

// Config app module
angular.module('app')
  .config([
    "$mdThemingProvider",
    "$mdIconProvider",
    function(themeConfig, iconConfig) {
      var contentIconPath = 'bower_components/material-design-icons/content/svg/production';
      iconConfig.iconSet('content:add', contentIconPath + '/ic_add_48px.svg');
      iconConfig.iconSet('content:archive', contentIconPath + '/ic_archive_48px.svg');
      themeConfig.theme('default');
    }
  ]);
