//http://codepen.io/Benny29390/pen/dOdNqO?editors=0010
//
const config = require('config');
const Marionette = require('backbone.marionette');
const template = require('templates/filters.hbs');

require('assets/css/filters.css');

var FiltersView = Marionette.View.extend({
  template: template,
  checkvar: false,
  events: {
    'click form > ul > li': 'onCollapse',
    'click .nz-input-checkbox': 'onClickInput',
    'click .nz-input-radio': 'onClickRadio'
  },
  ui: {

  },
  _check() {
    if ($(".nz-input-checkbox").is(":checked")) {
      this.checkvar = true;
    } else {
      this.checkvar = false;
    }
  },
  initialize(opts) {
    _.bindAll(this, '_check');
  },
  onClickRadio(e) {
    var target = this.$(e.target);

    this.$(".nz-input-radio").parent("li").removeClass("active");
	  target.closest("li").addClass("active");
  },
  onClickInput(e) {
    this._check();

    var target = this.$(e.target);
    var parent = target.parent("li").parent("ul").parent("li");

    if (target.prop("checked")) {
      target.closest("li").addClass("active");
    } else {
      target.closest("li").removeClass("active");
    };
    if (this.checkvar == true) {
      $(".nz-field-submit").addClass("submitactive");
    } else {
      $(".nz-field-submit").removeClass("submitactive");
    };
    if (parent.find(".nz-input-checkbox").is(":checked")) {
      parent.addClass("hasfilter");
    } else {
      parent.removeClass("hasfilter");
    }
  },
  onCollapse(e) {
    var target = this.$(e.target);
    if (target.hasClass("active")) {
      if (target.is('.nz-input-checkbox, .nz-input-radio')) {
        return false;
      } else {
        target.removeClass("active");
      }
    } else {
      $("#filter > form > ul > li").removeClass("active");
      target.addClass("active");
    }
  }
});

module.exports = FiltersView;
