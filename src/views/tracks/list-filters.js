const config = require('config');
const Marionette = require('backbone.marionette');
const template = require('templates/tracks/list-filters.hbs');
const moment = require('moment');

require('assets/css/filter.css');

var FiltersView = Marionette.View.extend({
  template: template,
  className: 'filters-content',
  events: {
    'click .cd-filter-trigger': 'triggerFilter',
    'click .cd-close': 'triggerFilter',
    'click .cd-filter-block h4': 'onCloseFilter'
  },
  ui: {
    cdtrigger: '.cd-filter-trigger',
    cdfilter: '.cd-filter',
    cdclose: '.cd-close',
    cdtabfilter: 'cd-tab-filter',
    cdgallery: '.cd-gallery',
    cdfilterblock: '.cd-filter-block'
  },
  triggerFilter(e) {
    e.preventDefault();
    for(var z in this.ui) {
      this.getUI(z).toggleClass('filter-is-visible');
    }
  },
  onCloseFilter(e) {
    e.preventDefault();
    var target = $(e.currentTarget);
    target.toggleClass('closed').siblings('.cd-filter-content').slideToggle(300);
    return false;
  }
});

module.exports = FiltersView;
