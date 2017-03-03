const _ = require('lodash');
const Marionette = require('backbone.marionette');
const template = require('../templates/item.hbs');
const config = require('../config');

const moment = require('moment');

var ItemView = Marionette.View.extend({
  template: template,
  events: {
    'click a.show-comments': 'showComments',
    'click a.more': 'onMore',
    'click a.less': 'onLess'
  },
  onMore(e) {
    e.preventDefault();
    var _this = $(e.target);
    _this.hide().prev().hide();
    _this.next().show();
  },
  onLess(e) {
    e.preventDefault();
    var _this = $(e.target);
    _this.parent().hide().prev().show().prev().show();
  },
  onRender() {
    this.$el.show();
  },
  showComments(e) {
    e.preventDefault();

    this.model.fetch({
      success() {
        console.log(arguments);
      }
    })

    return false;
  },
  minimized_elements() {
    var minimized_elements = this.$('p.minimize');

    minimized_elements.each(function() {
      var t = $(this).text();
      if (t.length < 100) return;

      $(this).html(
        t.slice(0, 100) + '<span>... </span><a href="#" class="more">More</a>' +
        '<span style="display:none;">' + t.slice(100, t.length) + ' <a href="#" class="less">Less</a></span>'
      );
    });
  },
  onDomRefresh() {
    this.minimized_elements();
  },
  serializeData() {
    var model = this.model;
    var isDownloadable = this.model.get('downloadable');
    var downloadableUrl = this.model.get('download_url') + '?client_id=' + config.client_id;
    var created_at = this.model.get('created_at');
    var tag_list = "",
      tag_list_field = this.model.get('tag_list');
    var description = this.model.get('description');

    if (tag_list_field) {
      tag_list_field = tag_list_field.split(" ");
      for (var z in tag_list_field) {
        var _tag = String(tag_list_field[z]);
        tag_list += '<span class="label label-info margin-r20">' + _tag + '</span>';
      }
    }
    return _.extend(model.toJSON(), {
      downloadableUrl: (isDownloadable) ? downloadableUrl : false,
      description_short: description,
      day: moment(created_at).format('DD'),
      month: moment(created_at).format('MMM'),
      year: moment(created_at).format('YYYY'),
      tag_list: (tag_list.length) ? tag_list : false
    });
  }
});

module.exports = ItemView;
