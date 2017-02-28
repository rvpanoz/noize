const _ = require('lodash');
const Marionette = require('backbone.marionette');
const template = require('../templates/item.hbs');
const config = require('../config');

const moment = require('moment');

var ItemView = Marionette.View.extend({
  template: template,
  className: 'col-lg-4 col-md-4 col-sm-12 col-xs-12',
  events: {
    'click a.show-comments': 'showComments',
    // 'click a.download': 'download'
  },
  onRender() {
    this.$el.show();
  },
  download(e) {
    e.preventDefault();

    var id = this.model.get('id');

    $.ajax({
      url: config.api.url + '/tracks/download/' + id,
      success() {
        console.log(arguments);
      }
    });

    return false;
  },
  showComments(e) {
    e.preventDefault();

    this.model.fetch({
      success() {
        console.log(arguments);
      }
    })

    // $("#sidebar-wrapper").toggleClass("active");
    return false;
  },
  serializeData() {
    var model = this.model;


    // var description = this.model.get('description').replace(/(<([^>]+)>)/ig,"");
    var isDownloadable = this.model.get('downloadable');
    var downloadableUrl = this.model.get('download_url') + '?client_id=' + config.client_id;
    var created_at = this.model.get('created_at');
    //
    return _.extend(model.toJSON(), {
      downloadableUrl: (isDownloadable) ? downloadableUrl : false,
      day: moment(created_at).format('DD'),
      month: moment(created_at).format('MMM'),
      year: moment(created_at).format('YYYY')
    });
  }
});

module.exports = ItemView;
