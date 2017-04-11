const config = require('config');
const Marionette = require('backbone.marionette');
const template = require('templates/tracks/list-filters.hbs');
const moment = require('moment');
const TagsView = require('views/tags');

require('assets/css/filter.css');
require('assets/css/search-box.css');

var FiltersView = Marionette.View.extend({
  template: template,
  className: 'filters-content',
  isOpen: false,
  regions: {
    tags: '#tags-content'
  },
  events: {
    'click .cd-filter-trigger': 'triggerFilter',
    'click .cd-close': 'triggerFilter',
    'click .cd-filter-block h4': 'onCloseFilter',
    'click .apply-filters': 'onFiltersApply',
    'click .searchbox-icon': 'onToggleSearch',
    'click .searchbox-input': 'onButtonUp'
  },
  ui: {
    cdtrigger: '.cd-filter-trigger',
    cdfilter: '.cd-filter',
    cdclose: '.cd-close',
    cdtabfilter: 'cd-tab-filter',
    cdgallery: '.cd-gallery',
    cdfilterblock: '.cd-filter-block',
    filterform: 'form.form-filters',
    searchButton: '.searchbox-icon',
    searchBox: '.search-box',
    inputBox: '.searchbox-input'
  },
  onRender(e) {
    var tags = new TagsView();
    this.showChildView('tags', tags);
  },
  onButtonUp(e) {
    e.preventDefault();
    var inputVal = $.trim(this.getUI('inputBox').val()).length;

    if (inputVal !== 0) {
      this.getUI('searchButton').css('display', 'none');
    } else {
      this.getUI('inputBox').val('');
      this.getUI('searchButton').css('display', 'block');
    }
  },
  onToggleSearch(e) {
    e.preventDefault();

    if (this.isOpen == false) {
      this.getUI('searchBox').addClass('searchbox-open');
      this.getUI('inputBox').focus();
      this.isOpen = true;
    } else {
      this.getUI('searchBox').addClass('searchbox-open');
      this.getUI('inputBox').focusout();
      this.isOpen = false;
    }
    return false;
  },
  onFiltersApply(e) {
    e.preventDefault();
    var data = this.getUI('filterform').serializeArray();

    if (!data.length) return false;

    //trigger event to filter tracks list collection with data;
    this.triggerMethod('filter:data', data);
    return false;
  },
  triggerFilter(e) {
    e.preventDefault();
    var target = this.$(e.currentTarget);

    for (var z in this.ui) {
      var el = this.getUI(z);
      el.toggleClass('filter-is-visible');
    }

    this.getUI('cdfilter').css({
      opacity: (!target.hasClass('cd-close')) ? 1 : 0
    })
  },
  onCloseFilter(e) {
    e.preventDefault();
    var target = $(e.currentTarget);
    target.toggleClass('closed').siblings('.cd-filter-content').slideToggle(300);
    return false;
  }
});

module.exports = FiltersView;
